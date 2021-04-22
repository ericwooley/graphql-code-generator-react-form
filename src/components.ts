import { pascalCase } from 'change-case-all';
import { ReactFormsRawPluginConfig } from './config';

export class ComponentComposer {
  constructor(protected rawConfig: ReactFormsRawPluginConfig) {}

  private generateComponent(name: string) {
    const tagName = `${pascalCase(name)}Component`;
    return {
      init: `const ${tagName} = ctx.${name} || defaultReactFormContext.${name}`,
      render: (props: { [key: string]: string }, children: string) => {
        return `<${tagName} ${Object.entries(props)
          .map(([key, val]) => `${key}={${val}}`)
          .join(' ')} path={path} scalar={scalar} name={name}>
          ${children}
          </${tagName}>`;
      },
      tagName,
    };
  }
  get initContext() {
    return `const ctx = React.useContext(GQLReactFormContext)`;
  }
  get form() {
    return this.generateComponent('form');
  }
  get submitButton() {
    return this.generateComponent('submitButton');
  }
  get div() {
    return this.generateComponent('div');
  }
  get listItem() {
    return this.generateComponent('listItem');
  }
  get button() {
    return this.generateComponent('button');
  }
  get label() {
    return this.generateComponent('label');
  }
  get listWrapper() {
    return this.generateComponent('listWrapper');
  }
  get labelTextWrapper() {
    return this.generateComponent('labelTextWrapper');
  }
  get input() {
    return this.generateComponent('input');
  }
  get addButton() {
    return this.generateComponent('addButton');
  }
  get removeButton() {
    return this.generateComponent('removeButton');
  }
  private generatePassthroughComponent(
    name: string,
    componentType = name,
    extra = '',
    extraPropTypes: string = ''
  ) {
    return `${name}: ({...props}: ${[
      'GQLReactFormStandardProps',
      extraPropTypes,
    ]
      .filter((i) => i)
      .join(' & ')}) => <${componentType} {...props} ${extra}/>`;
  }
  public generateContext(typeComponentMap: { [key: string]: any }) {
    const dynamicComponentTypeList = Object.keys(typeComponentMap)
      .filter(
        (name) =>
          ![
            'StringFormInput',
            'IntFormInput',
            'FloatFormInput',
            'BooleanFormInput',
            'IDFormInput',
          ].includes(name)
      )
      .filter((name) => !name.match(/AsList$/));
    return `
      export interface GQLReactFormStandardProps {
        children?: React.ReactNode
        path: string
        id?: string
        className?: string
        name: string
        scalar: string
      }
      interface FormPrimeInput extends React.FC<{onChange: (value: number|string) => number|string, value?: number|string, label: string} & GQLReactFormStandardProps> {}
      interface GQLFormStandardComponent<T = {}> extends React.FC<GQLReactFormStandardProps & T> { }
      export interface GQLReactFormContext {
        form: GQLFormStandardComponent< {onSubmit: (e?: {preventDefault?: () => any}) => any} >,
        div: GQLFormStandardComponent,
        label: GQLFormStandardComponent,
        labelTextWrapper: GQLFormStandardComponent,
        button: GQLFormStandardComponent<{onClick?: (e?: {preventDefault?: () => any}) => any }>,
        addButton: GQLFormStandardComponent<{onClick?: (e?: {preventDefault?: () => any}) => any }>,
        removeButton: GQLFormStandardComponent<{onClick?: (e?: {preventDefault?: () => any}) => any }>,
        listWrapper: GQLFormStandardComponent,
        listItem: GQLFormStandardComponent,
        submitButton: React.FC<{text: string}>
        input: FormPrimeInput,
        ${dynamicComponentTypeList
          .map(
            (scalarName) =>
              `${scalarName.replace(
                /FormInput$/,
                ''
              )}?: React.FC<${scalarName}PropTypes> `
          )
          .join(',\n')}
      }
      export const defaultReactFormContext: GQLReactFormContext = {
        form: 'form' as any,
        ${this.generatePassthroughComponent('div')},
        ${this.generatePassthroughComponent('label')},
        ${this.generatePassthroughComponent('labelTextWrapper', 'h4')},
        ${this.generatePassthroughComponent(
          'button',
          'button',
          'onClick={e => {e.preventDefault(); props.onClick?.()}}',
          '{onClick?: (e?: {preventDefault: () => any}) => any}'
        )},
        ${this.generatePassthroughComponent(
          'addButton',
          'button',
          'onClick={e => {e.preventDefault(); props.onClick?.()}}',
          '{onClick?: (e?: {preventDefault: () => any}) => any}'
        )},
        ${this.generatePassthroughComponent(
          'removeButton',
          'button',
          'onClick={e => {e.preventDefault(); props.onClick?.()}}',
          '{onClick?: (e?: {preventDefault: () => any}) => any}'
        )},
        ${this.generatePassthroughComponent('listWrapper', 'ol')},
        ${this.generatePassthroughComponent('listItem', 'li')},
        submitButton: ((props: {text: string}) => <input type="submit" {...props} value={props.text} /> ),
        input: ((props) => {
          const {path, scalar, name} = props
          ${this.initContext}
          ${this.div.init}
          const typeofValue = typeof props.value
            return (
            ${this.div.render(
              {},
              `
            <label>
              <strong>{props.label}</strong><br />
              <input value={props.value} type={props.value === undefined
                ? "string"
                : typeofValue === 'string'
                ? 'text'
                : typeofValue === 'number'
                ? 'number'
                : ''
              } onChange={(e) =>
                props.onChange(e.target.value)} />
            </label>
            `
            )})

          }),

      }
      export const GQLReactFormContext = React.createContext<Partial<GQLReactFormContext>>(defaultReactFormContext)

    `;
  }
}
