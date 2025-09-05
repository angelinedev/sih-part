
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { User, Users, Loader2 } from "lucide-react";
import { getProblemStatements, ProblemStatement, registerTeamAction } from "@/services/problem-statement-service";
import { formSchema, FormValues } from "@/lib/schemas";

const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const departments = ["cse", "ece", "it", "eee", "aiml", "aids", "cs", "csbs"];

export default function RegistrationForm({ psNumber }: { psNumber?: string }) {
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [problemStatements, setProblemStatements] = useState<ProblemStatement[]>([]);

  useEffect(() => {
    async function fetchStatements() {
      const data = await getProblemStatements();
      setProblemStatements(data);
    }
    fetchStatements();
  }, []);

  const defaultMembers = Array(6).fill({
    name: "",
    department: "",
    year: "",
    gender: "",
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamName: "",
      problemStatement: psNumber || "",
      members: defaultMembers as FormValues["members"],
    },
  });

  useEffect(() => {
    if (psNumber) {
      form.setValue("problemStatement", psNumber);
    }
  }, [psNumber, form]);


  function onSubmit(data: FormValues) {
    const hasFemale = data.members.some((member) => member.gender === "female");

    if (!hasFemale) {
      toast({
        variant: "destructive",
        title: "Team Composition Error",
        description: "The team must include at least one female member.",
      });
      return;
    }

    startTransition(async () => {
      const result = await registerTeamAction(data);
      if (result.success) {
        toast({
          title: "Registration Submitted!",
          description: `Team "${data.teamName}" has been successfully registered for ${data.problemStatement}.`,
        });
        form.reset();
        router.push('/');
      } else {
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: result.error,
        });
      }
    });
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Register Your Team</CardTitle>
        <CardDescription>Fill out the details below to enter the hackathon.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="teamName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., The Innovators" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="problemStatement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Problem Statement Selection</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a problem statement" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {problemStatements.map((ps) => (
                          <SelectItem key={ps.psNumber} value={ps.psNumber}>
                            {ps.psNumber}: {ps.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2 flex items-center gap-2"><Users size={20}/> Team Members</h3>
              <Accordion type="multiple" className="w-full" defaultValue={['member-0']}>
                {Array.from({ length: 6 }).map((_, index) => (
                  <AccordionItem value={`member-${index}`} key={index}>
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-muted-foreground" /> Member {index + 1}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
                        <FormField
                          control={form.control}
                          name={`members.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Member's Name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`members.${index}.department`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Department</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select department" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {departments.map((dept) => (
                                      <SelectItem key={dept} value={dept}>{dept.toUpperCase()}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`members.${index}.year`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Year</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select year" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {years.map((year) => (
                                    <SelectItem key={year} value={year}>{year}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`members.${index}.gender`}
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel>Gender</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex space-x-4"
                                >
                                  <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="male" />
                                    </FormControl>
                                    <FormLabel className="font-normal">Male</FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="female" />
                                    </FormControl>
                                    <FormLabel className="font-normal">Female</FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" size="lg" className="w-full" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Register Team
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
