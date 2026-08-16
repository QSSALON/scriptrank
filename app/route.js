import { auth } from '@clerk/nextjs/server'
import { TOOL_HTML_B64 } from '../tool-html.js'

const HTML = Buffer.from(TOOL_HTML_B64, 'base64').toString('utf8')

export async function GET() {
    const a = await auth()
    if (!a.userId) return new Response('Unauthorized', { status: 401 })
    return new Response(HTML, { status: 200, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } })
  }

export const dynamic = 'force-dynamic'
