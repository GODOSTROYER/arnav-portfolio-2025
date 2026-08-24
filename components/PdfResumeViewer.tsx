"use client";

import { Document, Page, pdfjs } from "react-pdf";
import { useEffect, useState } from "react";

// tell react‑pdf where the worker lives – put the file in /public once
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

export default function PdfResumeViewer() {
  // Track only the breakpoint, not raw width — re-rendering <Page> re-rasterizes the
  // PDF canvas, so it should happen at most when crossing 787px, not per resize pixel
  const [isWide, setIsWide] = useState(true);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 787px)");
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => setIsWide(e.matches);
    handleChange(mql);
    mql.addEventListener("change", handleChange as (e: MediaQueryListEvent) => void);
    return () => mql.removeEventListener("change", handleChange as (e: MediaQueryListEvent) => void);
  }, []);

  const scale = isWide ? 1.7 : 0.6;

  return (
    <Document file="/Arnav - Resume.pdf" loading={<div className="text-center text-gray-500">Loading PDF...</div>}>
      <Page pageNumber={1} scale={scale} renderTextLayer={false} renderAnnotationLayer={false} />
    </Document>
  );
} 