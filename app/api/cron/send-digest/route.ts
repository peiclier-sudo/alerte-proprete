import { NextRequest, NextResponse } from 'next/server';
import { sendDigest } from '../../../../lib/emailer';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Non autorise.' }, { status: 401 });
  }

  try {
    const count = await sendDigest();
    return NextResponse.json({ success: true, emails_sent: count });
  } catch (error) {
    console.error('[CRON send-digest] Erreur:', error);
    return NextResponse.json({ error: 'Echec envoi emails' }, { status: 500 });
  }
}
