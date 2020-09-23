import * as Typegen from 'nexus-plugin-prisma/typegen'
import * as Prisma from '@prisma/client';

// Pagination type
type Pagination = {
  first?: boolean
  last?: boolean
  before?: boolean
  after?: boolean
}

// Prisma custom scalar names
type CustomScalars = 'DateTime'

// Prisma model type definitions
interface PrismaModels {
  Report: Prisma.Report
  Page: Prisma.Page
  Device: Prisma.Device
  Capture: Prisma.Capture
  Sparkline: Prisma.Sparkline
}

// Prisma input types metadata
interface NexusPrismaInputs {
  Query: {
    reports: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'slug' | 'current' | 'visible' | 'pages' | 'pagecount' | 'captures' | 'createdAt'
      ordering: 'id' | 'slug' | 'current' | 'visible' | 'pagecount' | 'createdAt'
    }
    pages: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'slug' | 'url' | 'captures' | 'reports' | 'reportcount' | 'startsAt' | 'endsAt' | 'createdAt' | 'Sparkline'
      ordering: 'id' | 'slug' | 'url' | 'reportcount' | 'startsAt' | 'endsAt' | 'createdAt'
    }
    devices: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'slug' | 'name' | 'specs' | 'captures' | 'deviceScaleFactor' | 'createdAt' | 'Sparkline'
      ordering: 'id' | 'slug' | 'name' | 'specs' | 'deviceScaleFactor' | 'createdAt'
    }
    captures: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'slug' | 'url' | 'urlmin' | 'urldiff' | 'diff' | 'diffindex' | 'deviceScaleFactor' | 'page' | 'pageId' | 'report' | 'reportId' | 'device' | 'deviceId' | 'sparkline' | 'sparklineId' | 'createdAt'
      ordering: 'id' | 'slug' | 'url' | 'urlmin' | 'urldiff' | 'diff' | 'diffindex' | 'deviceScaleFactor' | 'pageId' | 'reportId' | 'deviceId' | 'sparklineId' | 'createdAt'
    }
    sparklines: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'slug' | 'device' | 'deviceId' | 'page' | 'pageId' | 'captures' | 'data'
      ordering: 'id' | 'slug' | 'deviceId' | 'pageId' | 'data'
    }
  },
  Report: {
    pages: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'slug' | 'url' | 'captures' | 'reports' | 'reportcount' | 'startsAt' | 'endsAt' | 'createdAt' | 'Sparkline'
      ordering: 'id' | 'slug' | 'url' | 'reportcount' | 'startsAt' | 'endsAt' | 'createdAt'
    }
    captures: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'slug' | 'url' | 'urlmin' | 'urldiff' | 'diff' | 'diffindex' | 'deviceScaleFactor' | 'page' | 'pageId' | 'report' | 'reportId' | 'device' | 'deviceId' | 'sparkline' | 'sparklineId' | 'createdAt'
      ordering: 'id' | 'slug' | 'url' | 'urlmin' | 'urldiff' | 'diff' | 'diffindex' | 'deviceScaleFactor' | 'pageId' | 'reportId' | 'deviceId' | 'sparklineId' | 'createdAt'
    }
  }
  Page: {
    captures: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'slug' | 'url' | 'urlmin' | 'urldiff' | 'diff' | 'diffindex' | 'deviceScaleFactor' | 'page' | 'pageId' | 'report' | 'reportId' | 'device' | 'deviceId' | 'sparkline' | 'sparklineId' | 'createdAt'
      ordering: 'id' | 'slug' | 'url' | 'urlmin' | 'urldiff' | 'diff' | 'diffindex' | 'deviceScaleFactor' | 'pageId' | 'reportId' | 'deviceId' | 'sparklineId' | 'createdAt'
    }
    reports: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'slug' | 'current' | 'visible' | 'pages' | 'pagecount' | 'captures' | 'createdAt'
      ordering: 'id' | 'slug' | 'current' | 'visible' | 'pagecount' | 'createdAt'
    }
    Sparkline: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'slug' | 'device' | 'deviceId' | 'page' | 'pageId' | 'captures' | 'data'
      ordering: 'id' | 'slug' | 'deviceId' | 'pageId' | 'data'
    }
  }
  Device: {
    captures: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'slug' | 'url' | 'urlmin' | 'urldiff' | 'diff' | 'diffindex' | 'deviceScaleFactor' | 'page' | 'pageId' | 'report' | 'reportId' | 'device' | 'deviceId' | 'sparkline' | 'sparklineId' | 'createdAt'
      ordering: 'id' | 'slug' | 'url' | 'urlmin' | 'urldiff' | 'diff' | 'diffindex' | 'deviceScaleFactor' | 'pageId' | 'reportId' | 'deviceId' | 'sparklineId' | 'createdAt'
    }
    Sparkline: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'slug' | 'device' | 'deviceId' | 'page' | 'pageId' | 'captures' | 'data'
      ordering: 'id' | 'slug' | 'deviceId' | 'pageId' | 'data'
    }
  }
  Capture: {

  }
  Sparkline: {
    captures: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'slug' | 'url' | 'urlmin' | 'urldiff' | 'diff' | 'diffindex' | 'deviceScaleFactor' | 'page' | 'pageId' | 'report' | 'reportId' | 'device' | 'deviceId' | 'sparkline' | 'sparklineId' | 'createdAt'
      ordering: 'id' | 'slug' | 'url' | 'urlmin' | 'urldiff' | 'diff' | 'diffindex' | 'deviceScaleFactor' | 'pageId' | 'reportId' | 'deviceId' | 'sparklineId' | 'createdAt'
    }
  }
}

