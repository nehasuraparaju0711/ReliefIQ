import { NextRequest, NextResponse } from 'next/server';
import { crisisService } from '@/lib/services/crisisService';
import { CrisisType } from '@/lib/types';
import { z } from 'zod';

const AllocateRequestSchema = z.object({
  crisisType: z.enum(['flood', 'heatwave', 'drought', 'cyclone', 'outbreak']).default('flood'),
  fairnessCapPct: z.number().min(10).max(100).default(35),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const validated = AllocateRequestSchema.safeParse(body);

    const crisisType: CrisisType = validated.success ? validated.data.crisisType : 'flood';
    const fairnessCapPct = validated.success ? validated.data.fairnessCapPct : 35;

    const plan = crisisService.runOptimizer(crisisType, fairnessCapPct);
    return NextResponse.json(plan);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message, code: 'OPTIMIZER_FAILED' }, { status: 500 });
  }
}
