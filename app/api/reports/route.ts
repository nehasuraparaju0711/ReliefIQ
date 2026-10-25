import { NextRequest, NextResponse } from 'next/server';
import { crisisService } from '@/lib/services/crisisService';
import { SeveritySchema } from '@/lib/types';
import { z } from 'zod';

const CreateReportSchema = z.object({
  type: z.enum([
    'flood_inundation',
    'food_shortage',
    'medical_emergency',
    'shelter_damaged',
    'drinking_water_scarcity',
    'power_road_blocked',
  ]),
  typeLabel: z.string().min(1),
  zoneId: z.string().min(1),
  zoneName: z.string().min(1),
  location: z.string().min(1),
  coordinates: z.tuple([z.number(), z.number()]),
  urgency: SeveritySchema,
  description: z.string().min(3),
  reporterName: z.string().min(1),
  reporterPhone: z.string().min(1),
  imageUrl: z.string().optional(),
});

export async function GET() {
  try {
    const reports = crisisService.getReports();
    return NextResponse.json(reports);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message, code: 'REPORTS_FETCH_FAILED' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = CreateReportSchema.parse(body);

    const newReport = crisisService.createReport(validated);
    return NextResponse.json(newReport, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Validation error';
    return NextResponse.json({ error: message, code: 'REPORT_CREATION_FAILED' }, { status: 400 });
  }
}
