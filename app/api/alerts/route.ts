import { NextRequest, NextResponse } from 'next/server';
import { crisisService } from '@/lib/services/crisisService';
import { z } from 'zod';

const MarkReadSchema = z.object({
  id: z.string(),
});

export async function GET() {
  try {
    const alerts = crisisService.getAlerts();
    return NextResponse.json(alerts);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message, code: 'ALERTS_FETCH_FAILED' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = MarkReadSchema.parse(body);

    const success = crisisService.markAlertAsRead(validated.id);
    return NextResponse.json({ success });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message, code: 'ALERT_MARK_READ_FAILED' }, { status: 400 });
  }
}
