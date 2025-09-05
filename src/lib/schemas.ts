import * as z from "zod";

const memberSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  department: z.string().min(1, { message: "Department is required." }),
  year: z.string().min(1, { message: "Please select a year." }),
  gender: z.enum(["male", "female"], {
    required_error: "You need to select a gender.",
  }),
});

export const formSchema = z.object({
  teamName: z.string().min(3, { message: "Team name must be at least 3 characters." }),
  problemStatement: z.string().min(1, { message: "Please select a problem statement." }),
  members: z.array(memberSchema).length(6, { message: "A team must have exactly 6 members." }),
});

export type FormValues = z.infer<typeof formSchema>;
