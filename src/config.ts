import { RawClientSideBasePluginConfig } from '@graphql-codegen/visitor-plugin-common';

/**
 * @description This plugin generates React Formik forms.
 *
 * It extends the basic TypeScript plugins: `@graphql-codegen/typescript`, `@graphql-codegen/typescript-operations` - and thus shares a similar configuration.
 */
export interface ReactFormikRawPluginConfig extends RawClientSideBasePluginConfig {}
