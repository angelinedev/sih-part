'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, FileText, Hash, Palette, Tag, Users } from "lucide-react";
import { getProblemStatementByPsNumber, ProblemStatement } from "@/services/problem-statement-service";
import { useEffect, useState } from "react";

const DetailItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | React.ReactNode;
}) => (
  <div className="flex items-start space-x-4">
    <div className="text-primary mt-1">{icon}</div>
    <div>
      <p className="font-semibold text-card-foreground">{label}</p>
      <div className="text-muted-foreground">{value}</div>
    </div>
  </div>
);

export default function EventDetails({ psNumber }: { psNumber: string }) {
  const [statement, setStatement] = useState<ProblemStatement | null>(null);

  useEffect(() => {
    async function fetchStatement() {
      const data = await getProblemStatementByPsNumber(psNumber);
      setStatement(data);
    }
    if (psNumber) {
      fetchStatement();
    }
  }, [psNumber]);

  if (!statement) {
    return (
      <Card className="w-full sticky top-8">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            Problem Statement Not Found
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>The requested problem statement could not be found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full sticky top-8">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
          Problem Statement Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <DetailItem
          icon={<Building size={20} />}
          label="Organization"
          value={statement.organization}
        />
        <DetailItem
          icon={<FileText size={20} />}
          label="Problem Statement Title"
          value={statement.title}
        />
        <DetailItem
          icon={<Tag size={20} />}
          label="Category"
          value={<Badge variant="secondary">{statement.category}</Badge>}
        />
        <DetailItem icon={<Hash size={20} />} label="PS Number" value={statement.psNumber} />
        <DetailItem
          icon={<Palette size={20} />}
          label="Theme"
          value={<Badge variant="outline">{statement.theme}</Badge>}
        />
      </CardContent>
    </Card>
  );
}
