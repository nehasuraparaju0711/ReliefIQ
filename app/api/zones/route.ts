import { NextResponse } from 'next/server';
import { crisisService } from '@/lib/services/crisisService';

export async function GET() {
  try {
    const zones = crisisService.getZones();
    return NextResponse.json(zones);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message, code: 'ZONES_FETCH_FAILED' }, { status: 500 });
  }
}
