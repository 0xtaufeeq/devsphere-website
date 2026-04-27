"use client"

import Link from "next/link"
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion"
import { FormEvent, KeyboardEvent, useMemo, useState } from "react"
import { JoinConfetti } from "@/components/join-confetti"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { joinApplicationSchema, ROLE_INTEREST_OPTIONS, type JoinApplicationInput } from "@/lib/join-application-schema"

type StepField = {
  id: keyof JoinApplicationInput
  label: string
  hint: string
  placeholder: string
  type: "text" | "email" | "tel" | "textarea" | "select"
  options?: readonly string[]
  required?: boolean
}

const STEP_FIELDS: StepField[] = [
  { id: "fullName", label: "What is your full name?", hint: "Let us know how to address you.", placeholder: "John Doe", type: "text", required: true },
  { id: "email", label: "What is your email address?", hint: "We will use this for updates on your application.", placeholder: "john@college.edu", type: "email", required: true },
  { id: "phone", label: "What is your phone number?", hint: "Include your WhatsApp number if possible.", placeholder: "+91 98765 43210", type: "tel", required: true },
  { id: "yearBranch", label: "What year and branch are you in?", hint: "Example: 2nd Year BCA (Kalvium)", placeholder: "3rd Year BTech (H)", type: "text", required: true },
  {
    id: "roleInterest",
    label: "Which Vertical are you most interested in?",
    hint: "Choose one option from the dropdown.",
    placeholder: "Select an option",
    type: "select",
    options: ROLE_INTEREST_OPTIONS,
    required: true,
  },
  { id: "experience", label: "What relevant experience do you bring?", hint: "Share projects, events, clubs, internships, or initiatives.", placeholder: "Tell us about your work and impact...", type: "textarea", required: true },
  { id: "motivation", label: "Why do you want to join the leadership team?", hint: "We are looking for ownership, initiative, and clarity.", placeholder: "Describe your motivation and what you want to build...", type: "textarea", required: true },
  { id: "commitment", label: "How many hours per week can you commit?", hint: "Be realistic and honest.", placeholder: "8 to 10 hours weekly", type: "text", required: true },
]

const INITIAL_DATA: JoinApplicationInput = {
  fullName: "",
  email: "",
  phone: "",
  yearBranch: "",
  roleInterest: "",
  experience: "",
  motivation: "",
  commitment: "",
}

const FIELD_VALIDATORS = {
  fullName: joinApplicationSchema.shape.fullName,
  email: joinApplicationSchema.shape.email,
  phone: joinApplicationSchema.shape.phone,
  yearBranch: joinApplicationSchema.shape.yearBranch,
  roleInterest: joinApplicationSchema.shape.roleInterest,
  experience: joinApplicationSchema.shape.experience,
  motivation: joinApplicationSchema.shape.motivation,
  commitment: joinApplicationSchema.shape.commitment,
}

const SMOOTH_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

function buildStepPanelVariants(reduce: boolean): Variants {
  return {
    hidden: (dir: number) => ({
      x: reduce ? 0 : dir > 0 ? 60 : -60,
      opacity: 0,
      filter: reduce ? "blur(0px)" : "blur(10px)",
    }),
    show: {
      x: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: { duration: reduce ? 0.2 : 0.5, ease: SMOOTH_EASE },
    },
    exit: (dir: number) => ({
      x: reduce ? 0 : dir > 0 ? -46 : 46,
      opacity: 0,
      filter: reduce ? "blur(0px)" : "blur(8px)",
      transition: { duration: reduce ? 0.16 : 0.35, ease: [0.4, 0, 0.2, 1] },
    }),
  }
}

function getSectionLabel(step: number) {
  if (step <= 2) return "About You"
  if (step <= 4) return "Leadership Fit"
  if (step <= 6) return "Experience and Motivation"
  return "Availability"
}

function getMinLengthHint(field: StepField) {
  if (field.id === "experience") return "Minimum 25 characters."
  if (field.id === "motivation") return "Minimum 30 characters."
  return null
}

