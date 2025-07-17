"use client";

import { Document, Page, pdfjs } from "react-pdf";
import { useEffect, useState } from "react";

// tell react‑pdf where the worker lives – put the file in /public once
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

export default function PdfResumeViewer() {
  const [width, setWidth] = useState(1024);

  useEffect(() => {
    setWidth(window.innerWidth);
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scale = width > 786 ? 1.7 : 0.6;

  return (
    <Document file="/Arnav - Resume.pdf" loading={<div className="text-center text-gray-500">Loading PDF...</div>}>
      <Page pageNumber={1} scale={scale} renderTextLayer={false} renderAnnotationLayer={false} />
    </Document>
  );
} 