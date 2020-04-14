/**
 * This file was automatically generated by GraphQL Nexus
 * Do not make changes to this file directly
 */

import * as Context from "../src/types"
import * as prisma from "@prisma/client"



declare global {
  interface NexusGenCustomOutputProperties<TypeName extends string> {
    crud: NexusPrisma<TypeName, 'crud'>
    model: NexusPrisma<TypeName, 'model'>
  }
}

declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
  CaptureCreateInput: { // input type
    createdAt?: any | null; // DateTime
    device: NexusGenInputs['DeviceCreateOneWithoutCapturesInput']; // DeviceCreateOneWithoutCapturesInput!
    diff?: boolean | null; // Boolean
    diffindex?: number | null; // Float
    id?: string | null; // String
    page: NexusGenInputs['PageCreateOneWithoutCapturesInput']; // PageCreateOneWithoutCapturesInput!
    report: NexusGenInputs['ReportCreateOneWithoutCapturesInput']; // ReportCreateOneWithoutCapturesInput!
    slug: string; // String!
    url?: string | null; // String
    urldiff?: string | null; // String
    urlmin?: string | null; // String
  }
  CaptureCreateManyWithoutDeviceInput: { // input type
    connect?: NexusGenInputs['CaptureWhereUniqueInput'][] | null; // [CaptureWhereUniqueInput!]
    create?: NexusGenInputs['CaptureCreateWithoutDeviceInput'][] | null; // [CaptureCreateWithoutDeviceInput!]
  }
  CaptureCreateManyWithoutPageInput: { // input type
    connect?: NexusGenInputs['CaptureWhereUniqueInput'][] | null; // [CaptureWhereUniqueInput!]
    create?: NexusGenInputs['CaptureCreateWithoutPageInput'][] | null; // [CaptureCreateWithoutPageInput!]
  }
  CaptureCreateManyWithoutReportInput: { // input type
    connect?: NexusGenInputs['CaptureWhereUniqueInput'][] | null; // [CaptureWhereUniqueInput!]
    create?: NexusGenInputs['CaptureCreateWithoutReportInput'][] | null; // [CaptureCreateWithoutReportInput!]
  }
  CaptureCreateWithoutDeviceInput: { // input type
    createdAt?: any | null; // DateTime
    diff?: boolean | null; // Boolean
    diffindex?: number | null; // Float
    id?: string | null; // String
    page: NexusGenInputs['PageCreateOneWithoutCapturesInput']; // PageCreateOneWithoutCapturesInput!
    report: NexusGenInputs['ReportCreateOneWithoutCapturesInput']; // ReportCreateOneWithoutCapturesInput!
    slug: string; // String!
    url?: string | null; // String
    urldiff?: string | null; // String
    urlmin?: string | null; // String
  }
  CaptureCreateWithoutPageInput: { // input type
    createdAt?: any | null; // DateTime
    device: NexusGenInputs['DeviceCreateOneWithoutCapturesInput']; // DeviceCreateOneWithoutCapturesInput!
    diff?: boolean | null; // Boolean
    diffindex?: number | null; // Float
    id?: string | null; // String
    report: NexusGenInputs['ReportCreateOneWithoutCapturesInput']; // ReportCreateOneWithoutCapturesInput!
    slug: string; // String!
    url?: string | null; // String
    urldiff?: string | null; // String
    urlmin?: string | null; // String
  }
  CaptureCreateWithoutReportInput: { // input type
    createdAt?: any | null; // DateTime
    device: NexusGenInputs['DeviceCreateOneWithoutCapturesInput']; // DeviceCreateOneWithoutCapturesInput!
    diff?: boolean | null; // Boolean
    diffindex?: number | null; // Float
    id?: string | null; // String
    page: NexusGenInputs['PageCreateOneWithoutCapturesInput']; // PageCreateOneWithoutCapturesInput!
    slug: string; // String!
    url?: string | null; // String
    urldiff?: string | null; // String
    urlmin?: string | null; // String
  }
  CaptureWhereUniqueInput: { // input type
    id?: string | null; // String
    slug?: string | null; // String
  }
  DeviceCreateInput: { // input type
    captures?: NexusGenInputs['CaptureCreateManyWithoutDeviceInput'] | null; // CaptureCreateManyWithoutDeviceInput
    createdAt?: any | null; // DateTime
    id?: string | null; // String
    name: string; // String!
    slug: string; // String!
    specs: string; // String!
  }
  DeviceCreateOneWithoutCapturesInput: { // input type
    connect?: NexusGenInputs['DeviceWhereUniqueInput'] | null; // DeviceWhereUniqueInput
    create?: NexusGenInputs['DeviceCreateWithoutCapturesInput'] | null; // DeviceCreateWithoutCapturesInput
  }
  DeviceCreateWithoutCapturesInput: { // input type
    createdAt?: any | null; // DateTime
    id?: string | null; // String
    name: string; // String!
    slug: string; // String!
    specs: string; // String!
  }
  DeviceWhereUniqueInput: { // input type
    id?: string | null; // String
    slug?: string | null; // String
  }
  PageCreateInput: { // input type
    captures?: NexusGenInputs['CaptureCreateManyWithoutPageInput'] | null; // CaptureCreateManyWithoutPageInput
    createdAt?: any | null; // DateTime
    endsAt?: any | null; // DateTime
    id?: string | null; // String
    reportcount?: number | null; // Int
    reports?: NexusGenInputs['ReportCreateManyWithoutPagesInput'] | null; // ReportCreateManyWithoutPagesInput
    slug: string; // String!
    startsAt?: any | null; // DateTime
    url: string; // String!
  }
  PageCreateManyWithoutReportsInput: { // input type
    connect?: NexusGenInputs['PageWhereUniqueInput'][] | null; // [PageWhereUniqueInput!]
    create?: NexusGenInputs['PageCreateWithoutReportsInput'][] | null; // [PageCreateWithoutReportsInput!]
  }
  PageCreateOneWithoutCapturesInput: { // input type
    connect?: NexusGenInputs['PageWhereUniqueInput'] | null; // PageWhereUniqueInput
    create?: NexusGenInputs['PageCreateWithoutCapturesInput'] | null; // PageCreateWithoutCapturesInput
  }
  PageCreateWithoutCapturesInput: { // input type
    createdAt?: any | null; // DateTime
    endsAt?: any | null; // DateTime
    id?: string | null; // String
    reportcount?: number | null; // Int
    reports?: NexusGenInputs['ReportCreateManyWithoutPagesInput'] | null; // ReportCreateManyWithoutPagesInput
    slug: string; // String!
    startsAt?: any | null; // DateTime
    url: string; // String!
  }
  PageCreateWithoutReportsInput: { // input type
    captures?: NexusGenInputs['CaptureCreateManyWithoutPageInput'] | null; // CaptureCreateManyWithoutPageInput
    createdAt?: any | null; // DateTime
    endsAt?: any | null; // DateTime
    id?: string | null; // String
    reportcount?: number | null; // Int
    slug: string; // String!
    startsAt?: any | null; // DateTime
    url: string; // String!
  }
  PageWhereUniqueInput: { // input type
    id?: string | null; // String
    slug?: string | null; // String
  }
  ReportCreateInput: { // input type
    captures?: NexusGenInputs['CaptureCreateManyWithoutReportInput'] | null; // CaptureCreateManyWithoutReportInput
    createdAt?: any | null; // DateTime
    current?: boolean | null; // Boolean
    id?: string | null; // String
    pagecount?: number | null; // Int
    pages?: NexusGenInputs['PageCreateManyWithoutReportsInput'] | null; // PageCreateManyWithoutReportsInput
    slug: string; // String!
    url?: string | null; // String
  }
  ReportCreateManyWithoutPagesInput: { // input type
    connect?: NexusGenInputs['ReportWhereUniqueInput'][] | null; // [ReportWhereUniqueInput!]
    create?: NexusGenInputs['ReportCreateWithoutPagesInput'][] | null; // [ReportCreateWithoutPagesInput!]
  }
  ReportCreateOneWithoutCapturesInput: { // input type
    connect?: NexusGenInputs['ReportWhereUniqueInput'] | null; // ReportWhereUniqueInput
    create?: NexusGenInputs['ReportCreateWithoutCapturesInput'] | null; // ReportCreateWithoutCapturesInput
  }
  ReportCreateWithoutCapturesInput: { // input type
    createdAt?: any | null; // DateTime
    current?: boolean | null; // Boolean
    id?: string | null; // String
    pagecount?: number | null; // Int
    pages?: NexusGenInputs['PageCreateManyWithoutReportsInput'] | null; // PageCreateManyWithoutReportsInput
    slug: string; // String!
    url?: string | null; // String
  }
  ReportCreateWithoutPagesInput: { // input type
    captures?: NexusGenInputs['CaptureCreateManyWithoutReportInput'] | null; // CaptureCreateManyWithoutReportInput
    createdAt?: any | null; // DateTime
    current?: boolean | null; // Boolean
    id?: string | null; // String
    pagecount?: number | null; // Int
    slug: string; // String!
    url?: string | null; // String
  }
  ReportWhereUniqueInput: { // input type
    id?: string | null; // String
    slug?: string | null; // String
  }
}

