import { pascalCase } from 'change-case-all';
import { ReactFormsRawPluginConfig } from './config';

export class ComponentComposer {
  constructor(protected rawConfig: ReactFormsRawPluginConfig) {}

  private generateComponentRenderer(name: string) {
    const tagName = `${pascalCase(name)}Component`;
    return {
      init: `const ${tagName} = useCustomizedComponent(${JSON.stringify(
        name
      )})`,
      render: (props: { [key: string]: string }, children: string) => {
        return `<${tagName} ${Object.entries(props)
          .map(([key, val]) => `${key}={${val}}`)
          .join(' ')} path={path} scalar={scalar} name={name} ${
          props.depth ? '' : 'depth={depth}'
        }>
          ${children}
          </${tagName}>`;
      },
      tagName,
    };
  }
  get error() {
    return this.generateComponentRenderer('error');
  }
  get form() {
    return this.generateComponentRenderer('form');
  }
  get submitButton() {
    return this.generateComponentRenderer('submitButton');
  }
  get div() {
    return this.generateComponentRenderer('div');
  }
  get listItem() {
    return this.generateComponentRenderer('listItem');
  }
  get button() {
    return this.generateComponentRenderer('button');
  }
  get label() {
    return this.generateComponentRenderer('label');
  }
  get listWrapper() {
    return this.generateComponentRenderer('listWrapper');
  }
  get scalarWrapper() {
    return this.generateComponentRenderer('scalarWrapper');
  }
  get labelTextWrapper() {
    return this.generateComponentRenderer('labelTextWrapper');
  }
  get input() {
    return this.generateComponentRenderer('input');
  }
  get addButton() {
    return this.generateComponentRenderer('addButton');
  }
  get removeButton() {
    return this.generateComponentRenderer('removeButton');
  }
  private generatePassthroughComponent(
    name: string,
    componentType = name,
    {
      extra = '',
      propTypes = 'GQLReactFormStandardProps',
    }: { extra?: string; propTypes?: string } = {}
  ) {
    return `${name}: (props: ${propTypes}) => <${componentType} {...props} ${extra}/>`;
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
        /**
         * path of properties to get to this item, separated by a dot
         * @example
         * // path = 'UserInput.friends.id'
         * const childOfUser = Boolean(path.split('.').includes('UserInput'))
         **/
        path: string
        id?: string
        /**
         * Number of Scalar Objects deep this property is
         **/
        depth: number,
        className?: string
        name: string
        scalar: string
      }
      export interface GQLReactFormButtonProps extends GQLReactFormStandardProps {
        onClick?: (e?: {preventDefault: () => any}) => any
      }
      interface FormPrimeInput extends React.FC<{onChange: (value: number|string) => number|string, value?: number|string, label: string, onBlur: () => unknown, touched: boolean, error?:string} & GQLReactFormStandardProps> {}
      export interface GQLFormStandardComponent<T extends GQLReactFormStandardProps = GQLReactFormStandardProps> extends React.FC<T> { }
      export interface GQLReactFormListItemProps extends GQLReactFormStandardProps {
        removeButton: JSX.Element|JSX.Element[]
        insertAboveButton: JSX.Element|JSX.Element[]
        idx: number
      }
      export interface GQLReactFormListWrapperProps extends GQLReactFormStandardProps {
        totalInList: number
        error?: string
        touched: boolean
      }

      export interface GQLReactFormScalarWrapperProps extends GQLReactFormStandardProps {
        error?: string
        touched: boolean,
        label: string
      }

      export interface GQLReactFormContext {
        form: GQLFormStandardComponent< GQLReactFormStandardProps&{onSubmit: (e?: {preventDefault?: () => any}) => any} >,
        div: GQLFormStandardComponent,
        error: GQLFormStandardComponent,
        label: GQLFormStandardComponent,
        labelTextWrapper: GQLFormStandardComponent,
        button: GQLFormStandardComponent<GQLReactFormButtonProps>,
        addButton: GQLFormStandardComponent<GQLReactFormButtonProps>,
        removeButton: GQLFormStandardComponent<GQLReactFormButtonProps>,
        listWrapper: GQLFormStandardComponent<GQLReactFormListWrapperProps>,
        scalarWrapper: GQLFormStandardComponent<GQLReactFormScalarWrapperProps>,
        listItem: GQLFormStandardComponent<GQLReactFormListItemProps>,
        submitButton: React.FC<{text: string, isValid: boolean}>
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
        ${this.generatePassthroughComponent('error', 'div')},
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
        listWrapper: (props: GQLReactFormListWrapperProps) => {
          ${this.div.init}
          ${this.error.init}
          const {path, name, scalar, depth, ...olProps} = props
          return ${this.div.render(
            {},
            `${this.error.render(
              {},
              `{props.touched && props.error}`
            )}<ol {...olProps}>{props.children}</ol>`
          )}
        },
        scalarWrapper: (props: GQLReactFormScalarWrapperProps) => {
          ${this.div.init}
          ${this.label.init}
          ${this.labelTextWrapper.init}
          ${this.error.init}
          const {path, name, scalar, depth, label} = props
          return ${this.div.render(
            {
              className: JSON.stringify('mutationFormNested'),
            },
            `
            ${this.label.render(
              {},
              this.labelTextWrapper.render({}, `{label}`)
            )}
            ${this.error.render(
              {},
              `{props.touched && props.error}`
            )}{props.children}`
          )}
        },
        listItem: (props: GQLReactFormListItemProps) => {
          return (
            <li>
              {props.insertAboveButton}
              {props.removeButton}
              {props.children}
            </li>
          )
        },
        submitButton: (({text, isValid, ...props}: {text: string, isValid: boolean}) => <input disabled={!isValid} type="submit" {...props} value={text} /> ),
        input: ((props) => {
          const {path, scalar, name, depth, error, touched, onBlur} = props
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
              <><input value={props.value} type={props.value === undefined
                ? "string"
                : typeofValue === 'string'
                ? 'text'
                : typeofValue === 'number'
                ? 'number'
                : ''
              } onBlur={onBlur} onChange={(e) =>
                props.onChange(e.target.value)} />
                {!!error && !!touched && ${this.div.render(
                  {
                    className: JSON.stringify('gql-form-generator-error'),
                  },
                  '{error}'
                )}}
              </>
            `
            )}
            `
            )})

          }),

      }
      export const GQLReactFormContext = React.createContext<Partial<GQLReactFormContext>>(defaultReactFormContext)
      const _emptyFormContext = {};
      export const InternalGQLReactFormContext = React.createContext<Partial<GQLReactFormContext>>(_emptyFormContext)
      function useCustomizedComponent <T extends keyof GQLReactFormContext>(name: T): GQLReactFormContext[T] {
        const ctx = React.useContext(GQLReactFormContext)
        const _ctx = React.useContext(InternalGQLReactFormContext)
        let c: GQLReactFormContext[T] = (_ctx[name] || ctx[name] || defaultReactFormContext[name]) as GQLReactFormContext[T]
        return c
      }

    `;
  }
}
