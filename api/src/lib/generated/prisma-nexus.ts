import * as prisma from '@prisma/client';
import { core } from '@nexus/schema';
import { GraphQLResolveInfo } from 'graphql';

// Types helpers
  type IsModelNameExistsInGraphQLTypes<
  ReturnType extends any
> = ReturnType extends core.GetGen<'objectNames'> ? true : false;

type NexusPrismaScalarOpts = {
  alias?: string;
};

type Pagination = {
  first?: boolean;
  last?: boolean;
  before?: boolean;
  after?: boolean;
  skip?: boolean;
};

type RootObjectTypes = Pick<
  core.GetGen<'rootTypes'>,
  core.GetGen<'objectNames'>
>;

/**
 * Determine if `B` is a subset (or equivalent to) of `A`.
*/
type IsSubset<A, B> = keyof A extends never
  ? false
  : B extends A
  ? true
  : false;

type OmitByValue<T, ValueType> = Pick<
  T,
  { [Key in keyof T]: T[Key] extends ValueType ? never : Key }[keyof T]
>;

type GetSubsetTypes<ModelName extends any> = keyof OmitByValue<
  {
    [P in keyof RootObjectTypes]: ModelName extends keyof ModelTypes
      ? IsSubset<RootObjectTypes[P], ModelTypes[ModelName]> extends true
        ? RootObjectTypes[P]
        : never
      : never;
  },
  never
>;

type SubsetTypes<ModelName extends any> = GetSubsetTypes<
  ModelName
> extends never
  ? `ERROR: No subset types are available. Please make sure that one of your GraphQL type is a subset of your t.model('<ModelName>')`
  : GetSubsetTypes<ModelName>;

type DynamicRequiredType<ReturnType extends any> = IsModelNameExistsInGraphQLTypes<
  ReturnType
> extends true
  ? { type?: SubsetTypes<ReturnType> }
  : { type: SubsetTypes<ReturnType> };

type GetNexusPrismaInput<
  ModelName extends any,
  MethodName extends any,
  InputName extends 'filtering' | 'ordering'
> = ModelName extends keyof NexusPrismaInputs
  ? MethodName extends keyof NexusPrismaInputs[ModelName]
    ? NexusPrismaInputs[ModelName][MethodName][InputName]
    : never
  : never;

/**
 *  Represents arguments required by Prisma Client JS that will
 *  be derived from a request's input (args, context, and info)
 *  and omitted from the GraphQL API. The object itself maps the
 *  names of these args to a function that takes an object representing
 *  the request's input and returns the value to pass to the prisma
 *  arg of the same name.
 */
export type LocalComputedInputs<MethodName extends any> = Record<
  string,
  (params: LocalMutationResolverParams<MethodName>) => unknown
>

export type GlobalComputedInputs = Record<
  string,
  (params: GlobalMutationResolverParams) => unknown
>

type BaseMutationResolverParams = {
  info: GraphQLResolveInfo
  ctx: Context
}

export type GlobalMutationResolverParams = BaseMutationResolverParams & {
  args: Record<string, any> & { data: unknown }
}

export type LocalMutationResolverParams<
  MethodName extends any
> = BaseMutationResolverParams & {
  args: MethodName extends keyof core.GetGen2<'argTypes', 'Mutation'>
    ? core.GetGen3<'argTypes', 'Mutation', MethodName>
    : any
}

export type Context = core.GetGen<'context'>

type NexusPrismaRelationOpts<
  ModelName extends any,
  MethodName extends any,
  ReturnType extends any
> = GetNexusPrismaInput<
  // If GetNexusPrismaInput returns never, it means there are no filtering/ordering args for it.
  ModelName,
  MethodName,
  'filtering'
> extends never
  ? {
      alias?: string;
      computedInputs?: LocalComputedInputs<MethodName>;
    } & DynamicRequiredType<ReturnType>
  : {
      alias?: string;
      computedInputs?: LocalComputedInputs<MethodName>;
      filtering?:
        | boolean
        | Partial<
            Record<
              GetNexusPrismaInput<ModelName, MethodName, 'filtering'>,
              boolean
            >
          >;
      ordering?:
        | boolean
        | Partial<
            Record<
              GetNexusPrismaInput<ModelName, MethodName, 'ordering'>,
              boolean
            >
          >;
      pagination?: boolean | Pagination;
    } & DynamicRequiredType<ReturnType>;

type IsScalar<TypeName extends any> = TypeName extends core.GetGen<'scalarNames'>
  ? true
  : false;

type IsObject<Name extends any> = Name extends core.GetGen<'objectNames'>
  ? true
  : false

