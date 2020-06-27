"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var nexus_prisma_1 = require("nexus-prisma");
var schema_1 = require("@nexus/schema");
var path_1 = __importDefault(require("path"));
exports.Report = schema_1.objectType({
    name: "Report",
    definition: function (t) {
        t.model.id();
        t.model.slug();
        t.model.current();
        t.model.pages({ type: "Page" });
        t.model.pagecount();
        t.model.captures({ type: "Capture" });
        t.model.createdAt();
    }
});
exports.Page = schema_1.objectType({
    name: "Page",
    definition: function (t) {
        t.model.id();
        t.model.slug();
        t.model.captures({ type: "Capture" });
        t.model.reports({ type: "Report" });
        t.model.reportcount();
        t.model.startsAt();
        t.model.endsAt();
        t.model.createdAt();
    }
});
exports.Capture = schema_1.objectType({
    name: "Capture",
    definition: function (t) {
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
        t.model.deviceScaleFactor();
        t.model.createdAt();
    }
});
exports.Device = schema_1.objectType({
    name: "Device",
    definition: function (t) {
        t.model.id();
        t.model.slug();
        t.model.name();
        t.model.specs();
        t.model.deviceScaleFactor();
        t.model.captures({
            type: "Capture",
            ordering: {
                slug: true
            }
        });
        t.model.createdAt();
    }
});
exports.Sparkline = schema_1.objectType({
    name: "Sparkline",
    definition: function (t) {
        t.model.id();
        t.model.device({ type: "Device" });
        t.model.page({ type: "Page" });
        t.model.data();
    }
});
var Query = schema_1.objectType({
    name: "Query",
    definition: function (t) {
        t.crud.report();
        t.crud.page();
        t.crud.capture();
        t.crud.device();
        t.crud.sparkline();
    }
});
var Mutation = schema_1.objectType({
    name: "Mutation",
    definition: function (t) {
        t.crud.createOneReport();
        t.crud.createOnePage();
        t.crud.createOneDevice();
        t.crud.createOneCapture();
        t.crud.createOneSparkline();
    }
});
var generateArtifacts = Boolean(process.env.GENERATE_ARTIFACTS);
exports.schema = schema_1.makeSchema({
    types: [Query, Mutation, exports.Report, exports.Page, exports.Capture, exports.Device, exports.Sparkline],
    plugins: [
        nexus_prisma_1.nexusPrismaPlugin({
            shouldGenerateArtifacts: generateArtifacts,
            outputs: {
                typegen: path_1["default"].join(__dirname, "/generated/prisma-nexus.ts")
            }
        }),
    ],
    shouldGenerateArtifacts: generateArtifacts,
    outputs: {
        schema: path_1["default"].join(__dirname, "/../../schema.graphql"),
        typegen: path_1["default"].join(__dirname, "/generated/nexus.ts")
    },
    typegenAutoConfig: {
        contextType: "Context.Context",
        sources: [
            {
                source: "@prisma/client",
                alias: "prisma"
            },
            {
                source: require.resolve("./context"),
                alias: "Context"
            },
        ]
    }
});
