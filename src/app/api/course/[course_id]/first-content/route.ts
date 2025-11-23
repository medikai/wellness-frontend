//src/app/api/course/[course_id]/first-content/route.ts
import { NextResponse, type NextRequest } from 'next/server'
import { supabaseAnon } from '@/lib/supabaseServer'
import { bindSessionFromCookies } from '@/lib/http/session'

export async function GET(req: NextRequest) {
  const segments = req.nextUrl.pathname.split('/')
  const course_id = segments[segments.length - 2]

  const user = await bindSessionFromCookies()
  if (!user) {
    return NextResponse.json(
      { ok: false, error: 'Not authenticated' },
      { status: 401 }
    )
  }

  const { data, error } = await supabaseAnon.rpc('get_first_content_in_course', {
    p_course_id: course_id
  })

  if (error) {
    console.error('first-content error', error)
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ ok: true, content: data })
}