export interface NexusGenEnums {
}

export interface NexusGenRootTypes {
  Capture: prisma.Capture;
  Device: prisma.Device;
  Mutation: {};
  Page: prisma.Page;
  Query: {};
  Report: prisma.Report;
  String: string;
  Int: number;
  Float: number;
  Boolean: boolean;
  ID: string;
  DateTime: any;
}

export interface NexusGenAllTypes extends NexusGenRootTypes {
  CaptureCreateInput: NexusGenInputs['CaptureCreateInput'];
  CaptureCreateManyWithoutDeviceInput: NexusGenInputs['CaptureCreateManyWithoutDeviceInput'];
  CaptureCreateManyWithoutPageInput: NexusGenInputs['CaptureCreateManyWithoutPageInput'];
  CaptureCreateManyWithoutReportInput: NexusGenInputs['CaptureCreateManyWithoutReportInput'];
  CaptureCreateWithoutDeviceInput: NexusGenInputs['CaptureCreateWithoutDeviceInput'];
  CaptureCreateWithoutPageInput: NexusGenInputs['CaptureCreateWithoutPageInput'];
  CaptureCreateWithoutReportInput: NexusGenInputs['CaptureCreateWithoutReportInput'];
  CaptureWhereUniqueInput: NexusGenInputs['CaptureWhereUniqueInput'];
  DeviceCreateInput: NexusGenInputs['DeviceCreateInput'];
  DeviceCreateOneWithoutCapturesInput: NexusGenInputs['DeviceCreateOneWithoutCapturesInput'];
  DeviceCreateWithoutCapturesInput: NexusGenInputs['DeviceCreateWithoutCapturesInput'];
  DeviceWhereUniqueInput: NexusGenInputs['DeviceWhereUniqueInput'];
  PageCreateInput: NexusGenInputs['PageCreateInput'];
  PageCreateManyWithoutReportsInput: NexusGenInputs['PageCreateManyWithoutReportsInput'];
  PageCreateOneWithoutCapturesInput: NexusGenInputs['PageCreateOneWithoutCapturesInput'];
  PageCreateWithoutCapturesInput: NexusGenInputs['PageCreateWithoutCapturesInput'];
  PageCreateWithoutReportsInput: NexusGenInputs['PageCreateWithoutReportsInput'];
  PageWhereUniqueInput: NexusGenInputs['PageWhereUniqueInput'];
  ReportCreateInput: NexusGenInputs['ReportCreateInput'];
  ReportCreateManyWithoutPagesInput: NexusGenInputs['ReportCreateManyWithoutPagesInput'];
  ReportCreateOneWithoutCapturesInput: NexusGenInputs['ReportCreateOneWithoutCapturesInput'];
  ReportCreateWithoutCapturesInput: NexusGenInputs['ReportCreateWithoutCapturesInput'];
  ReportCreateWithoutPagesInput: NexusGenInputs['ReportCreateWithoutPagesInput'];
  ReportWhereUniqueInput: NexusGenInputs['ReportWhereUniqueInput'];
}

