/**
 * Better Auth API Handler for Vercel
 * 
 * This handles all auth-related API requests in Vercel serverless functions.
 * Routes: /api/auth/*
 */

import { auth } from "../../src/lib/auth/server";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Better Auth expects a standard Request object
  // Convert Vercel request to a fetch-compatible request
  const url = new URL(req.url || "/", `https://${req.headers.host}`);
  
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value) {
      headers.set(key, Array.isArray(value) ? value.join(", ") : value);
    }
  }
  
  // Create a Request object from Vercel request
  const request = new Request(url.toString(), {
    method: req.method,
    headers,
    body: req.method !== "GET" && req.method !== "HEAD" 
      ? JSON.stringify(req.body) 
      : undefined,
  });
  
  try {
    // Handle the request with Better Auth
    const response = await auth.handler(request);
    
    // Copy response headers
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });
    
    // Set status and send body
    res.status(response.status);
    
    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      const json = await response.json();
      res.json(json);
    } else {
      const text = await response.text();
      res.send(text);
    }
  } catch (error) {
    console.error("Auth handler error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
