"use client"

import Image from "next/image"
import Link from "next/link"
import { StickyFooter } from "@/components/sticky-footer"
import { Navbar } from "@/components/navbar"

type TeamMember = {
  name: string
  role: string
  imageSrc: string
  socials?: {
    github?: string
    linkedin?: string
    x?: string
    instagram?: string
  }
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Amith Emmanuel",
    role: "President",
    imageSrc: "/amith.webp",
  },
  {
    name: "Harshul Kala",
    role: "Tech Lead",
    imageSrc: "/harshul.webp",
    socials: {
      linkedin: "https://www.linkedin.com/in/haru-l41n-pr0t0",
      github: "https://github.com/Wired-Navi0x17",
    },
  },
  {
    name: "N Priyanka",
    role: "Secretary",
    imageSrc: "/priyanka.webp",
    socials: {
      linkedin: "https://www.linkedin.com/in/priyanka-nagaraj-143033378?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    },
  },
  {
    name: "Maziha Athaullah",
    role: "Public Relations",
    imageSrc: "/maziha.webp",
  },
  {
    name: "Rabiya",
    role: "Core Team",
    imageSrc: "/rabiya.webp",
  },
]

const ADVISORS: TeamMember[] = [
  {
    name: "Dr. Merin Thomas",
    role: "Faculty Advisor",
    imageSrc: "/ProfMerin.webp",
    socials: {
      linkedin: "https://www.linkedin.com/in/dr-merin-thomas/",
    },
  },
  {
    name: "Taufeeq Riyaz",
    role: "Founder and Advisor",
    imageSrc: "/Taufeeq.webp",
    socials: {
      linkedin: "https://linkedin.com/in/taufeeq",
      github: "https://github.com/0xtaufeeq",
      x: "https://x.com/0xtaufeeq",
      instagram: "https://instagram.com/0xtaufeeq",
    },
  },
  {
    name: "Samarth Kadam",
    role: "Advisor",
    imageSrc: "/sam.webp",
    socials: {
      linkedin: "https://www.linkedin.com/in/samarth-kadam-008563331/",
      github: "https://github.com/IamSamk",
    },
  },
  {
    name: "Ritam Rao",
    role: "Advisor",
    imageSrc: "/ritam.webp",
    socials: {
      linkedin: "https://www.linkedin.com/in/ritam-rao-86503a2b6",
      github: "https://github.com/RitamRoa",
      instagram: "https://www.instagram.com/ritam.roa",
    },
  },
  {
    name: "Yashas",
    role: "Advisor",
    imageSrc: "/placeholder.svg",
  },
]

