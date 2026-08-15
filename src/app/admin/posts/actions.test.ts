import { describe, it, expect, vi, beforeEach } from 'vitest'
import { savePostAction } from './actions'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { redirect } from 'next/navigation'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    post: {
      findUnique: vi.fn(),
      update: vi.fn(),
      create: vi.fn(),
    },
    revision: {
      create: vi.fn(),
    }
  }
}))

vi.mock('@/lib/auth', () => ({
  requireAuth: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

describe('savePostAction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(requireAuth).mockResolvedValue({ id: 'user-1' } as any)
  })

  it('returns an error if validation fails', async () => {
    const formData = new FormData()
    formData.append('title', '') // Empty title should fail validation
    formData.append('slug', '')
    
    const result = await savePostAction(null, formData)
    
    expect(result).toHaveProperty('error')
    expect(prisma.post.create).not.toHaveBeenCalled()
  })

  it('returns an error if slug is already taken by another post', async () => {
    const formData = new FormData()
    formData.append('title', 'Test Post')
    formData.append('slug', 'test-post')
    formData.append('status', 'DRAFT')
    formData.append('content', '')
    formData.append('excerpt', '')
    formData.append('featuredImage', '')
    formData.append('metaTitle', '')
    formData.append('metaDescription', '')
    formData.append('ogImage', '')

    vi.mocked(prisma.post.findUnique).mockResolvedValue({ id: 'existing-id' } as any)

    const result = await savePostAction('my-id', formData)

    expect(result).toHaveProperty('error', 'Slug is already taken.')
    expect(prisma.post.update).not.toHaveBeenCalled()
  })

  it('creates a new post successfully', async () => {
    const formData = new FormData()
    formData.append('title', 'Test Post')
    formData.append('slug', 'test-post')
    formData.append('status', 'PUBLISHED')
    formData.append('content', '')
    formData.append('excerpt', '')
    formData.append('featuredImage', '')
    formData.append('metaTitle', '')
    formData.append('metaDescription', '')
    formData.append('ogImage', '')
    
    vi.mocked(prisma.post.findUnique).mockResolvedValue(null)

    await savePostAction(null, formData)

    expect(prisma.post.create).toHaveBeenCalled()
    expect(prisma.revision.create).toHaveBeenCalled()
    expect(redirect).toHaveBeenCalledWith('/admin/posts')
  })
})
