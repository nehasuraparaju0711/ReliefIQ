import { NextRequest, NextResponse } from 'next/server';
import { crisisService } from '@/lib/services/crisisService';
import { z } from 'zod';

const UpdateDispatchSchema = z.object({
  id: z.string(),
  status: z.enum(['pending', 'in_transit', 'delivered']),
});

export async function GET() {
  try {
    const tasks = crisisService.getDispatchTasks();
    return NextResponse.json(tasks);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message, code: 'DISPATCH_FETCH_FAILED' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = UpdateDispatchSchema.parse(body);

    const updatedTask = crisisService.updateDispatchTaskStatus(validated.id, validated.status);
    if (!updatedTask) {
      return NextResponse.json({ error: 'Task not found', code: 'TASK_NOT_FOUND' }, { status: 404 });
    }

    return NextResponse.json(updatedTask);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message, code: 'DISPATCH_UPDATE_FAILED' }, { status: 400 });
  }
}
