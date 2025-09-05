import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const csvFilePath = path.join(process.cwd(), 'data', 'registrations.csv');

export async function GET(req: NextRequest) {
  try {
    const fileBuffer = await fs.readFile(csvFilePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="registrations.csv"',
      },
    });
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      // File not found, which means no registrations yet.
      // Return an empty CSV with headers.
      const headers = [
        'Team Name', 'Problem Statement',
        'Member 1 Name', 'Member 1 Dept', 'Member 1 Year', 'Member 1 Gender',
        'Member 2 Name', 'Member 2 Dept', 'Member 2 Year', 'Member 2 Gender',
        'Member 3 Name', 'Member 3 Dept', 'Member 3 Year', 'Member 3 Gender',
        'Member 4 Name', 'Member 4 Dept', 'Member 4 Year', 'Member 4 Gender',
        'Member 5 Name', 'Member 5 Dept', 'Member 5 Year', 'Member 5 Gender',
        'Member 6 Name', 'Member 6 Dept', 'Member 6 Year', 'Member 6 Gender',
      ].join(',');
      
      return new NextResponse(headers, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename="registrations.csv"',
        },
      });
    }

    console.error('Failed to read CSV file:', error);
    return new NextResponse('Error generating CSV file.', { status: 500 });
  }
}
