//src/app/api/content/[content_id]/complete/route.ts

import { NextResponse, type NextRequest } from 'next/server'
import { supabaseAnon } from '@/lib/supabaseServer'
import { bindSessionFromCookies } from '@/lib/http/session'

export async function POST(req: NextRequest) {
  const content_id = req.nextUrl.pathname.split('/').at(-2)

  const user = await bindSessionFromCookies()
  if (!user) {
    return NextResponse.json(
      { ok: false, error: 'Not authenticated' },
      { status: 401 }
    )
  }

  const body = await req.json()
  const { course_id } = body

  const { error } = await supabaseAnon.rpc('mark_content_complete', {
    p_profile_id: user.id,
    p_course_id: course_id,
    p_content_id: content_id
  })

  if (error) {
    console.error('complete error', error)
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ ok: true })
}
