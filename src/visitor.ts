import {
  ClientSideBaseVisitor,
  ClientSideBasePluginConfig,
  LoadedFragment,
} from '@graphql-codegen/visitor-plugin-common';
import { ReactFormsRawPluginConfig } from './config';
import autoBind from 'auto-bind';
import { GraphQLSchema, OperationDefinitionNode } from 'graphql';
import { Types } from '@graphql-codegen/plugin-helpers';
import { camelCase, pascalCase, sentenceCase } from 'change-case-all';
import { ComponentComposer } from './components';
import {
  TypeNodeMetaData,
  varDefToVar,
  PrimitiveMaps,
} from './metaDataBuilder';

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
    documents: Types.DocumentFile[],
    private cc = new ComponentComposer(rawConfig)
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
      error?: ${metaData.scalarName}Validation${
      metaData.asList ? '[]' : ''
    }|string,
      value?: Maybe<${metaData.tsType}${metaData.asList ? '>[]' : '>'},
      scalarName: string,
      name: string,
      parentPath: string,
      depth: number,
      onChange: (value?: ${metaData.tsType}${
      metaData.asList ? '[]' : ''
    }) => any
    }`;
    const componentDefinitionHead = `export const ${componentKey} = React.memo((props: ${componentKey}PropTypes) => {`;
    let componentPreBody = [
      `const {parentPath, label, name, value, onChange, depth, error } = props`,
      `const [touched, setTouched] = React.useState(false)`,
      `const setTouchedTrue = React.useCallback(() => setTouched(true), [setTouched])`,
      `const scalar = ${JSON.stringify(metaData.scalarName)}`,
      `const path = [parentPath, name].join('.')`,
    ];
    let componentBody = [
      `
      if(value === undefined || value === null ){
        return ${this.cc.div.render(
          {},
          this.cc.button.render(
            {
              onClick: `() =>{
                setTouchedTrue()
                onChange(${this.getDefaultValueStringForTypeNodeMetaData(
                  metaData
                )})}
          `,
            },
            `Add {label}`
          )
        )}
      }`,
    ];
    const componentDefinitionTail = `})`;

    // Render the list component, and each child as it's own item.
    if (metaData.asList) {
      const actualScalarMetaData = metaData.children?.[0]
        ? metaData.children?.[0]
        : { ...metaData, asList: false };
      const defaultValueString = this.getDefaultValueStringForTypeNodeMetaData(
        actualScalarMetaData
      );
      const name = metaData.name;
      componentPreBody.push(
        this.cc.addButton.init,
        this.cc.removeButton.init,
        this.cc.listItem.init,
        this.cc.div.init,
        this.cc.labelTextWrapper.init,
        `const valueMapRef = React.useRef<
          {id: string, value: Maybe<${metaData.tsType}>}[]
        >((value||[]).map(v => ({id: uniqueId(${JSON.stringify(
          metaData.name
        )}), value: v})))`,

        `const addItem=() => {
          valueMapRef.current = [...valueMapRef.current, {id: uniqueId('${name}'), value: ${defaultValueString}} ];
          onChange(valueMapRef.current.map(i => i.value === null ? ${this.getDefaultValueStringForTypeNodeMetaData(
            actualScalarMetaData
          )}: i.value))
        }`,
        `const insertItem=(index: number) =>  {
            valueMapRef.current = [
              ...valueMapRef.current.slice(0, index),
              {id: uniqueId('${name}'), value: ${defaultValueString}},
              ...valueMapRef.current.slice(index) ];
            onChange(valueMapRef.current.map(i => i.value === null ? ${this.getDefaultValueStringForTypeNodeMetaData(
              actualScalarMetaData
            )}: i.value))
        }`,
        `const removeItem=(index: number) => {
          valueMapRef.current = [...valueMapRef.current.slice(0, index), ...valueMapRef.current.slice(index+1) ]
          onChange(valueMapRef.current.map(i => i.value === null ? ${this.getDefaultValueStringForTypeNodeMetaData(
            actualScalarMetaData
          )}: i.value))
        }`,
        this.cc.listWrapper.init
      );
      componentBody = [
        `return (
    ${this.cc.div.render(
      {
        className: JSON.stringify(
          [this.nestedFormClassName, this.FormListClassName].join(' ')
        ),
      },
      `
    {label && ${this.cc.labelTextWrapper.render({}, `{label}`)}}
    ${this.cc.listWrapper.render(
      {
        totalInList: 'valueMapRef.current.length',
      },
      `
        {
          valueMapRef.current.map((item, index) => (
            ${this.cc.listItem.render(
              {
                idx: 'index',
                key: 'item.id',
                insertAboveButton: this.cc.addButton.render(
                  { onClick: '() => insertItem(index)' },
                  '+'
                ),
                removeButton: `
                  ${this.cc.removeButton.render(
                    { onClick: `() => removeItem(index)` },
                    `X`
                  )}
                `,
              },
              this.renderComponentFor(
                { ...metaData, optional: false, asList: false },
                {
                  optional: JSON.stringify(false),
                  label: JSON.stringify(''),
                  value: 'item.value',
                  ...this.asPropString(metaData, ['optional']),
                  parentPath: `path`,
                  name: `String(index)`,
                  depth: 'depth',
                  error:
                    'typeof error ==="string" ? undefined : error?.[index]',
                  onChange: `(newValue = ${this.getDefaultValueStringForTypeNodeMetaData(
                    actualScalarMetaData
                  )}) => {
                        valueMapRef.current = valueMapRef.current.map(i => i.id === item.id ? {id: item.id, value: newValue} : i)
                        onChange(valueMapRef.current.map(i => i.value === null ?${this.getDefaultValueStringForTypeNodeMetaData(
                          actualScalarMetaData
                        )} : i.value))
                    }`,
                }
              )
            )}
          ))
        }
        ${this.cc.addButton.render({ onClick: 'addItem' }, `+`)}`
    )}
      `
    )}
    )`,
      ];
    }

    // In this case, there is already a component rendered for this, but this one needs to be here optionally.
    else if (metaData.endedFromCycle) {
      componentPreBody.push(
        this.cc.div.init,
        this.cc.button.init,
        this.cc.labelTextWrapper.init
      );
      componentBody.push(
        `return (
          ${this.cc.div.render(
            {
              error: `error[${JSON.stringify(metaData.name)}]`,
            },
            [
              this.cc.labelTextWrapper.render({}, `{label}`),
              this.cc.button.render({}, `Add {label}`),
            ].join('\n')
          )}`
      );
    }

    // an scalar that requires customization, as it has children
    else if (metaData.children) {
      const tagName = `${pascalCase(metaData.name)}Component`;
      componentPreBody.push(
        this.cc.div.init,
        this.cc.button.init,
        this.cc.labelTextWrapper.init,
        `
        const ${tagName} = useCustomizedComponent(scalar)
        if(${tagName}) return <${tagName} {...props} />
        `
      );
      componentBody.push(
        `return ${this.cc.div.render(
          { className: JSON.stringify(this.nestedFormClassName) },
          `
            ${this.cc.labelTextWrapper.render({}, `{label}`)}
            ${metaData.children
              .map((md) =>
                this.renderComponentFor(md, {
                  error: `typeof error === 'string'? undefined : error?.[${JSON.stringify(
                    md.name
                  )}]`,
                  depth: 'depth+1',
                  value: `value?.${md.name} === null? undefined : value?.${md.name}`,
                  ...this.asPropString(md),
                  label: JSON.stringify(sentenceCase(md.name)),
                  parentPath: `path`,
                  onChange: `(newValue = ${this.getDefaultValueStringForTypeNodeMetaData(
                    md
                  )}) => onChange({...value, ['${md.name}']: newValue})`,
                })
              )
              .join('\n  ')}
        `
        )}`
      );
    } else {
      componentPreBody.push(this.cc.input.init);
      componentBody = [
        `return (
        ${this.cc.input.render(
          {
            error: 'error',
            onBlur: 'setTouchedTrue',
            touched: 'touched',
            onChange: 'onChange as any',
            value: 'value === undefined || value===null? "" : value',
            label: 'label',
          },
          ''
        )})`,
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
    return this.cc.generateContext(this._typeComponentMap);
  }

  public generateMutationsMetaDataExport() {
    return `
  export const mutationsMetaData = ${JSON.stringify(this._mutations, null, 2)}
  `;
  }
  private validationName = (node: TypeNodeMetaData) =>
    `${node.scalarName}Validation`;
  private nodeMetaDataValidationKeyGenerator = (
    node: TypeNodeMetaData,
    propertyName: string = node.name
  ) =>
    `${propertyName}__${this.validationName(node)}${
      node.asList ? 'List' : ''
    }Error?: string`;
  private reusableValidations: { [key: string]: string } = {};

  private generateValidation(node: TypeNodeMetaData, name = node.name): string {
    const validationName = this.validationName(node);
    let extraValidation = ``;
    if (node.asList || node.children || node.endedFromCycle) {
      extraValidation = `,${this.nodeMetaDataValidationKeyGenerator(
        node,
        name
      )}`;
    }
    if (this.reusableValidations[validationName]) {
      return `${name}${node.optional ? '?' : ''}: ${validationName}${
        node.asList ? '[]|string' : ''
      }${extraValidation}`;
    }
    let validation = ``;
    let key = `${name}`;
    if (node.asList) {
      key = `${name}ListValidation${node.optional ? '?' : ''}`;
      validation = `(${validationName}|string)[] | string`;
    } else if (node.endedFromCycle) {
      validation = `${validationName}`;
    } else if (node.children) {
      validation = `{
        ${node.children.map((n) => this.generateValidation(n))}
      }|string`;
    } else {
      key = `${name}${node.optional ? '?' : ''}`;
      validation = `string`;
    }
    this.reusableValidations[validationName] = validation;
    return `${key}: ${validation}${extraValidation}`;
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
      (v) => `${v.name}: ${this.getDefaultValueStringForTypeNodeMetaData(v)}`
    )
    .join(',\n')}
  };


  export interface ${baseName}Variables {
  ${m.variables
    .map(
      (v) =>
        `${v.name}${v.optional ? '?' : ''}: ${v.tsType}${v.asList ? '[]' : ''}`
    )
    .map((s) => s.trim())
    .join(';\n')}
  }
  export interface Validate${pascalCase(
    baseName
  )} extends IGenericFormValidationResult {
  ${m.variables
    .map((n) => this.generateValidation(n))
    .map((s) => s.trim())
    .join(';\n')}
  }

  type ${baseName}Props = React.DetailedHTMLProps<
  React.FormHTMLAttributes<HTMLFormElement>,
  HTMLFormElement
  > & {
    initialValues?: Partial<${baseName}Variables>,
    validate?: (value: Partial<${baseName}Variables>) => Validate${pascalCase(
          baseName
        )},
    onSubmit: (values: ${baseName}Variables)=> any,
  }
  export const _${baseName} = ({
    initialValues = ${camelCase(m.name + 'DefaultValues')},
    onSubmit,
    validate,
    ...formProps}: ${baseName}Props) => {
    const [value, setValue]= React.useState(initialValues || {})
    const [validationResults, setValidationResults] = React.useState(() => validate ? validate(initialValues) : {} as Validate${pascalCase(
      baseName
    )})
    ${this.cc.form.init}
    ${this.cc.submitButton.init}
    return (
        <${this.cc.form.tagName} scalar="" name="" depth={0} onSubmit={(e) => {
          e?.preventDefault?.()
          onSubmit(value as any)
        }} {...formProps} path="">
          ${m.variables
            .map((v) =>
              this.renderComponentFor(v, {
                value: `value?.${v.name}`,
                label: JSON.stringify(sentenceCase(v.name)),
                parentPath: JSON.stringify('root'), //JSON.stringify(v.name),
                depth: '0',
                error: `typeof validationResults === 'string'? undefined:validationResults[${JSON.stringify(
                  v.name
                )}]`,
                onChange: `(value) => {
                  setValue(oldVal => {
                    const newValue = ({...oldVal, ['${v.name}']: value})
                    if(validate)
                      setValidationResults(validate(newValue))
                    return newValue
                  })
                }`,
                ...this.asPropString(v),
              })
            )
            .join('\n    ')}
          <${
            this.cc.submitButton.tagName
          } isValid={isValidFromFormResult(validationResults)} text="submit" />
        </${this.cc.form.tagName}>
    )
  }
  export const ${baseName} = (
    {customComponents = _emptyFormContext, ...props}: ${baseName}Props & {customComponents?: Partial<GQLReactFormContext>}) => {
    return (
      <InternalGQLReactFormContext.Provider value={customComponents}>
        <_${baseName} {...props} />
      </InternalGQLReactFormContext.Provider>
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
 * Validation Types
 * *******************/
  ${Object.entries(this.reusableValidations)
    .map(([name, entry]) => `export type ${name} = ${entry}`)
    .join('\n')}
/**********************
 * Scalar Form Fragments
 * *******************/
  ${this.scalarComponents()}
/***************************
* forms Forms
* *************************/
  ${this.forms}
`;
  }
}
