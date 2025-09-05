"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getProblemStatements, ProblemStatement } from "@/services/problem-statement-service";
import { Badge } from "./ui/badge";

export default function ProblemStatements() {
  const router = useRouter();
  const [filter, setFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statements, setStatements] = useState<ProblemStatement[]>([]);

  useEffect(() => {
    async function fetchStatements() {
      const data = await getProblemStatements();
      setStatements(data);
    }
    fetchStatements();
  }, []);


  const handleRowClick = (psNumber: string) => {
    router.push(`/register/${psNumber}`);
  };

  const filteredStatements = statements.filter((statement) => {
    const searchLower = filter.toLowerCase();
    const matchesFilter =
      statement.title.toLowerCase().includes(searchLower) ||
      statement.organization.toLowerCase().includes(searchLower) ||
      statement.psNumber.toLowerCase().includes(searchLower) ||
      statement.theme.toLowerCase().includes(searchLower);

    const matchesCategory =
      categoryFilter === "all" || statement.category === categoryFilter;

    return matchesFilter && matchesCategory;
  });

  const categories = ["all", ...Array.from(new Set(statements.map(p => p.category)))];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Problem Statements</CardTitle>
        <CardDescription>
          Browse and select a problem statement to register your team.
        </CardDescription>
        <div className="flex flex-col sm:flex-row gap-2 pt-4">
          <Input
            placeholder="Filter by keyword, PS Number, organization..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="max-w-sm"
          />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">S.No.</TableHead>
                <TableHead>Problem Statement</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Theme</TableHead>
                <TableHead className="text-right">PS Number</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStatements.map((statement) => (
                <TableRow
                  key={statement.sNo}
                  onClick={() => handleRowClick(statement.psNumber)}
                  className="cursor-pointer"
                >
                  <TableCell>{statement.sNo}</TableCell>
                  <TableCell className="font-medium">{statement.title}</TableCell>
                  <TableCell>{statement.organization}</TableCell>
                  <TableCell>
                    <Badge variant={statement.category === 'Software' ? 'default' : 'secondary'}>{statement.category}</Badge>
                  </TableCell>
                  <TableCell>{statement.theme}</TableCell>
                  <TableCell className="text-right">{statement.psNumber}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
