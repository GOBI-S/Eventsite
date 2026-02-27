import React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import Script from "next/script"
import "./globals.css"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://event.site"),

  title: {
    default: "Onyx Technologies",
    template: "%s | Onyx Technologies"
  },

  description:
    "Create personalized birthday surprise websites instantly with Onyx Technologies. Secure, private, and shareable celebration pages.",

  applicationName: "Onyx Technologies",

  keywords: [
    "birthday website",
    "birthday surprise site",
    "digital birthday card",
    "personalized website",
    "Onyx Technologies"
  ],

  authors: [{ name: "Onyx Technologies" }],
  creator: "Onyx Technologies",
  publisher: "Onyx Technologies",

  openGraph: {
    title: "Onyx Birthday Website Builder",
    description: "Build magical birthday websites and share them instantly.",
    url: "https://event.site",
    siteName: "Onyx Technologies",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Onyx Birthday Website Builder"
      }
    ]
  },

  twitter: {
    card: "summary_large_image",
    title: "Onyx Birthday Website Builder",
    description: "Create and share beautiful birthday websites instantly.",
    images: ["/og.png"]
  },

  icons: {
    icon: [
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico"
  },

  manifest: "/site.webmanifest",

  robots: {
    index: true,
    follow: true
  },

  generator: "Next.js"
}

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geist.variable} ${geistMono.variable}`}
    >
      <head>
        {/* Prevent Theme Flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme');
                if (theme === 'dark') document.documentElement.classList.add('dark');
              } catch {}
            `,
          }}
        />
      </head>

      <body className="font-sans antialiased bg-background text-foreground">

        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
          <Analytics />
        </ThemeProvider>

        {/* Razorpay Loader */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        />

      </body>
    </html>
  )
}