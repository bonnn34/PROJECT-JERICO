import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function NotFound() {
  return <><SiteHeader/><main id="main-content" className="not-found shell" data-grid-spotlight><p className="section-eyebrow">404 / PAGE NOT FOUND</p><h1>This page took<br/><em>another direction.</em></h1><p>The link may have moved, but there&apos;s still plenty to explore.</p><Link href="/" className="button button-dark">Back home <ArrowUpRight size={17}/></Link></main><SiteFooter/></>;
}
