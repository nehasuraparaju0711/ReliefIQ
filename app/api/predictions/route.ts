import { NextRequest, NextResponse } from 'next/server';
import { crisisService } from '@/lib/services/crisisService';
import { CrisisType, Horizon } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const zoneId = searchParams.get('zone') || 'zone-4';
    const type = (searchParams.get('type') || 'flood') as CrisisType;
    const horizon = (searchParams.get('horizon') || '24h') as Horizon;

    const prediction = crisisService.getPrediction(zoneId, type, horizon);
    return NextResponse.json(prediction);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { error: message, code: 'PREDICTION_COMPUTE_FAILED' },
      { status: 500 }
    );
  }
}
