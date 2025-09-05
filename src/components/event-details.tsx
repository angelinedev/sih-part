import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, FileText, Hash, Palette, Tag, Users } from "lucide-react";

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

export default function EventDetails() {
  return (
    <Card className="w-full sticky top-8">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
          Hackathon Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <DetailItem
          icon={<Building size={20} />}
          label="Organization"
          value="Innovate Corp"
        />
        <DetailItem
          icon={<FileText size={20} />}
          label="Problem Statement Title"
          value="AI for Sustainable Agriculture"
        />
        <DetailItem
          icon={<Tag size={20} />}
          label="Category"
          value={<Badge variant="secondary">AI & Machine Learning</Badge>}
        />
        <DetailItem icon={<Hash size={20} />} label="PS Number" value="PS-042" />
        <DetailItem
          icon={<Users size={20} />}
          label="Submitted Ideas"
          value="24 Teams Registered"
        />
        <DetailItem
          icon={<Palette size={20} />}
          label="Theme"
          value={<Badge variant="outline">Future of Technology</Badge>}
        />
      </CardContent>
    </Card>
  );
}
