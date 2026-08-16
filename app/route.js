import { auth, clerkClient } from '@clerk/nextjs/server'
import { TOOL_HTML_B64 } from '../tool-html.js'

// Decode the embedded tool HTML once at module load.
const HTML = Buffer.from(TOOL_HTML_B64, 'base64').toString('utf8')

// Allow-list of permitted emails, read from the ALLOWED_EMAILS env var
// (comma-separated). Managed in Vercel so editors can be added without code
// changes. If it is empty, no one is allowed (fail closed).
function allowedEmails() {
  return new Set(
    (process.env.ALLOWED_EMAILS || '')
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)
  )
}

const DENIED_HTML =
  '<!doctype html><meta charset="utf-8"><title>未授权</title>' +
  '<div style="font-family:system-ui;max-width:32rem;margin:15vh auto;padding:0 1.5rem;text-align:center;color:#111">' +
  '<h1 style="font-size:1.4rem">🔒 访问未授权</h1>' +
  '<p style="color:#555;line-height:1.7">你已成功用谷歌登录，但这个账号不在允许访问的名单里。<br>如果你认为这是个错误，请联系管理员把你的邮箱加入名单。</p>' +
  '</div>'

export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  // Check the signed-in user's verified emails against the allow-list.
  const allow = allowedEmails()
  const client = await clerkClient()
  const user = await client.users.getUser(userId)
  const emails = (user.emailAddresses || []).map((e) => e.emailAddress.toLowerCase())
  const permitted = emails.some((e) => allow.has(e))

  if (!permitted) {
    return new Response(DENIED_HTML, {
      status: 403,
      headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' },
    })
  }

  return new Response(HTML, {
    status: 200,
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' },
  })
}

export const dynamic = 'force-dynamic'
