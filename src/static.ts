export const validationFNSource = `
export interface IGenericFormValidationResult {
  [key: string]:
    | string
    | IGenericFormValidationResult
    | IGenericFormValidationResult[];
}
export const isValidFromFormResult = (
  obj: IGenericFormValidationResult
): boolean => {
  console.log('validating',  obj)
  const result = Object.values(obj).reduce((isValid: boolean, val) => {
    if (!isValid) return false;
    if (typeof val === 'string') return val.length === 0;
    if (Array.isArray(val))
      return (
        val.find((nestedVal) => !isValidFromFormResult(nestedVal)) === undefined
      );
    return isValidFromFormResult(val);
  }, true);
  console.log('result', result)
  return result
};
`;
