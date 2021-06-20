export const validationFNSource = `
export interface IGenericFormValidationResult {
  __meta?:string;
  [key: string]:
    | undefined
    | string
    | IGenericFormValidationResult
    | (IGenericFormValidationResult | string)[];
}
export const isValidFromFormResult = (
  obj: IGenericFormValidationResult
): boolean => {
  return Object.values(obj).reduce((isValid: boolean, val) => {
    if (!isValid) return false;
    if (val === undefined) return true;
    if (typeof val === 'string') return val.length === 0;
    if (Array.isArray(val))
      return (
        val.find((nestedVal) =>
          typeof nestedVal === 'string'
            ? nestedVal
            : !isValidFromFormResult(nestedVal)
        ) === undefined
      );
    return isValidFromFormResult(val);
  }, true);
};
`;
