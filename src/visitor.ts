import {
  ClientSideBaseVisitor,
  ClientSideBasePluginConfig,
  LoadedFragment,
} from '@graphql-codegen/visitor-plugin-common';
import { ReactFormsRawPluginConfig } from './config';
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

export interface ReactFormsConfig extends ClientSideBasePluginConfig {}

export class ReactFormsVisitor extends ClientSideBaseVisitor<
  ReactFormsRawPluginConfig,
  ReactFormsConfig
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
    protected rawConfig: ReactFormsRawPluginConfig,
    documents: Types.DocumentFile[]
  ) {
    super(schema, fragments, rawConfig, {});
    this.schema = schema;
    this._documents = documents;
    autoBind(this);
  }

  public formsImports() {
    return [`import * as React from 'react';`];
  }

  public get nestedFormClassName() {
    return 'mutationFormNested';
  }
  public get FormListClassName() {
    return `mutationFormList`;
  }

  public utilities() {
    return `
    /**************************
     * utilities
     *************************/
    let idNonce = 0;
    const uniqueId = (inStr: string) => inStr+(idNonce++)
    `;
  }
  public scalarComponents() {
    return Object.values(this._typeComponentMap).join('\n\n');
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
    undefinedIfOptionalScalarName = '',
    // stringify and parsing allows you to remove getters and setters, just deal
    // with the actual values
    stringifyAndParse = true
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
    if (this.defaultScalarValues[scalarDefaultName]) {
      if (!stringifyAndParse) return scalarDefaultName;
      return `JSON.parse(JSON.stringify(${scalarDefaultName}))`;
    }
    const value = [
      '{',
      ...(metaData.children || []).map((c) => {
        const type = `${c.tsType}${c.asList ? '[]' : ''}${
          c.optional ? '|undefined' : ''
        }`;

        let defaultVal = this.getDefaultValueStringForTypeNodeMetaData(
          c,
          undefinedIfOptionalScalarName || metaData.scalarName
        );
        let content =
          defaultVal === 'undefined'
            ? `return undefined`
            : `
          return JSON.parse(JSON.stringify(${defaultVal}))
        `;

        // TODO: everything seems to be optional
        return `
          get ${c.name} (): ${type} {
            ${content}
          },
    `;
      }),
      '}',
    ].join('\n');
    this.defaultScalarValues[scalarDefaultName] = value;
    if (!stringifyAndParse) return scalarDefaultName;
    return `JSON.parse(JSON.stringify(${scalarDefaultName}))`;
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
    props: { [key: string]: string } & {
      value: string;
      label: string;
      parentPath: string;
    }
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
      name: string,
      parentPath: string,
      onChange: (value: ${metaData.tsType}${
      metaData.asList ? '[]' : ''
    }) => unknown
    }`;
    const componentDefinitionHead = `export const ${componentKey} = React.memo((props: ${componentKey}PropTypes) => {`;
    let componentPreBody = [
      `const {parentPath, label, name, value, onChange } = props`,
      `const path = [parentPath, name].join('.')`,
    ];
    let componentBody = [
      `
      if(props.optional && !shouldRender){
        return <div><button onClick={(e) => {
          e.preventDefault();
          onChange(${this.getDefaultValueStringForTypeNodeMetaData(metaData)})
          setShouldRender(true)
        }}>Add {label}</button></div>
      }`,
    ];
    const componentDefinitionTail = `})`;
    if (metaData.asList) {
      const actualScalarMetaData = metaData.children?.[0]
        ? metaData.children?.[0]
        : { ...metaData, asList: false };
      const defaultValueString = this.getDefaultValueStringForTypeNodeMetaData(
        actualScalarMetaData
      );
      const name = metaData.name;
      componentPreBody.push(
        `const valueMapRef = React.useRef<
          {id: string, value: ${metaData.tsType}}[]
        >((value||[]).map(v => ({id: uniqueId(${JSON.stringify(
          metaData.name
        )}), value: v})))`,

        `const addItem=() => {
          valueMapRef.current = [...valueMapRef.current, {id: uniqueId('${name}'), value: ${defaultValueString}} ];
          onChange(valueMapRef.current.map(i => i.value))
        }`,
        `const insertItem=(index: number) =>  {
            valueMapRef.current = [
              ...valueMapRef.current.slice(0, index),
              {id: uniqueId('${name}'), value: ${defaultValueString}},
              ...valueMapRef.current.slice(index) ];
            onChange(valueMapRef.current.map(i => i.value))
        }`,
        `const removeItem=(index: number) => {
          valueMapRef.current = [...valueMapRef.current.slice(0, index), ...valueMapRef.current.slice(index+1) ]
          onChange(valueMapRef.current.map(i => i.value))
        }`
      );
      componentBody = [
        `return (
    <div className="${[this.nestedFormClassName, this.FormListClassName].join(
      ' '
    )}">
    {label && <h3>{label} {path}</h3>}
    <ol>
        {valueMapRef.current.length > 0 ? (
          valueMapRef.current.map((item, index) => (
            <li key={item.id}>
              ${this.renderComponentFor(
                { ...metaData, optional: false, asList: false },
                {
                  optional: JSON.stringify(false),
                  label: JSON.stringify(''),
                  value: 'item.value',
                  ...this.asPropString(metaData, ['optional']),
                  parentPath: `path`,
                  name: `String(index)`,
                  onChange: `(newValue) => {
                      valueMapRef.current = valueMapRef.current.map(i => i.id === item.id ? {id: item.id, value: newValue} : i)
                      onChange(valueMapRef.current.map(i => i.value))
                  }`,
                }
              )}
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
    } else if (metaData.endedFromCycle) {
      componentPreBody.push();
      componentBody.push(
        `return <div><strong>{label}</strong>: <button>Add {label}</button></div>`
      );
    } else if (metaData.children) {
      componentPreBody.push(
        `let [shouldRender, setShouldRender] = React.useState(false)`
      );
      componentBody.push(
        `return <div className="${this.nestedFormClassName}">
        <h4>{label}</h4>
        ${metaData.children
          .map((md) =>
            this.renderComponentFor(md, {
              value: `value?.${md.name}`,
              ...this.asPropString(md),
              label: JSON.stringify(sentenceCase(md.name)),
              parentPath: `path`,
              onChange: `(newValue) => onChange({...value, ['${md.name}']: newValue})`,
            })
          )
          .join('\n  ')}</div>`
      );
    } else {
      componentPreBody.push();
      componentBody = [
        `return <div><label><strong>{label}</strong><br /><input value={value === undefined? "" : value} onChange={(e) =>
          onChange(e.target.value as any)} /></label></div>`,
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
  public generateContext() {
    return `
      interface ReactOnChangeHandler<T> extends React.FC<{onChange: (value: T) => T, value?: T, label: string }> {

      }
      export const defaultReactFormContext = {
        form: 'form' as any as React.FunctionComponent<{onSubmit: (e?: {preventDefault?: () => any}) => any}>,
        submitButton: ((props) => <input type="submit" {...props} value={props.text} /> )as React.FunctionComponent<{text: string}>,
        input: ((props) => {
          const typeofValue = typeof props.value
            return (
            <div>
              <label>
                <strong>{props.label}</strong><br />
                <input value={props.value === undefined
                  ? "string"
                  : typeofValue === 'string'
                  ? 'text'
                  : typeofValue === 'number'
                  ? 'number'
                  : props.value instanceof Date
                  ? 'date'
                  : ''
                } onChange={(e) =>
                  props.onChange(e.target.value)} />
              </label>
            </div>)
          }) as ReactOnChangeHandler<string|number|Date>,
        ${Object.keys(this._typeComponentMap)
          .filter((name) => !name.match(/AsList$/))
          .map(
            (scalarName) => `get ${scalarName.replace(/FormInput$/, '')}() {
            return ${scalarName}
          }`
          )
          .join(',\n')}
      }
      export const GQLReactFormContext = React.createContext(defaultReactFormContext)

    `;
  }
  public generateMutationsMetaDataExport() {
    return `
  export const mutationsMetaData = ${JSON.stringify(this._mutations, null, 2)}
  `;
  }
  public forms = '';
  public generateFormsOutput() {
    this.forms = this._mutations
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
  > & { initialValues?: Partial<${baseName}Variables>, onSubmit: (values: ${baseName}Variables)=> unknown }) => {
  const [value, setValue]= React.useState(initialValues || {})
  const ctx = React.useContext(GQLReactFormContext)
  const FormComponent = ctx.form
  const SubmitButton = ctx.submitButton
  return (
      <FormComponent onSubmit={(e) => {
        e?.preventDefault?.()
        onSubmit(value as any)
      }} {...formProps}>
        ${m.variables
          .map((v) =>
            this.renderComponentFor(v, {
              value: `value?.${v.name}`,
              label: JSON.stringify(sentenceCase(v.name)),
              parentPath: JSON.stringify('root'), //JSON.stringify(v.name),
              onChange: `(value) => {
                console.log('onChange ${v.name}', value)
                setValue(oldVal => ({...oldVal, ['${v.name}']: value}))
              }`,
              ...this.asPropString(v),
            })
          )
          .join('\n    ')}
        <SubmitButton text="submit" />
      </FormComponent>
  )
  };
    `;
      })
      .join('\n');
  }
  public get sdkContent(): string {
    return `
    ${this.generateContext()}
/**********************
 * Default Values
 * *******************/
  ${Object.entries(this.defaultScalarValues)
    .map(([name, entry]) => `export const ${name} = ${entry}`)
    .join('\n')}
/**********************
 * Scalar Form Fragments
 * *******************/
  ${this.scalarComponents()}
/***************************
* forms Forms
* *************************/
  ${this.forms}
/***************************
 * MetaData Export
 * *************************/
  ${this.generateMutationsMetaDataExport()}
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
  const optional = true;
  let children: TypeNodeMetaData[] | null = null;
  let endedFromCycle = false;
  if (parentTree.includes(typeDef.name)) {
    endedFromCycle = true;
  }
  if (PrimitiveMaps[typeDef.name]) {
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
  }
  return {
    accessChain: [...parentTree, typeDef.name],
    endedFromCycle,
    scalarName: typeDef.name,
    name,
    tsType,
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
    const optional = !isNonNullType(scalar.type);
    const asList = isListType(scalar.type);
    if (isListType(ofType)) {
      isNonNullType(ofType);
      return {
        ...listTypeConfigToNodeMetaData(ofType, name, types, depth, parentTree),
        optional,
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
        asList,
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
      ...child,
      accessChain: parentTree,
      endedFromCycle: false,
      name,
      children: [child],
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
