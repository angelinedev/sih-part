import { getRegistrations } from '@/services/problem-statement-service';
import { NextRequest, NextResponse } from 'next/server';

function convertToTxt(data: any[]) {
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
  const txtRows = [headers.join('\t')];

  for (const row of registrations) {
    const values = headers.map(header => {
      // Basic sanitization for tab-separated values
      return ('' + row[header]).replace(/\s/g, ' ');
    });
    txtRows.push(values.join('\t'));
  }

  return txtRows.join('\n');
}

export async function GET(req: NextRequest) {
  try {
    const registrations = await getRegistrations();
    const txtData = convertToTxt(registrations);

    return new NextResponse(txtData, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Content-Disposition': 'attachment; filename="registrations.txt"',
      },
    });
  } catch (error) {
    console.error('Failed to generate TXT:', error);
    return new NextResponse('Error generating TXT file.', { status: 500 });
  }
}
