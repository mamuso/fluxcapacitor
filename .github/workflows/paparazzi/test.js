const {PrismaClient} = require('../../../node_modules/@prisma/client')
prisma = new PrismaClient()

const test = prisma.caputre.findMany({
  where: {
    pageId: 'ck96o117y00029fbmkhemugci'
  },
  select: {
    url: true
  }
})

console.log(test)

// ck96o117y00029fbmkhemugci
// ck9cy821e0000pnbmou6ztjod
// ck96nlgqz0001embmmwjadmfm