function toFriendlyError(message: string, retryAfter: string | null) {
  if (message.includes("Too many attempts")) {
    return retryAfter
      ? `You have reached the submission limit. Please try again in about ${retryAfter} seconds.`
      : "You have reached the submission limit. Please try again shortly."
  }
  if (message.includes("GOOGLE_SHEETS_WEBHOOK")) {
    return "We are temporarily unavailable while submissions are being configured. Please try again in a few minutes."
  }
  if (message.includes("webhook rejected")) {
    return "Submission service is temporarily unavailable. Please retry in a minute."
  }
  return message
}

export default function JoinLeadershipPage() {
  const reduceMotion = useReducedMotion()
  const [step, setStep] = useState(0)
  const [slideDir, setSlideDir] = useState(1)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [confettiKey, setConfettiKey] = useState(0)
  const [data, setData] = useState<JoinApplicationInput>(INITIAL_DATA)
  const [honeypot, setHoneypot] = useState("")
  const [formStartedAt] = useState(() => Date.now())
  const [errors, setErrors] = useState<Partial<Record<keyof JoinApplicationInput, string>>>({})
  const [submitError, setSubmitError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const totalSteps = STEP_FIELDS.length
  const field = STEP_FIELDS[step]
  const sectionLabel = getSectionLabel(step)
  const minLengthHint = getMinLengthHint(field)
  const progress = Math.max(10, ((step + 1) / totalSteps) * 100)
  const contentVariants = useMemo(() => buildStepPanelVariants(!!reduceMotion), [reduceMotion])

  const currentValue = data[field.id].trim()
  const currentFieldError = errors[field.id]
  const isCurrentStepValid = !currentFieldError && currentValue.length > 0

  const updateField = (value: string) => {
    setData((prev) => ({ ...prev, [field.id]: value }))
    const result = FIELD_VALIDATORS[field.id].safeParse(value)
    setErrors((prev) => ({
      ...prev,
      [field.id]: result.success ? "" : result.error.issues[0]?.message ?? "Invalid value.",
    }))
    setSubmitError("")
  }

  const goNext = () => {
    if (!isCurrentStepValid || step >= totalSteps - 1) return
    setSlideDir(1)
    setStep((prev) => prev + 1)
  }

  const goBack = () => {
    if (step <= 0) return
    setSlideDir(-1)
    setStep((prev) => prev - 1)
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!isCurrentStepValid) return
    if (step !== totalSteps - 1) {
      goNext()
      return
    }

    const parsed = joinApplicationSchema.safeParse(data)
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors
      setErrors({
        fullName: fieldErrors.fullName?.[0],
        email: fieldErrors.email?.[0],
        phone: fieldErrors.phone?.[0],
        yearBranch: fieldErrors.yearBranch?.[0],
        roleInterest: fieldErrors.roleInterest?.[0],
        experience: fieldErrors.experience?.[0],
        motivation: fieldErrors.motivation?.[0],
        commitment: fieldErrors.commitment?.[0],
      })
      setSubmitError("Please fix validation errors before submitting.")
      return
    }

    setIsSubmitting(true)
    setSubmitError("")

    try {
      const response = await fetch("/api/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsed.data, honeypot, formStartedAt }),
      })

      const result = (await response.json()) as { ok?: boolean; message?: string }
      if (!response.ok || !result.ok) {
        const retryAfter = response.headers.get("Retry-After")
        setSubmitError(toFriendlyError(result.message ?? "Unable to submit right now. Please try again.", retryAfter))
        return
      }

      setConfettiKey((n) => n + 1)
      setShowConfetti(true)
      setIsSubmitted(true)
    } catch {
      setSubmitError("Network issue while submitting. Please check your connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTextareaKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || event.shiftKey) return
    event.preventDefault()
    if (isSubmitting) return
    if (step === totalSteps - 1) {
      void onSubmit(event as unknown as FormEvent)
      return
    }
    goNext()
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      <JoinConfetti key={confettiKey} fire={showConfetti} />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl"
          animate={reduceMotion ? { x: 0, y: 0 } : { x: [0, 50, -10, 0], y: [0, 30, -20, 0] }}
          transition={{ repeat: reduceMotion ? 0 : Number.POSITIVE_INFINITY, duration: 17, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-24 bottom-16 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl"
          animate={reduceMotion ? { x: 0, y: 0 } : { x: [0, -35, 15, 0], y: [0, -20, 20, 0] }}
          transition={{ repeat: reduceMotion ? 0 : Number.POSITIVE_INFINITY, duration: 14, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 [background:radial-gradient(ellipse_80%_60%_at_50%_50%,transparent_0%,rgba(0,0,0,0.55)_100%)]" />
      </div>

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-4 py-10 md:py-14">
        <motion.div
          className="mb-8 flex items-center justify-between gap-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: SMOOTH_EASE }}
        >
          <Link
            href="/core-team"
            className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/40 px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <span aria-hidden="true">←</span>
            Back
          </Link>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Leadership Application</p>
        </motion.div>

        <div className="relative mb-2 h-2 w-full overflow-hidden rounded-full bg-white/10 shadow-[0_0_24px_rgba(0,0,0,0.4)]">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary via-amber-400/90 to-primary"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 100, damping: 22, mass: 0.65 }}
          />
        </div>

        <div className="mb-8 flex items-center justify-between text-xs text-muted-foreground">
          <p>{sectionLabel}</p>
          <p>
            Question {step + 1} of {totalSteps}
          </p>
        </div>

        <p className="sr-only" role="status" aria-live="polite">
          Step {step + 1} of {totalSteps}. {field.label}
        </p>

        {!isSubmitted ? (
          <motion.section
            className="rounded-3xl border border-border/60 bg-card/50 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset,0_24px_80px_-20px_rgba(0,0,0,0.65)] backdrop-blur-xl md:p-12"
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 95, damping: 20, mass: 0.95 }}
          >
            <form onSubmit={onSubmit} className="space-y-6">
              <AnimatePresence mode="wait" custom={slideDir}>
                <motion.div
                  key={field.id}
                  custom={slideDir}
                  variants={contentVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                >
                  <h1 className="text-2xl font-semibold leading-tight text-foreground md:text-5xl">{field.label}</h1>
                  <p className="mt-3 max-w-3xl text-sm text-muted-foreground md:text-base">{field.hint}</p>

                  <div className="mt-6 text-xs text-muted-foreground">
                    <span>Answer below, then continue.</span>
                    {field.type === "textarea" ? <span className="ml-2">Enter = next question, Shift+Enter = new line.</span> : null}
                    {minLengthHint ? <span className="ml-2">{minLengthHint}</span> : null}
                  </div>

                  <div className="mt-5">
                    <label className="sr-only" htmlFor="website-field">
                      Leave this field empty
                    </label>
                    <input
                      id="website-field"
                      tabIndex={-1}
                      autoComplete="off"
                      value={honeypot}
                      onChange={(event) => setHoneypot(event.target.value)}
                      className="pointer-events-none absolute h-0 w-0 opacity-0"
                      aria-hidden="true"
                    />

                    {field.type === "textarea" ? (
                      <textarea
                        value={data[field.id]}
                        onChange={(event) => updateField(event.target.value)}
                        onKeyDown={handleTextareaKeyDown}
                        placeholder={field.placeholder}
                        rows={7}
                        required={field.required}
                        className="w-full resize-none rounded-2xl border border-border/70 bg-background/55 px-5 py-4 text-base text-foreground shadow-inner outline-none transition [transition-duration:220ms] focus:border-primary/80 focus:shadow-[0_0_0_3px_rgba(231,138,83,0.2)] focus:ring-0"
                      />
                    ) : field.type === "select" ? (
                      <Select value={data[field.id]} onValueChange={updateField} required={field.required}>
                        <SelectTrigger
                          className="h-14 w-full rounded-2xl border-border/70 bg-background/55 px-5 text-base text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_10px_28px_-16px_rgba(231,138,83,0.45)] transition [transition-duration:220ms] hover:border-primary/60 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_14px_36px_-16px_rgba(231,138,83,0.58)] focus-visible:border-primary/85 focus-visible:shadow-[0_0_0_3px_rgba(231,138,83,0.2),0_16px_36px_-16px_rgba(231,138,83,0.5)] focus-visible:ring-0"
                        >
                          <SelectValue placeholder={field.placeholder} />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-primary/30 bg-[linear-gradient(180deg,rgba(16,16,18,0.96),rgba(8,8,10,0.98))] text-foreground shadow-[0_0_0_1px_rgba(231,138,83,0.2),0_24px_72px_-26px_rgba(231,138,83,0.5)] backdrop-blur-xl">
                          {field.options?.map((option) => (
                            <SelectItem
                              key={option}
                              value={option}
                              className="rounded-xl py-3 text-base text-foreground data-[highlighted]:bg-primary data-[highlighted]:text-black data-[state=checked]:bg-primary/25 data-[state=checked]:text-white"
                            >
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <input
                        value={data[field.id]}
                        onChange={(event) => updateField(event.target.value)}
                        placeholder={field.placeholder}
                        type={field.type}
                        required={field.required}
                        className="h-14 w-full rounded-2xl border border-border/70 bg-background/55 px-5 text-base text-foreground shadow-inner outline-none transition [transition-duration:220ms] focus:border-primary/80 focus:shadow-[0_0_0_3px_rgba(231,138,83,0.2)] focus:ring-0"
                      />
                    )}

                    <AnimatePresence>
                      {currentFieldError ? (
                        <motion.p
                          className="mt-3 text-sm text-red-400"
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -2 }}
                        >
                          {currentFieldError}
                        </motion.p>
                      ) : null}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="flex flex-wrap items-center gap-3">
                <motion.button
                  type="button"
                  onClick={goBack}
                  disabled={step === 0}
                  className="rounded-xl border border-border/70 px-5 py-3 text-sm font-medium text-muted-foreground transition hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  whileHover={step === 0 ? undefined : { scale: 1.03, y: -1 }}
                  whileTap={step === 0 ? undefined : { scale: 0.97 }}
                >
                  Back
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={!isCurrentStepValid || isSubmitting}
                  className="relative overflow-hidden rounded-xl bg-gradient-to-b from-primary to-primary/80 px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0px_2px_0px_0px_rgba(255,255,255,0.3)_inset,0_12px_32px_-8px_rgba(231,138,83,0.45)] transition disabled:cursor-not-allowed disabled:opacity-50"
                  whileHover={!isCurrentStepValid || isSubmitting ? undefined : { scale: 1.04, y: -2 }}
                  whileTap={!isCurrentStepValid || isSubmitting ? undefined : { scale: 0.97 }}
                >
                  {step === totalSteps - 1 && isSubmitting ? (
                    <span className="inline-flex items-center gap-2">
                      <motion.span
                        className="inline-block size-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.7, ease: "linear" }}
                        aria-hidden
                      />
                      Submitting
                    </span>
                  ) : step === totalSteps - 1 ? (
                    "Submit Application"
                  ) : (
                    "Continue"
                  )}
                </motion.button>
                <p className="text-xs text-muted-foreground">Press Enter to continue</p>
              </div>

              <AnimatePresence>
                {submitError ? (
                  <motion.p
                    className="text-sm text-red-400"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                  >
                    {submitError}
                  </motion.p>
                ) : null}
              </AnimatePresence>

              <p className="pt-1 text-xs text-muted-foreground/90">
                We only use your details to review this leadership application and contact you about the selection process.
              </p>
            </form>
          </motion.section>
        ) : (
          <motion.section
            className="rounded-3xl border border-border/60 bg-card/40 p-8 text-center shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset,0_24px_80px_-20px_rgba(0,0,0,0.55)] backdrop-blur-sm md:p-12"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 18 }}
          >
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Application Received</p>
            <h2 className="mt-4 text-3xl font-semibold text-foreground md:text-4xl">
              Thanks for applying to DevSphere Leadership
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Your response has been submitted successfully. We will contact you at{" "}
              <span className="font-medium text-foreground">{data.email}</span> after review.
            </p>
            <div className="mt-8">
              <motion.div whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/core-team"
                  className="inline-flex rounded-xl border border-border/70 bg-background/50 px-5 py-3 font-medium text-foreground transition hover:bg-background/80"
                >
                  Explore Core Team
                </Link>
              </motion.div>
            </div>
          </motion.section>
        )}
      </main>
    </div>
  )
}
