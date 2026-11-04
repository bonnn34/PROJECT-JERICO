import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import "@/components/construction/construction.css";
import { profile, siteUrl } from "@/data/portfolio";
import { EditorialPointerInteractions } from "@/components/editorial-pointer-interactions";
import { SitePreloader } from "@/components/site-preloader";
import { ConstructionPreferences } from "@/components/construction/construction-preferences";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.name} — Web Developer & Digital Creative`,
    template: `%s | ${profile.name}`,
  },
  description: profile.introduction,
  alternates: { canonical: "/" },
  authors: [{ name: profile.name, url: siteUrl }],
  creator: profile.name,
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Project Jerico",
    locale: "en_PH",
    title: `${profile.name} — Portfolio`,
    description: profile.introduction,
    images: [{ url: "/og-preview.png", width: 1200, height: 630, alt: `${profile.name} portfolio` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — Portfolio`,
    description: profile.introduction,
    images: ["/og-preview.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
  themeColor: "#f5f2eb",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: siteUrl,
    jobTitle: profile.role,
    email: `mailto:${profile.email}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Tigaon",
      addressRegion: "Camarines Sur",
      addressCountry: "PH",
    },
    sameAs: [profile.github, profile.behance, profile.facebook].filter(Boolean),
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema).replace(/</g, "\\u003c") }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var p=localStorage.getItem('project-jerico-theme');if(p!=='light'&&p!=='dark')p='light';document.documentElement.dataset.theme=p;document.documentElement.dataset.themePreference=p;document.documentElement.style.colorScheme=p;var m=document.querySelector('meta[name="theme-color"]');if(m)m.content=p==='dark'?'#0b0b0b':'#f5f2eb'}catch(e){document.documentElement.dataset.theme='light';document.documentElement.dataset.themePreference='light';document.documentElement.style.colorScheme='light'}`,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(sessionStorage.getItem('project-jerico-preloader-seen')==='true'||matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('preloader-skip')}else{document.documentElement.classList.add('preloader-pending')}}catch(e){document.documentElement.classList.add('preloader-pending')}`,
          }}
        />
      </head>
      <body>
        <ConstructionPreferences>
          <SitePreloader />
          <EditorialPointerInteractions />
          <a className="skip-link" href="#main-content">Skip to content</a>
          <div data-site-content>{children}</div>
        </ConstructionPreferences>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