type IsEnum<Name extends any> = Name extends core.GetGen<'enumNames'>
  ? true
  : false

type IsInputObject<Name extends any> = Name extends core.GetGen<'inputNames'>
  ? true
  : false

/**
 * The kind that a GraphQL type may be.
 */
type Kind = 'Enum' | 'Object' | 'Scalar' | 'InputObject'

/**
 * Helper to safely reference a Kind type. For example instead of the following
 * which would admit a typo:
 *
 * ```ts
 * type Foo = Bar extends 'scalar' ? ...
 * ```
 *
 * You can do this which guarantees a correct reference:
 *
 * ```ts
 * type Foo = Bar extends AKind<'Scalar'> ? ...
 * ```
 *
 */
type AKind<T extends Kind> = T

type GetKind<Name extends any> = IsEnum<Name> extends true
  ? 'Enum'
  : IsScalar<Name> extends true
  ? 'Scalar'
  : IsObject<Name> extends true
  ? 'Object'
  : IsInputObject<Name> extends true
  ? 'InputObject'
  // FIXME should be `never`, but GQL objects named differently
  // than backing type fall into this branch
  : 'Object'

type NexusPrismaFields<ModelName extends keyof NexusPrismaTypes> = {
  [MethodName in keyof NexusPrismaTypes[ModelName]]: NexusPrismaMethod<
    ModelName,
    MethodName,
    GetKind<NexusPrismaTypes[ModelName][MethodName]> // Is the return type a scalar?
  >;
};

type NexusPrismaMethod<
  ModelName extends keyof NexusPrismaTypes,
  MethodName extends keyof NexusPrismaTypes[ModelName],
  ThisKind extends Kind,
  ReturnType extends any = NexusPrismaTypes[ModelName][MethodName]
> =
  ThisKind extends AKind<'Enum'>
  ? () => NexusPrismaFields<ModelName>
  : ThisKind extends AKind<'Scalar'>
  ? (opts?: NexusPrismaScalarOpts) => NexusPrismaFields<ModelName> // Return optional scalar opts
  : IsModelNameExistsInGraphQLTypes<ReturnType> extends true // If model name has a mapped graphql types
  ? (
      opts?: NexusPrismaRelationOpts<ModelName, MethodName, ReturnType>
    ) => NexusPrismaFields<ModelName> // Then make opts optional
  : (
      opts: NexusPrismaRelationOpts<ModelName, MethodName, ReturnType>
    ) => NexusPrismaFields<ModelName>; // Else force use input the related graphql type -> { type: '...' }

type GetNexusPrismaMethod<
  TypeName extends string
> = TypeName extends keyof NexusPrismaMethods
  ? NexusPrismaMethods[TypeName]
  : <CustomTypeName extends keyof ModelTypes>(
      typeName: CustomTypeName
    ) => NexusPrismaMethods[CustomTypeName];

type GetNexusPrisma<
  TypeName extends string,
  ModelOrCrud extends 'model' | 'crud'
> = ModelOrCrud extends 'model'
  ? TypeName extends 'Mutation'
    ? never
    : TypeName extends 'Query'
    ? never
    : GetNexusPrismaMethod<TypeName>
  : ModelOrCrud extends 'crud'
  ? TypeName extends 'Mutation'
    ? GetNexusPrismaMethod<TypeName>
    : TypeName extends 'Query'
    ? GetNexusPrismaMethod<TypeName>
    : never
  : never;
  

// Generated
interface ModelTypes {
  Report: prisma.Report
  Page: prisma.Page
  Device: prisma.Device
  Capture: prisma.Capture
}
  