export interface NexusGenFieldTypes {
  Capture: { // field return type
    createdAt: any; // DateTime!
    device: NexusGenRootTypes['Device']; // Device!
    diff: boolean; // Boolean!
    diffindex: number | null; // Float
    id: string; // String!
    page: NexusGenRootTypes['Page']; // Page!
    report: NexusGenRootTypes['Report']; // Report!
    slug: string; // String!
    url: string | null; // String
    urldiff: string | null; // String
    urlmin: string | null; // String
  }
  Device: { // field return type
    captures: NexusGenRootTypes['Capture'][]; // [Capture!]!
    createdAt: any; // DateTime!
    id: string; // String!
    name: string; // String!
    slug: string; // String!
    specs: string; // String!
  }
  Mutation: { // field return type
    createOneCapture: NexusGenRootTypes['Capture']; // Capture!
    createOneDevice: NexusGenRootTypes['Device']; // Device!
    createOnePage: NexusGenRootTypes['Page']; // Page!
    createOneReport: NexusGenRootTypes['Report']; // Report!
  }
  Page: { // field return type
    captures: NexusGenRootTypes['Capture'][]; // [Capture!]!
    createdAt: any; // DateTime!
    endsAt: any | null; // DateTime
    id: string; // String!
    reportcount: number | null; // Int
    reports: NexusGenRootTypes['Report'][]; // [Report!]!
    slug: string; // String!
    startsAt: any | null; // DateTime
  }
  Query: { // field return type
    capture: NexusGenRootTypes['Capture'] | null; // Capture
    device: NexusGenRootTypes['Device'] | null; // Device
    page: NexusGenRootTypes['Page'] | null; // Page
    report: NexusGenRootTypes['Report'] | null; // Report
  }
  Report: { // field return type
    captures: NexusGenRootTypes['Capture'][]; // [Capture!]!
    createdAt: any; // DateTime!
    current: boolean; // Boolean!
    id: string; // String!
    pagecount: number | null; // Int
    pages: NexusGenRootTypes['Page'][]; // [Page!]!
    slug: string; // String!
    url: string | null; // String
  }
}

