import { NextRequest, NextResponse } from 'next/server';
import { crisisService } from '@/lib/services/crisisService';
import { z } from 'zod';

const ApproveSchema = z.object({
  planId: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const validated = ApproveSchema.safeParse(body);

    const planId = validated.success ? validated.data.planId : 'plan-latest';
    const result = crisisService.approvePlan(planId);

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message, code: 'PLAN_APPROVE_FAILED' }, { status: 500 });
  }
}
