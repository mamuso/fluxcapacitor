"use strict";
exports.__esModule = true;
var apollo_server_micro_1 = require("apollo-server-micro");
var schema_1 = require("./lib/schema");
var context_1 = require("./lib/context");
var server = new apollo_server_micro_1.ApolloServer({
    schema: schema_1.schema,
    context: context_1.createContext,
    playground: true,
    introspection: true
});
exports["default"] = server.createHandler({ path: "/api" });