// Prisma output types metadata
interface NexusPrismaOutputs {
  Query: {
    report: 'Report'
    reports: 'Report'
    page: 'Page'
    pages: 'Page'
    device: 'Device'
    devices: 'Device'
    capture: 'Capture'
    captures: 'Capture'
    sparkline: 'Sparkline'
    sparklines: 'Sparkline'
  },
  Mutation: {
    createOneReport: 'Report'
    updateOneReport: 'Report'
    updateManyReport: 'BatchPayload'
    deleteOneReport: 'Report'
    deleteManyReport: 'BatchPayload'
    upsertOneReport: 'Report'
    createOnePage: 'Page'
    updateOnePage: 'Page'
    updateManyPage: 'BatchPayload'
    deleteOnePage: 'Page'
    deleteManyPage: 'BatchPayload'
    upsertOnePage: 'Page'
    createOneDevice: 'Device'
    updateOneDevice: 'Device'
    updateManyDevice: 'BatchPayload'
    deleteOneDevice: 'Device'
    deleteManyDevice: 'BatchPayload'
    upsertOneDevice: 'Device'
    createOneCapture: 'Capture'
    updateOneCapture: 'Capture'
    updateManyCapture: 'BatchPayload'
    deleteOneCapture: 'Capture'
    deleteManyCapture: 'BatchPayload'
    upsertOneCapture: 'Capture'
    createOneSparkline: 'Sparkline'
    updateOneSparkline: 'Sparkline'
    updateManySparkline: 'BatchPayload'
    deleteOneSparkline: 'Sparkline'
    deleteManySparkline: 'BatchPayload'
    upsertOneSparkline: 'Sparkline'
  },
  Report: {
    id: 'String'
    slug: 'String'
    current: 'Boolean'
    visible: 'Boolean'
    pages: 'Page'
    pagecount: 'Int'
    captures: 'Capture'
    createdAt: 'DateTime'
  }
  Page: {
    id: 'String'
    slug: 'String'
    url: 'String'
    captures: 'Capture'
    reports: 'Report'
    reportcount: 'Int'
    startsAt: 'String'
    endsAt: 'String'
    createdAt: 'DateTime'
    Sparkline: 'Sparkline'
  }
  Device: {
    id: 'String'
    slug: 'String'
    name: 'String'
    specs: 'String'
    captures: 'Capture'
    deviceScaleFactor: 'Int'
    createdAt: 'DateTime'
    Sparkline: 'Sparkline'
  }
  Capture: {
    id: 'String'
    slug: 'String'
    url: 'String'
    urlmin: 'String'
    urldiff: 'String'
    diff: 'Boolean'
    diffindex: 'Float'
    deviceScaleFactor: 'Int'
    page: 'Page'
    pageId: 'String'
    report: 'Report'
    reportId: 'String'
    device: 'Device'
    deviceId: 'String'
    sparkline: 'Sparkline'
    sparklineId: 'String'
    createdAt: 'DateTime'
  }
  Sparkline: {
    id: 'String'
    slug: 'String'
    device: 'Device'
    deviceId: 'String'
    page: 'Page'
    pageId: 'String'
    captures: 'Capture'
    data: 'String'
  }
}

// Helper to gather all methods relative to a model
interface NexusPrismaMethods {
  Report: Typegen.NexusPrismaFields<'Report'>
  Page: Typegen.NexusPrismaFields<'Page'>
  Device: Typegen.NexusPrismaFields<'Device'>
  Capture: Typegen.NexusPrismaFields<'Capture'>
  Sparkline: Typegen.NexusPrismaFields<'Sparkline'>
  Query: Typegen.NexusPrismaFields<'Query'>
  Mutation: Typegen.NexusPrismaFields<'Mutation'>
}

interface NexusPrismaGenTypes {
  inputs: NexusPrismaInputs
  outputs: NexusPrismaOutputs
  methods: NexusPrismaMethods
  models: PrismaModels
  pagination: Pagination
  scalars: CustomScalars
}

declare global {
  interface NexusPrismaGen extends NexusPrismaGenTypes {}

  type NexusPrisma<
    TypeName extends string,
    ModelOrCrud extends 'model' | 'crud'
  > = Typegen.GetNexusPrisma<TypeName, ModelOrCrud>;
}
  