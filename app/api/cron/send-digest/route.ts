import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function GET(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY || '')

  try {
    const { data, error } = await resend.emails.send({
      from: 'AlerteProprete <onboarding@resend.dev>',
      to: 'TON-VRAI-EMAIL-ICI',
      subject: 'Test AlerteProprete',
      html: '<h1>Ca marche!</h1><p>Si tu vois cet email, Resend fonctionne.</p>',
    })

    return NextResponse.json({
      resend_key: process.env.RESEND_API_KEY ? 'SET' : 'MISSING',
      data,
      error,
    })
  } catch (err) {
    return NextResponse.json({
      resend_key: process.env.RESEND_API_KEY ? 'SET' : 'MISSING',
      error: String(err),
    })
  }
}