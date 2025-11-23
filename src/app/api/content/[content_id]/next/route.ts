//src/app/api/content/[content_id]/next/route.ts

import { NextResponse } from 'next/server'
import { supabaseAnon } from '@/lib/supabaseServer'
import { bindSessionFromCookies } from '@/lib/http/session'

export async function GET(
  req: Request,
  context: { params: Promise<{ content_id: string }> }
) {
  const { content_id } = await context.params

  const user = await bindSessionFromCookies()
  if (!user) {
    return NextResponse.json({ ok: false, error: 'Not authenticated' }, { status: 401 })
  }

  const url = new URL(req.url)
  const course_id = url.searchParams.get('course_id')

  if (!course_id) {
    return NextResponse.json({ ok: false, error: 'course_id is required' }, { status: 400 })
  }

  const { data, error } = await supabaseAnon.rpc('get_next_content', {
    p_course_id: course_id,
    p_current_content_id: content_id
  })

  if (error) {
    console.error('next error', error)
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, next: data })
}
