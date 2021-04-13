import {
  Types,
  PluginValidateFn,
  PluginFunction,
} from '@graphql-codegen/plugin-helpers';
import {
  visit,
  GraphQLSchema,
  concatAST,
  Kind,
  FragmentDefinitionNode,
} from 'graphql';
import { LoadedFragment } from '@graphql-codegen/visitor-plugin-common';
import { ReactFormikVisitor } from './visitor';
import { ReactFormikRawPluginConfig } from './config';
import { extname } from 'path';

export const plugin: PluginFunction<
  ReactFormikRawPluginConfig,
  Types.ComplexPluginOutput
> = (
  schema: GraphQLSchema,
  documents: Types.DocumentFile[],
  config: ReactFormikRawPluginConfig
) => {
  const allAst = concatAST(documents.map(v => v.document as any));

  const allFragments: LoadedFragment[] = [
    ...(allAst.definitions.filter(
      d => d.kind === Kind.FRAGMENT_DEFINITION
    ) as FragmentDefinitionNode[]).map(fragmentDef => ({
      node: fragmentDef,
      name: fragmentDef.name.value,
      onType: fragmentDef.typeCondition.name.value,
      isExternal: false,
    })),
    ...(config.externalFragments || []),
  ];

  const visitor = new ReactFormikVisitor(
    schema,
    allFragments,
    config,
    documents
  );

  visit(allAst, { leave: visitor });

  return {
    prepend: visitor.formikImports(),
    content: [visitor.sdkContent].join('\n'),
  };
};

export const validate: PluginValidateFn<any> = async (
  _schema: GraphQLSchema,
  _documents: Types.DocumentFile[],
  _config: ReactFormikRawPluginConfig,
  outputFile: string
) => {
  if (extname(outputFile) !== '.tsx') {
    throw new Error(
      `Plugin "typescript-react-formik" requires extension to be ".tsx"`
    );
  }
};

export { ReactFormikVisitor as ReactApolloVisitor };
