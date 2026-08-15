import { vi } from 'vitest'

// Mock standard next router methods
vi.mock('next/navigation', () => {
  return {
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
    }),
    usePathname: () => '',
    useSearchParams: () => new URLSearchParams(),
    redirect: vi.fn(),
  }
})

// Mock next/cache
vi.mock('next/cache', () => {
  return {
    revalidatePath: vi.fn(),
  }
})
