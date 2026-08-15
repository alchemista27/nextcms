import { describe, it, expect, vi, beforeEach } from 'vitest'
import { requireAuth } from './auth'
import { createClient } from './supabase/server'
import { redirect } from 'next/navigation'

// Mock dependencies
vi.mock('./supabase/server', () => ({
  createClient: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn().mockImplementation(() => { throw new Error('redirected') }),
}))

vi.mock('./prisma', () => ({
  prisma: {
    sharedUser: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    cmsUser: {
      findUnique: vi.fn(),
      create: vi.fn(),
      count: vi.fn(),
    },
  },
}))

describe('requireAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('redirects to /login if user is not authenticated', async () => {
    const mockGetUser = vi.fn().mockResolvedValue({ data: { user: null }, error: null })
    vi.mocked(createClient).mockResolvedValue({
      auth: { getUser: mockGetUser },
    } as any)

    try {
      await requireAuth()
    } catch(e) {}

    expect(redirect).toHaveBeenCalledWith('/login')
  })

  it('redirects to /login if user does not match required role', async () => {
    const mockGetUser = vi.fn().mockResolvedValue({ 
      data: { user: { id: 'user-1', email: 'test@example.com' } }, 
      error: null 
    })
    vi.mocked(createClient).mockResolvedValue({
      auth: { getUser: mockGetUser },
    } as any)

    const { prisma } = await import('./prisma')
    vi.mocked(prisma.sharedUser.findUnique).mockResolvedValue({ id: 'user-1', email: 'test@example.com', fullName: 'Test' } as any)
    vi.mocked(prisma.cmsUser.findUnique).mockResolvedValue({ id: 'user-1', role: 'AUTHOR' } as any)

    try {
      await requireAuth(['ADMIN'])
    } catch(e) {}

    expect(redirect).toHaveBeenCalledWith('/admin')
  })

  it('returns the user if authenticated and role matches', async () => {
    const mockGetUser = vi.fn().mockResolvedValue({ 
      data: { user: { id: 'user-1', email: 'test@example.com' } }, 
      error: null 
    })
    vi.mocked(createClient).mockResolvedValue({
      auth: { getUser: mockGetUser },
    } as any)

    const { prisma } = await import('./prisma')
    vi.mocked(prisma.sharedUser.findUnique).mockResolvedValue({ id: 'user-1', email: 'test@example.com', fullName: 'Test' } as any)
    vi.mocked(prisma.cmsUser.findUnique).mockResolvedValue({ id: 'user-1', role: 'ADMIN' } as any)

    const user = await requireAuth(['ADMIN'])

    expect(user).toEqual({ id: 'user-1', email: 'test@example.com', name: 'Test', role: 'ADMIN' })
    expect(redirect).not.toHaveBeenCalled()
  })
})