interface NexusPrismaInputs {
  Query: {
    reports: {
  filtering: 'id' | 'slug' | 'current' | 'visible' | 'pages' | 'pagecount' | 'captures' | 'createdAt' | 'AND' | 'OR' | 'NOT'
  ordering: 'id' | 'slug' | 'current' | 'visible' | 'pagecount' | 'createdAt'
}
    pages: {
  filtering: 'id' | 'slug' | 'url' | 'captures' | 'reports' | 'reportcount' | 'startsAt' | 'endsAt' | 'createdAt' | 'AND' | 'OR' | 'NOT'
  ordering: 'id' | 'slug' | 'url' | 'reportcount' | 'startsAt' | 'endsAt' | 'createdAt'
}
    devices: {
  filtering: 'id' | 'slug' | 'name' | 'specs' | 'captures' | 'deviceScaleFactor' | 'createdAt' | 'AND' | 'OR' | 'NOT'
  ordering: 'id' | 'slug' | 'name' | 'specs' | 'deviceScaleFactor' | 'createdAt'
}
    captures: {
  filtering: 'id' | 'slug' | 'url' | 'urlmin' | 'urldiff' | 'diff' | 'diffindex' | 'deviceScaleFactor' | 'pageId' | 'reportId' | 'deviceId' | 'createdAt' | 'AND' | 'OR' | 'NOT' | 'page' | 'report' | 'device'
  ordering: 'id' | 'slug' | 'url' | 'urlmin' | 'urldiff' | 'diff' | 'diffindex' | 'deviceScaleFactor' | 'pageId' | 'reportId' | 'deviceId' | 'createdAt'
}

  },
    Report: {
    pages: {
  filtering: 'id' | 'slug' | 'url' | 'captures' | 'reports' | 'reportcount' | 'startsAt' | 'endsAt' | 'createdAt' | 'AND' | 'OR' | 'NOT'
  ordering: 'id' | 'slug' | 'url' | 'reportcount' | 'startsAt' | 'endsAt' | 'createdAt'
}
    captures: {
  filtering: 'id' | 'slug' | 'url' | 'urlmin' | 'urldiff' | 'diff' | 'diffindex' | 'deviceScaleFactor' | 'pageId' | 'reportId' | 'deviceId' | 'createdAt' | 'AND' | 'OR' | 'NOT' | 'page' | 'report' | 'device'
  ordering: 'id' | 'slug' | 'url' | 'urlmin' | 'urldiff' | 'diff' | 'diffindex' | 'deviceScaleFactor' | 'pageId' | 'reportId' | 'deviceId' | 'createdAt'
}

  },  Page: {
    captures: {
  filtering: 'id' | 'slug' | 'url' | 'urlmin' | 'urldiff' | 'diff' | 'diffindex' | 'deviceScaleFactor' | 'pageId' | 'reportId' | 'deviceId' | 'createdAt' | 'AND' | 'OR' | 'NOT' | 'page' | 'report' | 'device'
  ordering: 'id' | 'slug' | 'url' | 'urlmin' | 'urldiff' | 'diff' | 'diffindex' | 'deviceScaleFactor' | 'pageId' | 'reportId' | 'deviceId' | 'createdAt'
}
    reports: {
  filtering: 'id' | 'slug' | 'current' | 'visible' | 'pages' | 'pagecount' | 'captures' | 'createdAt' | 'AND' | 'OR' | 'NOT'
  ordering: 'id' | 'slug' | 'current' | 'visible' | 'pagecount' | 'createdAt'
}

  },  Device: {
    captures: {
  filtering: 'id' | 'slug' | 'url' | 'urlmin' | 'urldiff' | 'diff' | 'diffindex' | 'deviceScaleFactor' | 'pageId' | 'reportId' | 'deviceId' | 'createdAt' | 'AND' | 'OR' | 'NOT' | 'page' | 'report' | 'device'
  ordering: 'id' | 'slug' | 'url' | 'urlmin' | 'urldiff' | 'diff' | 'diffindex' | 'deviceScaleFactor' | 'pageId' | 'reportId' | 'deviceId' | 'createdAt'
}

  },  Capture: {


  }
}

interface NexusPrismaTypes {
  Query: {
    report: 'Report'
    reports: 'Report'
    page: 'Page'
    pages: 'Page'
    device: 'Device'
    devices: 'Device'
    capture: 'Capture'
    captures: 'Capture'

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

},  Page: {
    id: 'String'
    slug: 'String'
    url: 'String'
    captures: 'Capture'
    reports: 'Report'
    reportcount: 'Int'
    startsAt: 'String'
    endsAt: 'String'
    createdAt: 'DateTime'

},  Device: {
    id: 'String'
    slug: 'String'
    name: 'String'
    specs: 'String'
    captures: 'Capture'
    deviceScaleFactor: 'Int'
    createdAt: 'DateTime'

},  Capture: {
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
    createdAt: 'DateTime'

}
}

interface NexusPrismaMethods {
  Report: NexusPrismaFields<'Report'>
  Page: NexusPrismaFields<'Page'>
  Device: NexusPrismaFields<'Device'>
  Capture: NexusPrismaFields<'Capture'>
  Query: NexusPrismaFields<'Query'>
  Mutation: NexusPrismaFields<'Mutation'>
}
  

declare global {
  type NexusPrisma<
    TypeName extends string,
    ModelOrCrud extends 'model' | 'crud'
  > = GetNexusPrisma<TypeName, ModelOrCrud>;
}
  