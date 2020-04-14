/* eslint-disable no-console */
import { nexusPrismaPlugin } from "nexus-prisma";
import { PrismaClient } from "@prisma/client";
import {
  // intArg,
  makeSchema,
  objectType,
  // stringArg,
  // booleanArg,
  queryType,
  idArg,
} from "nexus";
import * as dotenv from "dotenv";
import { GraphQLServer } from "graphql-yoga";
import * as path from "path";
// import {Context} from './types'

dotenv.config({
  path: path.join(__dirname, "../../.env"),
});

const prisma = new PrismaClient();

export const Report = objectType({
  name: "Report",
  definition(t) {
    t.model.id();
    t.model.slug();
    t.model.url();
    t.model.current();
    t.model.pages({ type: "Page" });
    t.model.pagecount();
    t.model.captures({ type: "Capture" });
    t.model.createdAt();
  },
});

export const Page = objectType({
  name: "Page",
  definition(t) {
    t.model.id();
    t.model.slug();
    t.model.captures({ type: "Capture" });
    t.model.reports({ type: "Report" });
    t.model.reportcount();
    t.model.startsAt();
    t.model.endsAt();
    t.model.createdAt();
  },
});

export const Capture = objectType({
  name: "Capture",
  definition(t) {
    t.model.id();
    t.model.slug();
    t.model.url();
    t.model.urlmin();
    t.model.urldiff();
    t.model.diff();
    t.model.diffindex();
    t.model.page({ type: "Page" });
    t.model.report({ type: "Report" });
    t.model.device({ type: "Device" });
    t.model.createdAt();
  },
});

export const Device = objectType({
  name: "Device",
  definition(t) {
    t.model.id();
    t.model.slug();
    t.model.name();
    t.model.specs();
    t.model.captures({ type: "Capture" });
    t.model.createdAt();
  },
});

const Query = queryType({
  definition(t) {
    t.crud.report();
    t.crud.page();
    t.crud.capture();
    t.crud.device();
  },
});

const Mutation = objectType({
  name: "Mutation",
  definition(t) {
    t.crud.createOneReport();
    t.crud.createOnePage();
    t.crud.createOneDevice();
    t.crud.createOneCapture();
  },
});

const schema = makeSchema({
  types: [Query, Mutation, Report, Page, Capture, Device],
  plugins: [nexusPrismaPlugin()],
  outputs: {
    typegen: path.join(__dirname, "../generated/nexus-typegen.ts"),
    schema: path.join(__dirname, "/schema.graphql"),
  },
  typegenAutoConfig: {
    contextType: "Context.Context",
    sources: [
      {
        source: "@prisma/client",
        alias: "prisma",
      },
      {
        source: path.join(__dirname, "types.ts"),
        alias: "Context",
      },
    ],
  },
});

const server = new GraphQLServer({
  schema,
  context: { prisma },
});

server.start(
  {
    endpoint: "/graphql",
    playground: "/graphql",
    subscriptions: false,
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL,
    },
  },
  () => console.log(`🚀 Server ready`)
);
