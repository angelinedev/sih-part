import { getRegistrations } from '@/services/problem-statement-service';
import { NextRequest, NextResponse } from 'next/server';

function escapeCsvCell(cell: any) {
  let cellStr = ('' + cell).trim();
  // If the cell contains a comma, a quote, or a newline, wrap it in double quotes.
  if (/[",\n\r]/.test(cellStr)) {
    // Escape existing double quotes by doubling them
    cellStr = `"${cellStr.replace(/"/g, '""')}"`;
  }
  return cellStr;
}

function convertToCsv(data: any[]) {
  // Return an empty string to make the CSV file empty.
  return '';
}

export async function GET(req: NextRequest) {
  try {
    const registrations = await getRegistrations();
    const csvData = convertToCsv(registrations);

    return new NextResponse(csvData, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="registrations.csv"',
      },
    });
  } catch (error) {
    console.error('Failed to generate CSV:', error);
    return new NextResponse('Error generating CSV file.', { status: 500 });
  }
}
