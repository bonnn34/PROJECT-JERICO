"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return <button type="button" className="button button-dark print-trigger" onClick={() => window.print()}><Printer size={17}/> Print / Save as PDF</button>;
}
