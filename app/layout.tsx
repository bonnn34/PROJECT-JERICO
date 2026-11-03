import type { Metadata, Viewport } from "next";
import "./globals.css";
import { profile } from "@/data/portfolio";
import { EditorialPointerInteractions } from "@/components/editorial-pointer-interactions";
import { SitePreloader } from "@/components/site-preloader";

export const metadata: Metadata = {
  metadataBase: new URL("https://example.com"), // Replace when you deploy your custom domain
  title: {
    default: `${profile.name} — Web Developer & Digital Creative`,
    template: `%s | ${profile.name}`,
  },
  description: profile.introduction,
  openGraph: {
    type: "website",
    title: `${profile.name} — Portfolio`,
    description: profile.introduction,
    images: ["/og-preview.svg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
  themeColor: "#f5f2eb",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
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
      <body><SitePreloader /><EditorialPointerInteractions /><a className="skip-link" href="#main-content">Skip to content</a><div data-site-content>{children}</div></body>
    </html>
  );
}
