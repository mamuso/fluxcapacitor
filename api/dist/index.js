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
if (process.env.NODE_ENV !== "production") {
    // The `listen` method launches a web server.
    server.listen().then(function (_a) {
        var url = _a.url;
        console.log("\uD83D\uDE80  Server ready at " + url);
    });
}
