//src/app/api/content/[content_id]/previous/route.ts

import { NextResponse, type NextRequest } from 'next/server'
import { supabaseAnon } from '@/lib/supabaseServer'
import { bindSessionFromCookies } from '@/lib/http/session'

export async function GET(req: NextRequest) {
  const segments = req.nextUrl.pathname.split('/')
  const content_id = segments[segments.length - 2]

  const user = await bindSessionFromCookies()
  if (!user) {
    return NextResponse.json(
      { ok: false, error: 'Not authenticated' },
      { status: 401 }
    )
  }

  const { data, error } = await supabaseAnon.rpc('get_previous_content', {
    p_current_content_id: content_id,
    p_course_id: null
  })

  if (error) {
    console.error('previous error', error)
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ ok: true, previous: data })
}
