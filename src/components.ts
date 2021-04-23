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
    {
      extra = '',
      propTypes = 'GQLReactFormStandardProps',
    }: { extra?: string; propTypes?: string } = {}
  ) {
    return `${name}: ({...props}: ${propTypes}) => <${componentType} {...props} ${extra}/>`;
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
      export interface GQLReactFormButtonProps extends GQLReactFormStandardProps {
        onClick?: (e?: {preventDefault: () => any}) => any
      }
      interface FormPrimeInput extends React.FC<{onChange: (value: number|string) => number|string, value?: number|string, label: string} & GQLReactFormStandardProps> {}
      export interface GQLFormStandardComponent<T extends GQLReactFormStandardProps = GQLReactFormStandardProps> extends React.FC<T> { }
      export interface GQLReactFormListItemProps extends GQLReactFormStandardProps {
        removeButton: JSX.Element|JSX.Element[]
        insertAboveButton: JSX.Element|JSX.Element[]
        idx: number
      }
      export interface GQLReactFormListWrapperProps extends GQLReactFormStandardProps {
        // idx: number
        totalInList: number
      }

      export interface GQLReactFormContext {
        form: GQLFormStandardComponent< GQLReactFormStandardProps&{onSubmit: (e?: {preventDefault?: () => any}) => any} >,
        div: GQLFormStandardComponent,
        label: GQLFormStandardComponent,
        labelTextWrapper: GQLFormStandardComponent,
        button: GQLFormStandardComponent<GQLReactFormButtonProps>,
        addButton: GQLFormStandardComponent<GQLReactFormButtonProps>,
        removeButton: GQLFormStandardComponent<GQLReactFormButtonProps>,
        listWrapper: GQLFormStandardComponent<GQLReactFormListWrapperProps>,
        listItem: GQLFormStandardComponent<GQLReactFormListItemProps>,
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
        ${this.generatePassthroughComponent('button', 'button', {
          extra: 'onClick={e => {e.preventDefault(); props.onClick?.()}}',
          propTypes: 'GQLReactFormButtonProps',
        })},
        ${this.generatePassthroughComponent('addButton', 'button', {
          extra: 'onClick={e => {e.preventDefault(); props.onClick?.()}}',
          propTypes: 'GQLReactFormButtonProps',
        })},
        ${this.generatePassthroughComponent('removeButton', 'button', {
          extra: 'onClick={e => {e.preventDefault(); props.onClick?.()}}',
          propTypes: 'GQLReactFormButtonProps',
        })},
        ${this.generatePassthroughComponent('listWrapper', 'ol')},
        listItem: (props: GQLReactFormListItemProps) => {
          return (
            <li>
              {props.insertAboveButton}
              {props.removeButton}
              {props.children}
            </li>
          )
        },
        submitButton: ((props: {text: string}) => <input type="submit" {...props} value={props.text} /> ),
        input: ((props) => {
          const {path, scalar, name} = props
          ${this.initContext}
          ${this.div.init}
          ${this.labelTextWrapper.init}
          const typeofValue = typeof props.value
          ${this.label.init}
            return (
            ${this.div.render(
              {},
              `
            ${this.label.render(
              {},
              `
              ${this.labelTextWrapper.render({}, `{props.label}`)}
              <input value={props.value} type={props.value === undefined
                ? "string"
                : typeofValue === 'string'
                ? 'text'
                : typeofValue === 'number'
                ? 'number'
                : ''
              } onChange={(e) =>
                props.onChange(e.target.value)} />
            `
            )}
            `
            )})

          }),

      }
      export const GQLReactFormContext = React.createContext<Partial<GQLReactFormContext>>(defaultReactFormContext)

    `;
  }
}
