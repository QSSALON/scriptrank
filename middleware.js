import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// The sign-in page must stay public, otherwise protecting it would cause an
// infinite redirect loop. Everything else requires authentication.
const isPublicRoute = createRouteMatcher(['/sign-in(.*)'])

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Run on all routes except Next.js internals and obvious static files.
    '/((?!_next/static|_next/image|favicon.ico).*)',
    // Always run on the root.
    '/',
  ],
}
