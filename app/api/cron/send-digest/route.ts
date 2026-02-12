import { NextRequest, NextResponse } from 'next/server'
import { sendDigest } from '../../../../lib/emailer'

export async function GET(req: NextRequest) {
  try {
    const count = await sendDigest()
    return NextResponse.json({ success: true, emails_sent: count })
  } catch (error) {
    return NextResponse.json(
      { error: 'Echec envoi emails', details: String(error) },
      { status: 500 }
    )
  }
}