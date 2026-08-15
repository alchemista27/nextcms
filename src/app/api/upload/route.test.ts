import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from './route'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import cloudinary from '@/lib/cloudinary'
import { NextRequest } from 'next/server'

vi.mock('@/lib/auth', () => ({
  requireAuth: vi.fn(),
}))

vi.mock('@/lib/prisma', () => ({
  prisma: {
    media: {
      create: vi.fn(),
    },
  }
}))

vi.mock('@/lib/cloudinary', () => ({
  default: {
    uploader: {
      upload_stream: vi.fn(),
    }
  }
}))

describe('Upload API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 400 if no file is provided', async () => {
    vi.mocked(requireAuth).mockResolvedValue({ id: 'user-1' } as any)
    
    const formData = new FormData()
    const req = new NextRequest('http://localhost:3000/api/upload', {
      method: 'POST',
      body: formData
    })
    
    const response = await POST(req)
    expect(response.status).toBe(400)
    
    const json = await response.json()
    expect(json).toEqual({ error: 'No file provided' })
  })
})
