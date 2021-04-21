import { pascalCase } from 'change-case-all';
import { ReactFormsRawPluginConfig } from './config';

export class ComponentComposer {
  constructor(protected rawConfig: ReactFormsRawPluginConfig) {}

  private lookupComponent(name: string) {
    const tagName = `${pascalCase(name)}Component`;
    return {
      init: `const ${tagName} = ctx.${name} || defaultReactFormContext.${name}`,
      render: (props: { [key: string]: string }, children: string) => {
        return `<${tagName} ${Object.entries(props)
          .map(([key, val]) => `${key}={${val}}`)
          .join(' ')} path={path}>
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
    return this.lookupComponent('form');
  }
  get submitButton() {
    return this.lookupComponent('submitButton');
  }
  get div() {
    return this.lookupComponent('div');
  }
  get listItem() {
    return this.lookupComponent('listItem');
  }
  get button() {
    return this.lookupComponent('button');
  }
  get label() {
    return this.lookupComponent('label');
  }
  get listWrapper() {
    return this.lookupComponent('listWrapper');
  }
  get labelTextWrapper() {
    return this.lookupComponent('labelTextWrapper');
  }
  private generatePassthroughComponent(
    name: string,
    componentType = name,
    extra = ''
  ) {
    return `${name}: ({...props}: StandardProps) => <${componentType} {...props} ${extra}/>`;
  }
  public generateContext(typeComponentMap: { [key: string]: any }) {
    return `
      interface StandardProps {
        onClick?: () => any
        children?: React.ReactNode
        path: string
        id?: string
        className?: string
      }
      interface ReactOnChangeHandler<T> extends React.FC<{onChange: (value: T) => T, value?: T, label: string } & StandardProps> {}
      export const defaultReactFormContext = {
        form: 'form' as any as React.FunctionComponent<{onSubmit: (e?: {preventDefault?: () => any}) => any}>,
        ${this.generatePassthroughComponent('div')},
        ${this.generatePassthroughComponent('label')},
        ${this.generatePassthroughComponent('labelTextWrapper', 'h4')},
        ${this.generatePassthroughComponent(
          'button',
          'button',
          'onClick={e => {e.preventDefault(); props.onClick?.()}}'
        )},
        ${this.generatePassthroughComponent('listWrapper', 'ol')},
        ${this.generatePassthroughComponent('listItem', 'li')},
        submitButton: ((props) => <input type="submit" {...props} value={props.text} /> )as React.FunctionComponent<{text: string}>,
        input: ((props) => {
          const {path} = props
          ${this.initContext}
          ${this.div.init}
          const typeofValue = typeof props.value
            return (
            ${this.div.render(
              {},
              `
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
            `
            )})

          }) as ReactOnChangeHandler<string|number|Date>,
        ${Object.keys(typeComponentMap)
          .filter((name) => !name.match(/AsList$/))
          .map(
            (scalarName) => `get ${scalarName.replace(/FormInput$/, '')}() {
            return ${scalarName}
          }`
          )
          .join(',\n')}
      }
      export const GQLReactFormContext = React.createContext<Partial<typeof defaultReactFormContext>>(defaultReactFormContext)

    `;
  }
}
