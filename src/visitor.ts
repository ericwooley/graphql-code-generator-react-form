import {
  ClientSideBaseVisitor,
  ClientSideBasePluginConfig,
  LoadedFragment,
} from '@graphql-codegen/visitor-plugin-common';
import { ReactFormikRawPluginConfig } from './config';
import autoBind from 'auto-bind';
import {
  GraphQLNamedType,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
  GraphQLSchema,
  OperationDefinitionNode,
  TypeNode,
  VariableDefinitionNode,
  isNonNullType,
  isListType,
  GraphQLList,
  GraphQLNonNull,
  isNamedType,
} from 'graphql';
import { Types } from '@graphql-codegen/plugin-helpers';
import { camelCase, pascalCase } from 'change-case-all';
import { TypeMap } from 'graphql/type/schema';

export interface ReactFormikConfig extends ClientSideBasePluginConfig {}

export class ReactFormikVisitor extends ClientSideBaseVisitor<
  ReactFormikRawPluginConfig,
  ReactFormikConfig
> {
  private _operationsToInclude: {
    node: OperationDefinitionNode;
  }[] = [];
  private _typeComponentMap: {
    [key: string]: string;
  } = {};
  private _mutations: {
    name: string;
    variables: (TypeNodeMetaData & { name: string })[];
  }[] = [];
  schema: GraphQLSchema;
  constructor(
    schema: GraphQLSchema,
    fragments: LoadedFragment[],
    protected rawConfig: ReactFormikRawPluginConfig,
    documents: Types.DocumentFile[]
  ) {
    super(schema, fragments, rawConfig, {});
    this.schema = schema;
    this._documents = documents;
    autoBind(this);
  }

  public formikImports() {
    return [
      `import * as React from 'react';`,
      `import { Formik, Form, FormikConfig } from 'formik'`,
    ];
  }

  protected buildOperation(
    node: OperationDefinitionNode,
    _documentVariableName: string,
    _operationType: string,
    _operationResultType: string,
    _operationVariablesTypes: string
  ): string {
    if (node.operation !== 'mutation') return '';
    const mutationData = {
      name: node.name?.value || 'unknown',
      variables:
        node.variableDefinitions?.map(v =>
          varDefToVar(v, this.schema.getTypeMap())
        ) || [],
    };
    this._mutations.push(mutationData);
    this._operationsToInclude.push({
      node,
    });

    return '';
  }

  getComponentFor(metaData: TypeNodeMetaData) {
    const componentKey = metaData.scalarName + metaData.asList ? 'AsList' : '';
    if (this._typeComponentMap[componentKey])
      return this._typeComponentMap[componentKey];
    if (metaData.asList) return `${metaData} list`;
    if (metaData.endedFromCycle) return `touch to load more`;
    if (metaData.children)
      return `<div><h4>${metaData.name}</h4>${metaData.children
        .map(this.renderFormElement)
        .join('\n  ')}</div>`;
    const component = `const () => {
      return <input type="${metaData.scalarName}" name="${metaData.name}">
    }`;
    this._typeComponentMap[componentKey] = component;
    return component;
  }

  renderFormElement(metaData: TypeNodeMetaData): string {
    // if (metaData.children)
    //   return `<div><h4>${metaData.name} ></h4>${metaData.children
    //     .map(this.renderFormElement)
    //     .join('\n  ')}</div>`;
    // if (metaData.asList)
    //   return `<label><h5>${metaData.name} as list</h5><input name="${metaData.name}" type="${metaData.tsType}" /></label>`;
    // return `<label><h5>${metaData.name}</h5><input name="${metaData.name}" type="${metaData.tsType}" /></label>`;
    return `<pre>{JSON.stringify(${JSON.stringify(
      metaData,
      null,
      2
    )}, null, 2)}</pre>`;
  }
  public get sdkContent(): string {
    return (
      `
/****************************
 * Formik Forms
 * *************************/
` +
      this._mutations
        .map(m => {
          const baseName = `${pascalCase(m.name)}Form`;
          return `
export const ${camelCase(m.name + 'DefaultValues')} = {
  ${m.variables
    .map(v => `${v.name}${v.optional ? '?' : ''}: undefined`)
    .join(',\n')}
};

export interface ${baseName}Variables {
  ${m.variables
    .map(v => `${v.name}${v.optional ? '?' : ''}: ${v.tsType}`)
    .join(',\n')}
}
export const ${baseName} = ({  initialValues, onSubmit, ...formikProps}: FormikConfig<${baseName}Variables>) => {
  return (<Formik onSubmit={onSubmit} initialValues={{...${camelCase(
    m.name + 'DefaultValues'
  )}, ...initialValues}} {...formikProps}>
    <Form>
    ${m.variables.map(v => this.renderFormElement(v)).join('\n    ')}
    </Form>
  </Formik>)
};
    `;
        })
        .join('\n')
    );
  }
}

