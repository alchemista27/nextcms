import { prisma } from './src/lib/prisma'
async function main() {
  try {
    const post = await prisma.post.findFirst({
      include: { tags: true }
    })
    console.log("Success!")
  } catch (e) {
    console.error(e.message)
  }
}
main()
