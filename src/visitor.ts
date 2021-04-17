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
import { camelCase, pascalCase, sentenceCase } from 'change-case-all';
import { TypeMap } from 'graphql/type/schema';

export interface ReactFormikConfig extends ClientSideBasePluginConfig {}

export class ReactFormikVisitor extends ClientSideBaseVisitor<
  ReactFormikRawPluginConfig,
  ReactFormikConfig
> {
  private _operationsToInclude: {
    node: OperationDefinitionNode;
  }[] = [];
  private defaultScalarValues: { [key: string]: string } = {};
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
      `import { Formik, Form, FormikConfig, FieldArray } from 'formik'`,
    ];
  }

  public get nestedFormClassName() {
    return 'mutationFormNested';
  }
  public get FormListClassName() {
    return `mutationFormList`;
  }

  public scalarComponents() {
    return `
/******************************
 * Scalar Components
 * ****************************/


    ${Object.values(this._typeComponentMap).join('\n\n')}`;
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
        node.variableDefinitions?.map((v) =>
          varDefToVar(v, this.schema.getTypeMap())
        ) || [],
    };
    this._mutations.push(mutationData);
    this._operationsToInclude.push({
      node,
    });

    return '';
  }
  getDefaultValueStringForTypeNodeMetaData(
    metaData: TypeNodeMetaData,
    undefinedIfOptionalScalarName = ''
  ) {
    if (
      metaData.optional &&
      undefinedIfOptionalScalarName === metaData.scalarName
    )
      return 'undefined';
    if (metaData.asList) return '[]';
    if (PrimitiveMaps[metaData.scalarName])
      return PrimitiveMaps[metaData.scalarName].defaultVal;
    const scalarDefaultName = camelCase(`default ${metaData.scalarName}Scalar`);
    if (this.defaultScalarValues[scalarDefaultName]) return scalarDefaultName;
    const value = [
      '{',
      ...(metaData.children || []).map(
        (c) => `
      get ${c.name} (): ${c.tsType}${c.asList ? '[]' : ''}${
          c.optional ? '|undefined' : ''
        } {
        return ${this.getDefaultValueStringForTypeNodeMetaData(
          c,
          undefinedIfOptionalScalarName || metaData.scalarName
        )}
      },
    `
      ),
      '}',
    ].join('\n');
    this.defaultScalarValues[scalarDefaultName] = value;
    return scalarDefaultName;
  }
  asPropString(metaData: TypeNodeMetaData, extraBlackList: string[] = []) {
    const blackList = [
      'children',
      'tsType',
      'accessChain',
      'endedFromCycle',
      'defaultVal',
      'asList',
      ...extraBlackList,
    ];
    return Object.fromEntries(
      Object.entries(metaData)
        .filter(([name]) => !blackList.includes(name))
        .map(([name, value]) => [name, JSON.stringify(value)])
    );
  }
  renderComponentFor(
    metaData: TypeNodeMetaData,
    props: { [key: string]: string } & { value: string; label: string }
  ): string {
    const componentKey = pascalCase(
      metaData.scalarName + 'FormInput' + (metaData.asList ? 'AsList' : '')
    );
    const componentRenderString = `<${componentKey} ${Object.entries(props)
      .map(([propName, propValue]) => `${propName}={${propValue}}`)
      .join(' ')} />`;
    if (this._typeComponentMap[componentKey]) return componentRenderString;
    const componentPropTypes = `export interface ${componentKey}PropTypes {
      optional: boolean,
      label: string,
      value: ${metaData.tsType}${metaData.asList ? '[]' : ''},
      scalarName: string,
      name: string
    }`;
    const componentDefinitionHead = `export const ${componentKey} = (props: ${componentKey}PropTypes) => {`;
    let componentPreBody = [
      `let [shouldRender, setShouldRender] = React.useState(false)`,
      `const {label, value: initialValue = ${this.getDefaultValueStringForTypeNodeMetaData(
        metaData
      )}} = props`,
      `const [value, setValue] = React.useState(initialValue)`,
    ];
    let componentBody = [
      `
      if(props.optional && !shouldRender){
        return <div><button onClick={(e) => {
          e.preventDefault();
          setShouldRender(true)
        }}>Add {label}</button></div>
      }`,
    ];
    const componentDefinitionTail = `}`;
    if (metaData.asList) {
      const actualScalarMetaData = metaData.children?.[0]
        ? metaData.children?.[0]
        : { ...metaData, asList: false };
      componentPreBody.push(
        `const addItem=() => setValue(old => [...old, ${this.getDefaultValueStringForTypeNodeMetaData(
          actualScalarMetaData
        )} ])`,
        `const insertItem=(index: number) => setValue(old => [...old.slice(0, index), ${this.getDefaultValueStringForTypeNodeMetaData(
          actualScalarMetaData
        )}, ...old.slice(index) ])`,
        `const removeItem=(index: number) => setValue(old => [...old.slice(0, index), ...old.slice(index+1) ])`
      );
      componentBody = [
        `return (
    <div className="${[this.nestedFormClassName, this.FormListClassName].join(
      ' '
    )}">
    {label && <h3>{label}</h3>}
    <ol>
        {value.length > 0 ? (
          value.map((item, index) => (
            <li key={index}>
              ${metaData.children
                ?.map((md) =>
                  this.renderComponentFor(
                    { ...md, optional: false, asList: false },
                    {
                      optional: JSON.stringify(false),
                      label: JSON.stringify(''),
                      value: 'item',
                      ...this.asPropString(md, ['optional']),
                    }
                  )
                )
                .join('\n')}
              <button
                type="button"
                onClick={() => removeItem(index)} // remove a friend from the list
              >
                -
              </button>

              <button
                type="button"
                onClick={() => insertItem(index)} // insert an empty string at a position
              >
                +
              </button>
            </li>
          ))
        ) : (
          <button type="button" onClick={addItem}>
          +
          </button>
        )}
    </ol>
    </div>
    )`,
      ];
    } else if (metaData.endedFromCycle && !metaData.asList) {
      componentBody.push(
        `return <div><strong>{label}</strong>: <button>Add {label}</button></div>`
      );
    } else if (metaData.children) {
      componentBody.push(
        `return <div className="${this.nestedFormClassName}">
        <h4>{label}</h4>
        ${metaData.children
          .map((md) =>
            this.renderComponentFor(md, {
              value: `value.${md.name}`,
              ...this.asPropString(md),
              label: JSON.stringify(sentenceCase(md.name)),
            })
          )
          .join('\n  ')}</div>`
      );
    } else {
      // TODO: type this properly
      componentBody = [
        `return <div><label><strong>{label}</strong><br /><input value={value} onChange={(e) =>
          setValue(e.target.value as any)} /></label></div>`,
      ];
    }
    const component = `
    ${componentPropTypes}
        ${componentDefinitionHead}
          ${componentPreBody.join('\n')}
          ${componentBody.join('\n')}
        ${componentDefinitionTail}
    `;
    this._typeComponentMap[componentKey] = component;
    return componentRenderString;
  }

  public get sdkContent(): string {
    const forms =
      `


/****************************
 * Formik Forms
 * *************************/
export const mutationsMetaData = ${JSON.stringify(this._mutations, null, 2)}
` +
      this._mutations
        .map((m) => {
          const baseName = `${pascalCase(m.name)}Form`;
          return `
export const ${camelCase(m.name + 'DefaultValues')} = {
  ${m.variables
    .map(
      (v) =>
        `${v.name}${
          v.optional ? '?' : ''
        }: ${this.getDefaultValueStringForTypeNodeMetaData(v)}`
    )
    .join(',\n')}
};

export interface ${baseName}Variables {
  ${m.variables
    .map(
      (v) =>
        `${v.name}${v.optional ? '?' : ''}: ${v.tsType}${v.asList ? '[]' : ''}`
    )
    .join(',\n')}
}



export const ${baseName} = (
  {
    initialValues = ${camelCase(m.name + 'DefaultValues')},
    onSubmit,
    ...formProps} : React.DetailedHTMLProps<
  React.FormHTMLAttributes<HTMLFormElement>,
  HTMLFormElement
> & { initialValues?: Partial<${baseName}Variables> }) => {
  return (<form onSubmit={onSubmit} {...formProps}>
    ${m.variables
      .map((v) =>
        this.renderComponentFor(v, {
          value: `initialValues.${v.name}`,
          label: JSON.stringify(sentenceCase(v.name)),
          ...this.asPropString(v),
        })
      )
      .join('\n    ')}
  </form>
  )
};
    `;
        })
        .join('\n');

    return `
/**********************
 * Default Values
 * *******************/
  ${Object.entries(this.defaultScalarValues)
    .map(([name, entry]) => `export const ${name} = ${entry}`)
    .join('\n')}
  ${this.scalarComponents()}
  ${forms}
  `;
  }
}

