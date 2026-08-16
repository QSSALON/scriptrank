import { clerkMiddleware } from '@clerk/nextjs/server'

// Gate EVERYTHING behind authentication. Any request that isn't a Next.js
// internal/static asset must be signed in; otherwise Clerk redirects the
// visitor to the hosted sign-in page. This is what makes the tool private:
// an unauthenticated visitor never receives any page content.
export default clerkMiddleware(async (auth, req) => {
  await auth.protect()
})

export const config = {
  matcher: [
    // Run on all routes except Next.js internals and obvious static files.
    '/((?!_next/static|_next/image|favicon.ico).*)',
    // Always run on the root.
    '/',
  ],
}
