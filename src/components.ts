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
          const {path, scalar, name, depth, error} = props
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
              } onChange={(e) =>
                props.onChange(e.target.value)} />
                {error}
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
