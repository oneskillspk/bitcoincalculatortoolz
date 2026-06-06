/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Bitcoin Calculator Tools'

interface ContactConfirmationProps {
  firstName?: string
  subject?: string
}

const ContactConfirmationEmail = ({ firstName, subject }: ContactConfirmationProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Thanks for reaching out to {SITE_NAME}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={logo}>₿itcoin Calculator Tools</Text>
        <Heading style={h1}>
          {firstName ? `Hi ${firstName}! 👋` : 'Thanks for reaching out! 👋'}
        </Heading>
        <Text style={text}>
          We've received your message
          {subject ? <> about <strong>"{subject}"</strong></> : null} and
          will get back to you within <strong>24 hours</strong>.
        </Text>
        <Text style={text}>
          In the meantime, feel free to explore our free Bitcoin calculators
          and tools.
        </Text>
        <Button style={button} href="https://bitcoincalculator.tools">
          Explore Tools
        </Button>
        <Hr style={hr} />
        <Text style={footer}>
          Best regards, The {SITE_NAME} Team
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: ContactConfirmationEmail,
  subject: 'We received your message — Bitcoin Calculator Tools',
  displayName: 'Contact form confirmation',
  previewData: { firstName: 'Jane', subject: 'Bitcoin DCA Strategy' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Roboto, Arial, sans-serif' }
const container = { padding: '20px 25px' }
const logo = {
  fontSize: '18px',
  fontWeight: 'bold' as const,
  color: '#b54d08',
  margin: '0 0 24px',
}
const h1 = {
  fontSize: '22px',
  fontWeight: 'bold' as const,
  color: '#071133',
  margin: '0 0 20px',
}
const text = {
  fontSize: '14px',
  color: '#3d4a5c',
  lineHeight: '1.6',
  margin: '0 0 20px',
}
const button = {
  backgroundColor: '#b54d08',
  color: '#ffffff',
  fontSize: '14px',
  borderRadius: '12px',
  padding: '12px 20px',
  textDecoration: 'none',
}
const hr = { borderColor: '#e5e7eb', margin: '24px 0' }
const footer = { fontSize: '12px', color: '#999999', margin: '0' }