const PrimitiveMaps: { [k: string]: { type: string; defaultVal: string } } = {
  Int: { type: 'Scalars.Int', defaultVal: JSON.stringify(0) },
  Float: { type: 'Scalars.Float', defaultVal: JSON.stringify(0) },
  String: { type: 'Scalars.String', defaultVal: JSON.stringify('') },
  Boolean: { type: 'Scalars.Boolean:', defaultVal: JSON.stringify(false) },
  ID: { type: 'Scalars.ID', defaultVal: JSON.stringify('') },
};

export function varDefToVar(
  varDef: VariableDefinitionNode,
  types: TypeMap
): TypeNodeMetaData {
  return getTypeNodeMeta(varDef.type, varDef.variable.name.value, types, 0, []);
}

interface TypeNodeMetaData {
  accessChain: string[];
  endedFromCycle: boolean;
  name: string;
  tsType: string;
  scalarName: string;
  defaultVal: string;
  optional: boolean;
  children?: Array<TypeNodeMetaData> | null;
  asList?: boolean;
}

export function namedTypeToTypeNodeMetaData(
  typeDef: GraphQLNamedType & {
    // seems like this is only for enums
    _values?: GraphqlEnumValues[];
    // this is the good stuff
    _fields?: {
      [key: string]: GraphQLScalarTypeConfig<unknown, unknown> & {
        type?: string | ({ ofType?: GraphQLScalarType } & GraphQLScalarType);
      };
    };
  },
  name: string,
  types: TypeMap,
  depth: number,
  parentTree: string[]
): TypeNodeMetaData {
  let tsType = typeDef.name;
  let defaultVal = JSON.stringify('undefined');
  const optional = true;
  let children: TypeNodeMetaData[] | null = null;
  let endedFromCycle = false;
  if (parentTree.includes(typeDef.name)) {
    endedFromCycle = true;
  }
  if (PrimitiveMaps[typeDef.name]) {
    defaultVal = PrimitiveMaps[typeDef.name].defaultVal;
    tsType = PrimitiveMaps[typeDef.name].type;
  } else if (typeDef._fields && !endedFromCycle) {
    const typeDefFields = Object.fromEntries(
      Object.entries(typeDef._fields)
        .filter(([, child]) => (child as any).type)
        .map(([childName, child]) => {
          return [
            childName,
            scalarTypeConfigToNodeMetaData(
              child,
              `${name}.${childName}`,
              types,
              depth + 1,
              [...parentTree, typeDef.name]
            ),
          ];
        })
    );
    children = Object.values(typeDefFields);
  } else if (typeDef._values) {
    defaultVal = typeDef._values[0].value;
    tsType = typeof defaultVal;
  }
  return {
    accessChain: [...parentTree, typeDef.name],
    endedFromCycle,
    scalarName: typeDef.name,
    name,
    tsType,
    defaultVal,
    optional,
    children,
  };
}

export function listTypeConfigToNodeMetaData(
  scalar: GraphQLList<any>,
  name: string,
  types: TypeMap,
  depth: number,
  parentTree: string[]
): TypeNodeMetaData {
  if (isNonNullType(scalar.ofType))
    return {
      ...nonNullTypeConfigToNodeMetaData(
        scalar.ofType,
        name,
        types,
        depth,
        parentTree
      ),
      asList: true,
    };
  if (isNamedType(scalar.ofType))
    return {
      ...namedTypeToTypeNodeMetaData(
        scalar.ofType,
        name,
        types,
        depth,
        parentTree
      ),
      asList: true,
    };
  throw new Error('unknown child type for list');
}

