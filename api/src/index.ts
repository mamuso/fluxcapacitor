import { ApolloServer } from "apollo-server-micro";
import { schema } from "./lib/schema";
import { createContext } from "./lib/context";

const server = new ApolloServer({
  schema,
  context: createContext,
  playground: true,
  introspection: true,
});

export default server.createHandler({ path: "/api" });
