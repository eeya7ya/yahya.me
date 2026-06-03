// Client-only. Renders the first page of a PDF to a JPEG blob using PDF.js.
// Worker file is served from /public/pdfjs/ (see scripts/copy-pdf-worker.mjs).

const WORKER_URL = "/pdfjs/pdf.worker.min.mjs";
const TARGET_WIDTH = 1200; // wide enough for retina cards

type PdfJsModule = typeof import("pdfjs-dist");

let pdfjsPromise: Promise<PdfJsModule> | null = null;

function loadPdfJs(): Promise<PdfJsModule> {
  if (!pdfjsPromise) {
    pdfjsPromise = import("pdfjs-dist").then((mod) => {
      mod.GlobalWorkerOptions.workerSrc = WORKER_URL;
      return mod;
    });
  }
  return pdfjsPromise;
}

// Eagerly loads the PDF.js library + worker so the first thumbnail render
// doesn't pay the one-time import cost. Safe to call repeatedly — the
// underlying promise is memoised.
export function warmPdfThumbnailer(): void {
  void loadPdfJs();
}

async function readAsArrayBuffer(input: Blob | ArrayBuffer): Promise<ArrayBuffer> {
  if (input instanceof ArrayBuffer) return input;
  return await input.arrayBuffer();
}

function blobFromCanvas(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("canvas.toBlob returned null"))),
      type,
      quality,
    );
  });
}

type PdfDocument = Awaited<ReturnType<PdfJsModule["getDocument"]>["promise"]>;

async function firstPageToJpeg(
  doc: PdfDocument,
  opts: { width?: number; quality?: number },
): Promise<Blob> {
  try {
    const page = await doc.getPage(1);
    const baseViewport = page.getViewport({ scale: 1 });
    const targetWidth = opts.width ?? TARGET_WIDTH;
    const scale = targetWidth / baseViewport.width;
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas 2d context unavailable");

    // White background for transparent PDFs.
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({ canvasContext: ctx, viewport }).promise;
    return await blobFromCanvas(canvas, "image/jpeg", opts.quality ?? 0.82);
  } finally {
    await doc.destroy();
  }
}

export async function renderPdfFirstPageToJpeg(
  input: Blob | ArrayBuffer,
  opts: { width?: number; quality?: number } = {},
): Promise<Blob> {
  const pdfjs = await loadPdfJs();
  const data = await readAsArrayBuffer(input);
  // pdfjs mutates the buffer; pass a copy so the caller's File/Blob stays usable.
  const doc = await pdfjs.getDocument({ data: data.slice(0) }).promise;
  return firstPageToJpeg(doc, opts);
}

// Renders the first page straight from a URL using HTTP range requests so only
// the bytes needed for page 1 are fetched — far faster than downloading the
// whole PDF. Goes through the same-origin proxy (range-capable) to sidestep
// missing CORS headers on the bucket.
export async function renderPdfFirstPageFromUrl(
  url: string,
  opts: { width?: number; quality?: number } = {},
): Promise<Blob> {
  const pdfjs = await loadPdfJs();
  const proxied = `/api/pdf-proxy?url=${encodeURIComponent(url)}`;
  const doc = await pdfjs.getDocument({
    url: proxied,
    rangeChunkSize: 65536,
    disableAutoFetch: true,
    disableStream: false,
  }).promise;
  return firstPageToJpeg(doc, opts);
}


// Tries the URL directly first; on CORS / network failure, falls back to the
// same-origin proxy so PDFs without CORS headers on the bucket can still be
// rendered (works on both the public site and admin).
export async function fetchPdfAsBlob(url: string): Promise<Blob> {
  try {
    const res = await fetch(url, { mode: "cors" });
    if (res.ok) return await res.blob();
  } catch {
    // fall through to proxy
  }
  const proxied = `/api/pdf-proxy?url=${encodeURIComponent(url)}`;
  const res = await fetch(proxied);
  if (!res.ok) throw new Error(`fetch_pdf_failed (${res.status})`);
  return await res.blob();
}