export function nonNullTypeConfigToNodeMetaData(
  scalar: GraphQLNonNull<any>,
  name: string,
  types: TypeMap,
  depth: number,
  parentTree: string[]
): TypeNodeMetaData {
  if (isListType(scalar.ofType))
    return {
      ...listTypeConfigToNodeMetaData(
        scalar.ofType,
        name,
        types,
        depth,
        parentTree
      ),
      optional: false,
    };
  if (isNamedType(scalar.ofType))
    return {
      ...namedTypeToTypeNodeMetaData(
        scalar.ofType,
        name,
        types,
        depth,
        parentTree
      ),
      optional: false,
    };
  throw new Error('unknown child type for list');
}
export function scalarTypeConfigToNodeMetaData(
  scalar: GraphQLScalarTypeConfig<unknown, unknown> & {
    type?:
      | string
      | ({
          ofType?: GraphQLList<any> | GraphQLNonNull<any> | GraphQLNamedType;
        } & GraphQLScalarType);
  },
  name: string,
  types: TypeMap,
  depth: number,
  parentTree: string[]
): TypeNodeMetaData {
  if (!scalar.type) {
    throw new Error(`No type for ${scalar.name}`);
  }
  let scalarName = '';

  if (typeof scalar.type === 'string') {
    scalarName = scalar.type;
  } else if (scalar.type['ofType']) {
    const ofType: unknown = scalar.type.ofType;
    if (isListType(ofType)) {
      return {
        ...listTypeConfigToNodeMetaData(ofType, name, types, depth, parentTree),
        asList: true,
      };
    } else if (isNonNullType(ofType)) {
      return {
        ...nonNullTypeConfigToNodeMetaData(
          ofType,
          name,
          types,
          depth,
          parentTree
        ),
        optional: false,
      };
    } else if (isNamedType(ofType)) {
      return namedTypeToTypeNodeMetaData(
        ofType,
        name,
        types,
        depth,
        parentTree
      );
    }
  } else {
    scalarName = scalar.type.name;
  }

  const type = types[scalarName];
  if (!type) {
    throw new Error(`scalar not found: ${scalarName}`);
  }

  return namedTypeToTypeNodeMetaData(type, name, types, depth, parentTree);
}

export function getTypeNodeMeta(
  type: TypeNode,
  name: string,
  types: TypeMap,
  depth: number,
  parentTree: string[]
): TypeNodeMetaData {
  let tsType = '';
  let defaultVal = JSON.stringify('undefined');
  const optional = true;
  let children: TypeNodeMetaData[] | null = null;
  let scalarName = '';
  let childrenAsList = false;
  if (type.kind === 'NamedType') {
    scalarName = type.name.value;
    tsType = type.name.value;
    const typeDef: GraphQLNamedType & {
      // seems like this is only for enums
      _values?: GraphqlEnumValues[];
      // this is the good stuff
      _fields?: {
        [key: string]: GraphQLScalarTypeConfig<unknown, unknown> & {
          type?: string | ({ ofType?: GraphQLScalarType } & GraphQLScalarType);
        };
      };
    } = types[type.name.value];
    if (typeDef)
      return namedTypeToTypeNodeMetaData(
        typeDef,
        name,
        types,
        depth + 1,
        parentTree
      );
    return {
      accessChain: [],
      endedFromCycle: false,
      asList: childrenAsList,
      scalarName,
      name,
      tsType,
      optional,
      defaultVal,
      children,
    };
  }
  if (type.kind === 'ListType') {
    const child = getTypeNodeMeta(
      type.type,
      name,
      types,
      depth + 1,
      parentTree
    );
    children = [child];
    tsType = child.tsType + '[]';
    defaultVal = JSON.stringify([]);
    scalarName = child.scalarName;
    childrenAsList = true;
  }
  return {
    ...getTypeNodeMeta(type.type, name, types, depth + 1, parentTree),
    optional: false,
  };
}

export interface GraphqlEnumValues {
  name: string;
  description: string;
  value: string;
  isDeprecated: boolean;
  deprecationReason: null;
}
