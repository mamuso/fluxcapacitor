/* eslint-disable no-console */
import {nexusPrismaPlugin} from 'nexus-prisma'
import {PrismaClient} from '@prisma/client'
import {
  // intArg,
  makeSchema,
  objectType,
  // stringArg,
  // booleanArg,
  queryType,
  idArg,
} from 'nexus'
import {GraphQLServer} from 'graphql-yoga'
import {join} from 'path'
// import {Context} from './types'

const prisma = new PrismaClient()

export const Report = objectType({
  name: 'Report',
  definition(t) {
    t.model.id()
    t.model.slug()
    t.model.captures({type: 'Capture'})
    t.model.url()
    t.model.current()
    t.model.createdAt()
  },
})

export const Page = objectType({
  name: 'Page',
  definition(t) {
    t.model.id()
    t.model.slug()
    t.model.captures({type: 'Capture'})
    t.model.reports({type: 'Report'})
    t.model.createdAt()
  },
})

export const Capture = objectType({
  name: 'Capture',
  definition(t) {
    t.model.id()
    t.model.url()
    t.model.urlmin()
    t.model.urldiff()
    t.model.diff()
    t.model.device({type: 'Device'})
    t.model.createdAt()
  },
})

export const Device = objectType({
  name: 'Device',
  definition(t) {
    t.model.id()
    t.model.slug()
    t.model.device()
    t.model.specs()
    t.model.createdAt()
  },
})

const Query = queryType({
  definition(t) {
    t.crud.report()
    t.crud.page()
    t.crud.capture()
    t.crud.device()
  },
})

const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    t.crud.createOneReport()
    t.crud.createOnePage()
  },
})

const schema = makeSchema({
  types: [Query, Mutation, Report, Page, Capture, Device],
  plugins: [nexusPrismaPlugin()],
  outputs: {
    typegen: join(__dirname, '../generated/nexus-typegen.ts'),
    schema: join(__dirname, '/schema.graphql'),
  },
  typegenAutoConfig: {
    contextType: 'Context.Context',
    sources: [
      {
        source: '@prisma/client',
        alias: 'prisma',
      },
      {
        source: join(__dirname, 'types.ts'),
        alias: 'Context',
      },
    ],
  },
})

const server = new GraphQLServer({
  schema,
  context: {prisma},
})

server.start(
  {
    endpoint: '/graphql',
    playground: '/graphql',
    subscriptions: false,
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL,
    },
  },
  () => console.log(`🚀 Server ready`),
)
