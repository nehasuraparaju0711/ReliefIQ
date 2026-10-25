import { NextRequest, NextResponse } from 'next/server';
import { crisisService } from '@/lib/services/crisisService';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const zone = crisisService.getZoneById(id);
    if (!zone) {
      return NextResponse.json({ error: `Zone ${id} not found`, code: 'ZONE_NOT_FOUND' }, { status: 404 });
    }
    return NextResponse.json(zone);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message, code: 'ZONE_FETCH_FAILED' }, { status: 500 });
  }
}
