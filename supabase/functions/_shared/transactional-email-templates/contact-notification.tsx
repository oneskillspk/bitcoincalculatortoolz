/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Bitcoin Calculator Tools'

interface ContactNotificationProps {
  firstName?: string
  lastName?: string
  email?: string
  subject?: string
  message?: string
}

const ContactNotificationEmail = ({
  firstName,
  lastName,
  email,
  subject,
  message,
}: ContactNotificationProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>📬 New contact: {subject || 'No subject'}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={headerSection}>
          <Heading style={headerTitle}>📬 New Contact Form Submission</Heading>
        </Section>
        <Section style={bodySection}>
          <table style={table}>
            <tr>
              <td style={labelCell}>Name:</td>
              <td style={valueCell}>
                {firstName} {lastName}
              </td>
            </tr>
            <tr>
              <td style={labelCell}>Email:</td>
              <td style={valueCell}>
                {email ? (
                  <Link href={`mailto:${email}`} style={emailLink}>
                    {email}
                  </Link>
                ) : (
                  'N/A'
                )}
              </td>
            </tr>
            <tr>
              <td style={labelCell}>Subject:</td>
              <td style={valueBoldCell}>{subject}</td>
            </tr>
          </table>
          <Hr style={hr} />
          <Heading as="h3" style={messageHeading}>
            Message:
          </Heading>
          <Section style={messageBox}>
            <Text style={messageText}>{message}</Text>
          </Section>
          <Text style={footer}>
            Sent via bitcoincalculator.tools contact form •{' '}
            {new Date().toISOString()}
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

const TEAM_EMAIL = Deno.env.get('CONTACT_NOTIFICATION_EMAIL') || 'bitcoincalculatortoolkit@gmail.com'

export const template = {
  component: ContactNotificationEmail,
  subject: (data: Record<string, any>) =>
    `New Contact: ${data.subject || 'No subject'}`,
  displayName: 'Contact form notification (team)',
  to: TEAM_EMAIL,
  previewData: {
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane@example.com',
    subject: 'Bitcoin DCA Strategy',
    message:
      'Hi, I have a question about the DCA calculator. Can you help?',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Roboto, Arial, sans-serif' }
const container = { maxWidth: '600px', margin: '0 auto' }
const headerSection = {
  background: 'linear-gradient(135deg, #b54d08 0%, #a04407 100%)',
  padding: '24px',
  borderRadius: '12px 12px 0 0',
}
const headerTitle = {
  color: '#ffffff',
  margin: '0',
  fontSize: '20px',
  fontWeight: 'bold' as const,
}
const bodySection = {
  backgroundColor: '#ffffff',
  padding: '24px',
  border: '1px solid #e5e7eb',
  borderTop: 'none',
  borderRadius: '0 0 12px 12px',
}
const table = { width: '100%', borderCollapse: 'collapse' as const }
const labelCell = {
  padding: '8px 0',
  color: '#6b7280',
  fontSize: '14px',
  width: '100px',
  verticalAlign: 'top' as const,
}
const valueCell = {
  padding: '8px 0',
  fontSize: '14px',
  color: '#374151',
}
const valueBoldCell = {
  ...valueCell,
  fontWeight: 'bold' as const,
}
const emailLink = { color: '#b54d08', textDecoration: 'none' }
const hr = { borderColor: '#e5e7eb', margin: '16px 0' }
const messageHeading = {
  margin: '0 0 8px 0',
  fontSize: '14px',
  color: '#374151',
  fontWeight: 'bold' as const,
}
const messageBox = {
  backgroundColor: '#f9fafb',
  padding: '16px',
  borderRadius: '8px',
}
const messageText = {
  fontSize: '14px',
  color: '#374151',
  lineHeight: '1.6',
  margin: '0',
  whiteSpace: 'pre-wrap' as const,
}
const footer = {
  marginTop: '16px',
  fontSize: '12px',
  color: '#9ca3af',
}
