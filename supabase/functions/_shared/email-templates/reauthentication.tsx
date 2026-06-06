/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface ReauthenticationEmailProps {
  token: string
}

export const ReauthenticationEmail = ({ token }: ReauthenticationEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your verification code</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={logo}>₿itcoin Calculator Tools</Text>
        <Heading style={h1}>Confirm reauthentication</Heading>
        <Text style={text}>Use the code below to confirm your identity:</Text>
        <Text style={codeStyle}>{token}</Text>
        <Text style={footer}>
          This code will expire shortly. If you didn't request this, you can
          safely ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default ReauthenticationEmail

const main = { backgroundColor: '#ffffff', fontFamily: 'Roboto, Arial, sans-serif' }
const container = { padding: '20px 25px' }
const logo = { fontSize: '18px', fontWeight: 'bold' as const, color: '#b54d08', margin: '0 0 24px' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#071133', margin: '0 0 20px' }
const text = { fontSize: '14px', color: '#3d4a5c', lineHeight: '1.5', margin: '0 0 25px' }
const codeStyle = { fontFamily: 'Roboto Mono, Courier, monospace', fontSize: '22px', fontWeight: 'bold' as const, color: '#b54d08', margin: '0 0 30px' }
const footer = { fontSize: '12px', color: '#999999', margin: '30px 0 0' }
