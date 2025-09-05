import { getRegistrations } from '@/services/problem-statement-service';
import { NextRequest, NextResponse } from 'next/server';

function convertToCSV(data: any[]) {
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

  const headers = Object.keys(registrations[0]);
  const csvRows = [headers.join(',')];

  for (const row of registrations) {
    const values = headers.map(header => {
      const escaped = ('' + row[header]).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
}

export async function GET(req: NextRequest) {
  try {
    const registrations = await getRegistrations();
    const csvData = convertToCSV(registrations);

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