export interface NexusGenArgTypes {
  Device: {
    captures: { // args
      after?: NexusGenInputs['CaptureWhereUniqueInput'] | null; // CaptureWhereUniqueInput
      before?: NexusGenInputs['CaptureWhereUniqueInput'] | null; // CaptureWhereUniqueInput
      first?: number | null; // Int
      last?: number | null; // Int
      skip?: number | null; // Int
    }
  }
  Mutation: {
    createOneCapture: { // args
      data: NexusGenInputs['CaptureCreateInput']; // CaptureCreateInput!
    }
    createOneDevice: { // args
      data: NexusGenInputs['DeviceCreateInput']; // DeviceCreateInput!
    }
    createOnePage: { // args
      data: NexusGenInputs['PageCreateInput']; // PageCreateInput!
    }
    createOneReport: { // args
      data: NexusGenInputs['ReportCreateInput']; // ReportCreateInput!
    }
  }
  Page: {
    captures: { // args
      after?: NexusGenInputs['CaptureWhereUniqueInput'] | null; // CaptureWhereUniqueInput
      before?: NexusGenInputs['CaptureWhereUniqueInput'] | null; // CaptureWhereUniqueInput
      first?: number | null; // Int
      last?: number | null; // Int
      skip?: number | null; // Int
    }
    reports: { // args
      after?: NexusGenInputs['ReportWhereUniqueInput'] | null; // ReportWhereUniqueInput
      before?: NexusGenInputs['ReportWhereUniqueInput'] | null; // ReportWhereUniqueInput
      first?: number | null; // Int
      last?: number | null; // Int
      skip?: number | null; // Int
    }
  }
  Query: {
    capture: { // args
      where: NexusGenInputs['CaptureWhereUniqueInput']; // CaptureWhereUniqueInput!
    }
    device: { // args
      where: NexusGenInputs['DeviceWhereUniqueInput']; // DeviceWhereUniqueInput!
    }
    page: { // args
      where: NexusGenInputs['PageWhereUniqueInput']; // PageWhereUniqueInput!
    }
    report: { // args
      where: NexusGenInputs['ReportWhereUniqueInput']; // ReportWhereUniqueInput!
    }
  }
  Report: {
    captures: { // args
      after?: NexusGenInputs['CaptureWhereUniqueInput'] | null; // CaptureWhereUniqueInput
      before?: NexusGenInputs['CaptureWhereUniqueInput'] | null; // CaptureWhereUniqueInput
      first?: number | null; // Int
      last?: number | null; // Int
      skip?: number | null; // Int
    }
    pages: { // args
      after?: NexusGenInputs['PageWhereUniqueInput'] | null; // PageWhereUniqueInput
      before?: NexusGenInputs['PageWhereUniqueInput'] | null; // PageWhereUniqueInput
      first?: number | null; // Int
      last?: number | null; // Int
      skip?: number | null; // Int
    }
  }
}

export interface NexusGenAbstractResolveReturnTypes {
}

export interface NexusGenInheritedFields {}

export type NexusGenObjectNames = "Capture" | "Device" | "Mutation" | "Page" | "Query" | "Report";

export type NexusGenInputNames = "CaptureCreateInput" | "CaptureCreateManyWithoutDeviceInput" | "CaptureCreateManyWithoutPageInput" | "CaptureCreateManyWithoutReportInput" | "CaptureCreateWithoutDeviceInput" | "CaptureCreateWithoutPageInput" | "CaptureCreateWithoutReportInput" | "CaptureWhereUniqueInput" | "DeviceCreateInput" | "DeviceCreateOneWithoutCapturesInput" | "DeviceCreateWithoutCapturesInput" | "DeviceWhereUniqueInput" | "PageCreateInput" | "PageCreateManyWithoutReportsInput" | "PageCreateOneWithoutCapturesInput" | "PageCreateWithoutCapturesInput" | "PageCreateWithoutReportsInput" | "PageWhereUniqueInput" | "ReportCreateInput" | "ReportCreateManyWithoutPagesInput" | "ReportCreateOneWithoutCapturesInput" | "ReportCreateWithoutCapturesInput" | "ReportCreateWithoutPagesInput" | "ReportWhereUniqueInput";

export type NexusGenEnumNames = never;

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = "Boolean" | "DateTime" | "Float" | "ID" | "Int" | "String";

export type NexusGenUnionNames = never;

export interface NexusGenTypes {
  context: Context.Context;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  allTypes: NexusGenAllTypes;
  inheritedFields: NexusGenInheritedFields;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractResolveReturn: NexusGenAbstractResolveReturnTypes;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
}