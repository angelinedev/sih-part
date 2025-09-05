import { getRegistrations } from '@/services/problem-statement-service';
import { NextRequest, NextResponse } from 'next/server';

function escapeCsvCell(cell: any) {
  let cellStr = ('' + cell).trim();
  if (/[",\n\r]/.test(cellStr)) {
    cellStr = `"${cellStr.replace(/"/g, '""')}"`;
  }
  return cellStr;
}

function convertToCsv(data: any[]) {
  if (!data || data.length === 0) {
    return '';
  }

  const headers = [
    'Team Name',
    'Problem Statement',
    'Member 1 Name', 'Member 1 Dept', 'Member 1 Year', 'Member 1 Gender',
    'Member 2 Name', 'Member 2 Dept', 'Member 2 Year', 'Member 2 Gender',
    'Member 3 Name', 'Member 3 Dept', 'Member 3 Year', 'Member 3 Gender',
    'Member 4 Name', 'Member 4 Dept', 'Member 4 Year', 'Member 4 Gender',
    'Member 5 Name', 'Member 5 Dept', 'Member 5 Year', 'Member 5 Gender',
    'Member 6 Name', 'Member 6 Dept', 'Member 6 Year', 'Member 6 Gender',
  ];

  const csvRows = [headers.join(',')];

  data.forEach((registration) => {
    const row: any[] = [
      escapeCsvCell(registration.teamName),
      escapeCsvCell(registration.problemStatement),
    ];
    registration.members.forEach((member: any) => {
      row.push(escapeCsvCell(member.name));
      row.push(escapeCsvCell(member.department));
      row.push(escapeCsvCell(member.year));
      row.push(escapeCsvCell(member.gender));
    });
    csvRows.push(row.join(','));
  });

  return csvRows.join('\n');
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
