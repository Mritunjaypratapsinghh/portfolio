export const PERSONAL_INFO = {
  name: "Mritunjay Pratap Singh",
  firstName: "Mritunjay",
  lastName: "Pratap Singh",
  role: "Backend Software Engineer",
  email: "mritunjayps0@gmail.com",
  description:
    "Building scalable backend systems powering financial applications. Python, FastAPI, AWS, Microservices.",
  shortDescription:
    "Building scalable backend systems powering financial applications.",
  url: "https://mritunjay.dev",
  resumePath: "/mritunjay-resume.pdf",
} as const;

export const SOCIAL_LINKS = {
  github: {
    label: "GitHub",
    href: "https://github.com/mritunjay-ps",
    username: "mritunjay-ps",
  },
  linkedin: {
    label: "LinkedIn",
    href: "https://linkedin.com/in/mritunjay-pratap-singh",
    username: "mritunjay-pratap-singh",
  },
  email: {
    label: "Email",
    href: "mailto:mritunjayps0@gmail.com",
  },
} as const;

export const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Tech Stack", href: "#tech-stack" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
] as const;
