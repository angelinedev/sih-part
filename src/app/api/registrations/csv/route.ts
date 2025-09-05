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
  if (data.length === 0) {
    return '';
  }

  const registrations = data.flatMap(reg => 
    reg.members.map((member: any) => ({
      teamName: reg.teamName,
      problemStatement: reg.problemStatement,
      memberName: member.name,
      memberDepartment: member.department,
      memberYear: member.year,
      memberGender: member.gender,
    }))
  );

  if (registrations.length === 0) {
    return 'Team Name,Problem Statement,Member Name,Member Department,Member Year,Member Gender\n';
  }

  const headers = Object.keys(registrations[0]);
  const csvRows = [headers.map(escapeCsvCell).join(',')];

  for (const row of registrations) {
    const values = headers.map(header => escapeCsvCell(row[header]));
    csvRows.push(values.join(','));
  }

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
