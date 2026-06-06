// AUDIT-FIX [NEW-006] 2026-06-05 — Restrict CORS origin from wildcard '*' to production domain
// Before: Access-Control-Allow-Origin: '*' — any site on the internet could invoke this function
//         using the (publicly exposed) anon key, turning it into an open email relay.
// After:  Origin restricted to https://bitcoincalculator.tools only.
//         A preflight from any other origin will be rejected by the browser.
import * as React from 'npm:react@18.3.1'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { TEMPLATES } from '../_shared/transactional-email-templates/registry.ts'

const SITE_NAME = "btccalctool"
const SENDER_DOMAIN = "notify.bitcoincalculator.tools"
const FROM_DOMAIN = "notify.bitcoincalculator.tools"

// AUDIT-FIX [NEW-006]: Restrict CORS to the production domain.
// This prevents cross-origin requests from unauthorized websites.
// Add 'http://localhost:5173' to ALLOWED_ORIGINS during local development only.
const ALLOWED_ORIGINS = [
  'https://bitcoincalculator.tools',
  'https://www.bitcoincalculator.tools',
]

function getCorsHeaders(requestOrigin: string | null): Record<string, string> {
  const origin =
    requestOrigin && ALLOWED_ORIGINS.includes(requestOrigin)
      ? requestOrigin
      : ALLOWED_ORIGINS[0]
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Headers':
      'authorization, x-client-info, apikey, content-type',
    'Vary': 'Origin',
  }
}

