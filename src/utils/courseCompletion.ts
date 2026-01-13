// src/utils/courseCompletion.ts

/**
 * Mark content as complete
 */
export async function markContentComplete(
  contentId: string,
  courseId: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`/api/content/${contentId}/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ course_id: courseId }),
      credentials: 'include',
    })

    const json = await res.json()

    if (!res.ok || !json.ok) {
      console.error('Failed to mark content complete:', json.error)
      return { ok: false, error: json.error || 'Failed to mark content complete' }
    }

    return { ok: true }
  } catch (error) {
    console.error('Error marking content complete:', error)
    return { ok: false, error: 'Network error while marking content complete' }
  }
}

/**
 * Unmark content as complete
 */
export async function unmarkContentComplete(
  contentId: string,
  courseId: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`/api/content/${contentId}/uncomplete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ course_id: courseId }),
      credentials: 'include',
    })

    const json = await res.json()

    if (!res.ok || !json.ok) {
      console.error('Failed to unmark content complete:', json.error)
      return { ok: false, error: json.error || 'Failed to unmark content complete' }
    }

    return { ok: true }
  } catch (error) {
    console.error('Error unmarking content complete:', error)
    return { ok: false, error: 'Network error while unmarking content complete' }
  }
}

