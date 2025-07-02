import { type NextRequest, NextResponse } from "next/server"

// Required for static export
export const dynamic = 'force-static'
export const revalidate = 0

/**
 * Proxy every request that comes through `/api/face/<endpoint>`
 * to the real Python service defined in `NEXT_PUBLIC_FACE_API_URL`
 * (defaults to http://localhost:5000).
 *
 * All headers/body/method are forwarded transparently.
 */
const PYTHON_FACE_API = process.env.NEXT_PUBLIC_FACE_API_URL || "http://localhost:5000"

export async function GET(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { params } = context
  const awaitedParams = await params
  return proxy(req, awaitedParams)
}

export async function POST(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { params } = context
  const awaitedParams = await params
  // Debug: log the request body
  const body = await req.text()
  console.log("[Proxy] POST body (first 100 chars):", body.slice(0, 100) + "...")
  return proxy(req, awaitedParams, body)
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { params } = context
  const awaitedParams = await params
  return proxy(req, awaitedParams)
}

async function proxy(req: NextRequest, params: { path: string[] }, bodyOverride?: string) {
  // Build the URL to the Python service
  const targetUrl = `${PYTHON_FACE_API}/${params.path.join("/")}${req.nextUrl.search || ""}`

  // Forward the request
  const res = await fetch(targetUrl, {
    method: req.method,
    headers: {
      "Content-Type": req.headers.get("content-type") || "application/json",
    },
    body: req.method !== "GET" ? (bodyOverride || await req.text()) : undefined,
    // 30-second timeout safeguard
    next: { revalidate: 0 },
  })

  // Forward the response
  const contentType = res.headers.get("content-type") || "application/json"
  const data = await res.arrayBuffer()
  return new NextResponse(data, {
    status: res.status,
    headers: { "content-type": contentType },
  })
}