export default function CoreTeamPage() {
  return (
    <div className="min-h-screen w-full bg-black">
      <Navbar />
      {/* Hero Header */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        </div>
        <div className="mx-auto max-w-6xl px-4 pt-16 pb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">Core Team</h1>
          <p className="mt-4 text-base md:text-lg text-muted-foreground">Meet the people behind DevSphere</p>
        </div>
      </section>

      {/* Core Team Grid */}
      <section className="mx-auto max-w-6xl px-4 py-8 md:py-12 pb-64 lg:pb-72">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {TEAM_MEMBERS.map((member) => (
            <div key={member.name} className="group rounded-2xl border border-border bg-card/40 backdrop-blur-sm p-4 transition-transform duration-200 hover:-translate-y-0.5">
              <div className="relative w-full aspect-square overflow-hidden rounded-xl border border-border">
                <Image
                  src={member.imageSrc}
                  alt={member.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
                {/* Social icons under role */}
                <div className="mt-3 flex items-center gap-3">
                  {member.socials?.github && (
                    <a href={member.socials.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center size-9 rounded-full border border-border/60 bg-background/60 text-foreground/80 hover:text-foreground">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12a12 12 0 008.21 11.39c.6.11.79-.26.79-.58v-2.24c-3.34.73-4.03-1.41-4.03-1.41-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49.99.11-.78.42-1.31.76-1.61-2.66-.31-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.53-1.52.12-3.18 0 0 1.01-.32 3.3 1.23.96-.27 1.98-.4 3-.4s2.04.13 3 .4c2.29-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.6-2.81 5.62-5.48 5.93.43.37.85 1.09.85 2.22v3.29c0 .32.19.69.8.58A12 12 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                    </a>
                  )}
                  {member.socials?.linkedin && (
                    <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center size-9 rounded-full border border-border/60 bg-background/60 text-foreground/80 hover:text-foreground">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM0 8h5v16H0V8zm7.5 0h4.8v2.2h.07C13.3 8.7 15.4 7.5 18 7.5c5.1 0 6 3.3 6 7.6V24h-5v-6.9c0-1.6-.03-3.7-2.3-3.7-2.3 0-2.7 1.8-2.7 3.6V24H7.5V8z"/></svg>
                    </a>
                  )}
                  {member.socials?.x && (
                    <a href={member.socials.x} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center size-9 rounded-full border border-border/60 bg-background/60 text-foreground/80 hover:text-foreground">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2H21l-6.52 7.455L22 22h-6.773l-4.9-6.373L4.6 22H2l7.02-8.03L2 2h6.89l4.43 5.8L18.244 2zm-1.186 18h1.867L7.235 4H5.368l11.69 16z"/></svg>
                    </a>
                  )}
                  {member.socials?.instagram && (
                    <a href={member.socials.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center size-9 rounded-full border border-border/60 bg-background/60 text-foreground/80 hover:text-foreground">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <circle cx="17.5" cy="6.5" r="1"></circle>
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Advisors */}
      <section className="mx-auto max-w-6xl px-4 py-4 md:py-8 pb-40 lg:pb-56">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Advisors</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {ADVISORS.map((member) => (
            <div key={member.name} className="rounded-2xl border border-border bg-card/40 backdrop-blur-sm p-4">
              <div className="relative w-full aspect-square overflow-hidden rounded-xl border border-border">
                <Image
                  src={member.imageSrc}
                  alt={member.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
                <div className="mt-3 flex items-center gap-3">
                  {member.socials?.github && (
                    <a href={member.socials.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center size-9 rounded-full border border-border/60 bg-background/60 text-foreground/80 hover:text-foreground">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12a12 12 0 008.21 11.39c.6.11.79-.26.79-.58v-2.24c-3.34.73-4.03-1.41-4.03-1.41-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49.99.11-.78.42-1.31.76-1.61-2.66-.31-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.53-1.52.12-3.18 0 0 1.01-.32 3.3 1.23.96-.27 1.98-.4 3-.4s2.04.13 3 .4c2.29-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.6-2.81 5.62-5.48 5.93.43.37.85 1.09.85 2.22v3.29c0 .32.19 .69.8 .58A12 12 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                    </a>
                  )}
                  {member.socials?.linkedin && (
                    <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center size-9 rounded-full border border-border/60 bg-background/60 text-foreground/80 hover:text-foreground">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM0 8h5v16H0V8zm7.5 0h4.8v2.2h.07C13.3 8.7 15.4 7.5 18 7.5c5.1 0 6 3.3 6 7.6V24h-5v-6.9c0-1.6-.03-3.7-2.3-3.7-2.3 0-2.7 1.8-2.7 3.6V24H7.5V8z"/></svg>
                    </a>
                  )}
                  {member.socials?.x && (
                    <a href={member.socials.x} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center size-9 rounded-full border border-border/60 bg-background/60 text-foreground/80 hover:text-foreground">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2H21l-6.52 7.455L22 22h-6.773l-4.9-6.373L4.6 22H2l7.02-8.03L2 2h6.89l4.43 5.8L18.244 2zm-1.186 18h1.867L7.235 4H5.368l11.69 16z"/></svg>
                    </a>
                  )}
                  {member.socials?.instagram && (
                    <a href={member.socials.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center size-9 rounded-full border border-border/60 bg-background/60 text-foreground/80 hover:text-foreground">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <circle cx="17.5" cy="6.5" r="1"></circle>
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-48 lg:pb-56">
        <div className="rounded-3xl border border-border bg-card/40 p-6 md:p-8 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground">Join the DevSphere Community</h3>
          <p className="mt-3 text-muted-foreground">Connect with the team and thousands of builders.</p>
          <div className="mt-6">
            <a
              href="https://forms.gle/2AZjsRihYf9XME246"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-md font-bold cursor-pointer hover:-translate-y-0.5 transition duration-200 text-center bg-gradient-to-b from-primary to-primary/80 text-primary-foreground px-5 py-3 shadow-[0px_2px_0px_0px_rgba(255,255,255,0.3)_inset]"
            >
              Register Now
            </a>
          </div>
        </div>
      </section>

      {/* Extra spacer before footer */}
      <div className="h-32 md:h-56" />

      {/* Sticky Footer (from Home) */}
      <StickyFooter />
    </div>
  )
}