function generateToken(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

const ANON_ALLOWED_TEMPLATES: Record<string, { table: string; column: string; windowSeconds: number }> = {
  'contact-confirmation': { table: 'contact_submissions', column: 'email', windowSeconds: 600 },
}

// Templates with a fixed recipient (e.g. admin notifications) still need a
// server-side proof-of-origin so anonymous callers cannot spam the admin inbox
// by invoking the function directly with the anon key. Each rule maps a
// templateData field (the submitter's email) to a DB row that must exist within
// `windowSeconds`. service_role bypasses this gate.
const FIXED_RECIPIENT_TEMPLATES: Record<
  string,
  { table: string; column: string; dataField: string; windowSeconds: number }
> = {
  'contact-notification': {
    table: 'contact_submissions',
    column: 'email',
    dataField: 'email',
    windowSeconds: 600,
  },
}

async function verifyCaller(
  authHeader: string | null,
  supabaseUrl: string,
  serviceRoleKey: string,
  anonKey: string | undefined,
): Promise<{ role: 'service_role' | 'authenticated' | 'anon'; email: string | null }> {
  if (!authHeader?.startsWith('Bearer ')) return { role: 'anon', email: null }
  const token = authHeader.slice(7).trim()
  if (!token) return { role: 'anon', email: null }
  if (token === serviceRoleKey) return { role: 'service_role', email: null }
  if (anonKey && token === anonKey) return { role: 'anon', email: null }
  try {
    const verifier = createClient(supabaseUrl, serviceRoleKey)
    const { data, error } = await verifier.auth.getUser(token)
    if (error || !data?.user) return { role: 'anon', email: null }
    return { role: 'authenticated', email: data.user.email?.toLowerCase() ?? null }
  } catch {
    return { role: 'anon', email: null }
  }
}

Deno.serve(async (req) => {
  const requestOrigin = req.headers.get('Origin')
  const corsHeaders = getCorsHeaders(requestOrigin)

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

  if (!supabaseUrl || !supabaseServiceKey) {
    return new Response(
      JSON.stringify({ error: 'Server configuration error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  let templateName: string
  let recipientEmail: string
  let idempotencyKey: string
  let messageId: string
  let templateData: Record<string, any> = {}
  try {
    const body = await req.json()
    templateName = body.templateName || body.template_name
    recipientEmail = body.recipientEmail || body.recipient_email
    messageId = crypto.randomUUID()
    idempotencyKey = body.idempotencyKey || body.idempotency_key || messageId
    if (body.templateData && typeof body.templateData === 'object') {
      templateData = body.templateData
    }
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid JSON in request body' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  if (!templateName) {
    return new Response(
      JSON.stringify({ error: 'templateName is required' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  const template = TEMPLATES[templateName]
  if (!template) {
    return new Response(
      JSON.stringify({ error: `Template '${templateName}' not found. Available: ${Object.keys(TEMPLATES).join(', ')}` }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  const effectiveRecipient = template.to || recipientEmail
  if (!effectiveRecipient) {
    return new Response(
      JSON.stringify({ error: 'recipientEmail is required (unless the template defines a fixed recipient)' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  if (!template.to) {
    const authHeader = req.headers.get('Authorization')
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')
    const { role, email: callerEmail } = await verifyCaller(authHeader, supabaseUrl, supabaseServiceKey, anonKey)
    const recipientLower = effectiveRecipient.toLowerCase()

    if (role === 'service_role') {
      // unrestricted
    } else if (role === 'authenticated' && callerEmail && callerEmail === recipientLower) {
      // signed-in user emailing themselves
    } else {
      const rule = ANON_ALLOWED_TEMPLATES[templateName]
      if (!rule) {
        return new Response(
          JSON.stringify({ error: 'Not authorised to send this template' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      const sinceIso = new Date(Date.now() - rule.windowSeconds * 1000).toISOString()
      const { data: originRow, error: originError } = await supabase
        .from(rule.table).select('id').eq(rule.column, recipientLower).gte('created_at', sinceIso).limit(1).maybeSingle()
      if (originError || !originRow) {
        return new Response(
          JSON.stringify({ error: 'Not authorised to send to this recipient' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }
  }

  const { data: suppressed, error: suppressionError } = await supabase
    .from('suppressed_emails').select('id').eq('email', effectiveRecipient.toLowerCase()).maybeSingle()
  if (suppressionError) {
    return new Response(
      JSON.stringify({ error: 'Failed to verify suppression status' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
  if (suppressed) {
    await supabase.from('email_send_log').insert({ message_id: messageId, template_name: templateName, recipient_email: effectiveRecipient, status: 'suppressed' })
    return new Response(JSON.stringify({ success: false, reason: 'email_suppressed' }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }

  const normalizedEmail = effectiveRecipient.toLowerCase()
  let unsubscribeToken: string
  const { data: existingToken, error: tokenLookupError } = await supabase
    .from('email_unsubscribe_tokens').select('token, used_at').eq('email', normalizedEmail).maybeSingle()
  if (tokenLookupError) {
    await supabase.from('email_send_log').insert({ message_id: messageId, template_name: templateName, recipient_email: effectiveRecipient, status: 'failed', error_message: 'Failed to look up unsubscribe token' })
    return new Response(JSON.stringify({ error: 'Failed to prepare email' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
  if (existingToken && !existingToken.used_at) {
    unsubscribeToken = existingToken.token
  } else if (!existingToken) {
    unsubscribeToken = generateToken()
    const { error: tokenError } = await supabase.from('email_unsubscribe_tokens').upsert({ token: unsubscribeToken, email: normalizedEmail }, { onConflict: 'email', ignoreDuplicates: true })
    if (tokenError) {
      await supabase.from('email_send_log').insert({ message_id: messageId, template_name: templateName, recipient_email: effectiveRecipient, status: 'failed', error_message: 'Failed to create unsubscribe token' })
      return new Response(JSON.stringify({ error: 'Failed to prepare email' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
    const { data: storedToken, error: reReadError } = await supabase.from('email_unsubscribe_tokens').select('token').eq('email', normalizedEmail).maybeSingle()
    if (reReadError || !storedToken) {
      await supabase.from('email_send_log').insert({ message_id: messageId, template_name: templateName, recipient_email: effectiveRecipient, status: 'failed', error_message: 'Failed to confirm unsubscribe token storage' })
      return new Response(JSON.stringify({ error: 'Failed to prepare email' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
    unsubscribeToken = storedToken.token
  } else {
    await supabase.from('email_send_log').insert({ message_id: messageId, template_name: templateName, recipient_email: effectiveRecipient, status: 'suppressed', error_message: 'Unsubscribe token used but email missing from suppressed list' })
    return new Response(JSON.stringify({ success: false, reason: 'email_suppressed' }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }

  const html = await renderAsync(React.createElement(template.component, templateData))
  const plainText = await renderAsync(React.createElement(template.component, templateData), { plainText: true })
  const resolvedSubject = typeof template.subject === 'function' ? template.subject(templateData) : template.subject

  await supabase.from('email_send_log').insert({ message_id: messageId, template_name: templateName, recipient_email: effectiveRecipient, status: 'pending' })

  const { error: enqueueError } = await supabase.rpc('enqueue_email', {
    queue_name: 'transactional_emails',
    payload: { message_id: messageId, to: effectiveRecipient, from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`, sender_domain: SENDER_DOMAIN, subject: resolvedSubject, html, text: plainText, purpose: 'transactional', label: templateName, idempotency_key: idempotencyKey, unsubscribe_token: unsubscribeToken, queued_at: new Date().toISOString() },
  })

  if (enqueueError) {
    await supabase.from('email_send_log').insert({ message_id: messageId, template_name: templateName, recipient_email: effectiveRecipient, status: 'failed', error_message: 'Failed to enqueue email' })
    return new Response(JSON.stringify({ error: 'Failed to enqueue email' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }

  return new Response(
    JSON.stringify({ success: true, queued: true }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
})
