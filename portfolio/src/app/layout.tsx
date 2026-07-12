import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#050505",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://mritunjay.dev"),
  title: "Mritunjay Pratap Singh — Backend Software Engineer",
  description:
    "Backend engineer building systems that process 100K+ daily messages, route 10K+ calls, and handle financial transactions with zero downtime. Python, FastAPI, AWS.",
  keywords: [
    "Backend Engineer",
    "Python",
    "FastAPI",
    "AWS",
    "Microservices",
    "System Design",
    "hire backend engineer",
    "Python developer portfolio",
    "FastAPI expert",
    "financial technology",
  ],
  authors: [{ name: "Mritunjay Pratap Singh" }],
  openGraph: {
    title: "Mritunjay Pratap Singh — Backend Software Engineer",
    description:
      "Backend engineer building systems that process 100K+ daily messages, route 10K+ calls, and handle financial transactions with zero downtime. Python, FastAPI, AWS.",
    type: "website",
    url: "https://mritunjay.dev",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mritunjay Pratap Singh — Backend Software Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mritunjay Pratap Singh — Backend Software Engineer",
    description:
      "Backend engineer building systems that process 100K+ daily messages, route 10K+ calls, and handle financial transactions with zero downtime. Python, FastAPI, AWS.",
    images: ["/og-image.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Mritunjay Pratap Singh",
  jobTitle: "Backend Software Engineer",
  description:
    "Backend engineer building systems that process 100K+ daily messages, route 10K+ calls, and handle financial transactions with zero downtime. Specializing in Python, FastAPI, AWS, and Microservices architecture.",
  url: "https://mritunjay.dev",
  image: "https://mritunjay.dev/og-image.png",
  sameAs: [
    "https://github.com/mritunjay-ps",
    "https://linkedin.com/in/mritunjay-pratap-singh",
  ],
  knowsAbout: [
    "Python",
    "FastAPI",
    "AWS",
    "Microservices",
    "System Design",
    "Backend Engineering",
    "PostgreSQL",
    "MongoDB",
    "Docker",
    "Kubernetes",
    "Financial Technology",
    "Payment Systems",
    "Communication Systems",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[10000] focus:px-4 focus:py-2 focus:bg-[#00d4ff] focus:text-black focus:rounded focus:text-sm focus:font-medium">
          Skip to main content
        </a>
        {/* Noise texture overlay for premium feel */}
        <div className="noise-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