const PrimitiveMaps: { [k: string]: { type: string; defaultVal: string } } = {
  Int: { type: 'Scalars["Int"]', defaultVal: JSON.stringify(0) },
  Float: { type: 'Scalars["Float"]', defaultVal: JSON.stringify(0) },
  String: { type: 'Scalars["String"]', defaultVal: JSON.stringify('') },
  Boolean: { type: 'Scalars["Boolean"]:', defaultVal: JSON.stringify(false) },
  ID: { type: 'Scalars["ID"]', defaultVal: JSON.stringify('') },
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
  asList: boolean;
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
            scalarTypeConfigToNodeMetaData(child, childName, types, depth + 1, [
              ...parentTree,
              typeDef.name,
            ]),
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
    asList: false,
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
      accessChain: parentTree,
      endedFromCycle: false,
      asList: false,
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

    return {
      accessChain: parentTree,
      endedFromCycle: false,
      name,
      optional: true,
      children: [child],
      tsType: child.tsType,
      defaultVal: JSON.stringify([]),
      scalarName: child.scalarName,
      asList: true,
    };
  } else if (type.kind === 'NonNullType') {
    return {
      ...getTypeNodeMeta(type.type, name, types, depth + 1, parentTree),
      optional: false,
    };
  }
  throw new Error('unknown kind');
}

export interface GraphqlEnumValues {
  name: string;
  description: string;
  value: string;
  isDeprecated: boolean;
  deprecationReason: null;
}
