import { z } from "zod"

export const ROLE_INTEREST_OPTIONS = [
  "Leadership Roles (President, Vice President)",
  "Tech Team (Tech Lead, Contributor)",
  "Events Team (Logistics, Finances)",
  "Media Team (Photography, Cinematography)",
  "Content Team (Social Media, Reels)",
] as const

export const joinApplicationSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters."),
  email: z.string().trim().email("Enter a valid email address."),
  phone: z
    .string()
    .trim()
    .regex(/^[+\d][\d\s-]{7,}$/, "Enter a valid phone number."),
  yearBranch: z.string().trim().min(2, "Enter your year and branch."),
  roleInterest: z
    .string()
    .trim()
    .refine((value) => ROLE_INTEREST_OPTIONS.includes(value as (typeof ROLE_INTEREST_OPTIONS)[number]), "Please choose one option from the dropdown."),
  experience: z
    .string()
    .trim()
    .min(25, "Please provide more detail about your experience (minimum 25 characters)."),
  motivation: z
    .string()
    .trim()
    .min(30, "Please share stronger motivation (minimum 30 characters)."),
  commitment: z.string().trim().min(1, "Tell us your expected weekly commitment."),
})

export type JoinApplicationInput = z.infer<typeof joinApplicationSchema>
