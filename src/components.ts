import { ReactFormsRawPluginConfig } from './config';

export class ComponentComposer {
  constructor(protected rawConfig: ReactFormsRawPluginConfig) {}
  get initFormComponentStr() {
    return `const FormComponent = ctx.form || defaultReactFormContext.form`;
  }
  get formComponent() {
    return `FormComponent`;
  }
  get initSubmitButtonStr() {
    return `const SubmitButton = ctx.submitButton || defaultReactFormContext.submitButton`;
  }
  get submitButton() {
    return `SubmitButton`;
  }
  public generateContext(typeComponentMap: { [key: string]: any }) {
    return `
      interface ReactOnChangeHandler<T> extends React.FC<{onChange: (value: T) => T, value?: T, label: string }> {}
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
