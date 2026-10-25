import { NextRequest, NextResponse } from 'next/server';
import { crisisService } from '@/lib/services/crisisService';
import { z } from 'zod';

const RestockSchema = z.object({
  resourceId: z.string(),
  quantity: z.number().positive(),
});

export async function GET() {
  try {
    const resources = crisisService.getResources();
    const warehouses = crisisService.getWarehouses();
    return NextResponse.json({ resources, warehouses });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message, code: 'INVENTORY_FETCH_FAILED' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = RestockSchema.parse(body);

    const success = crisisService.requestRestock(validated.resourceId, validated.quantity);
    return NextResponse.json({ success, message: `Restock request for ${validated.quantity} units submitted.` });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message, code: 'RESTOCK_REQUEST_FAILED' }, { status: 400 });
  }
}
