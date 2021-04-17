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
import { ReactformsVisitor } from './visitor';
import { ReactformsRawPluginConfig } from './config';
import { extname } from 'path';

export const plugin: PluginFunction<
  ReactformsRawPluginConfig,
  Types.ComplexPluginOutput
> = (
  schema: GraphQLSchema,
  documents: Types.DocumentFile[],
  config: ReactformsRawPluginConfig
) => {
  const allAst = concatAST(documents.map((v) => v.document as any));

  const allFragments: LoadedFragment[] = [
    ...(allAst.definitions.filter(
      (d) => d.kind === Kind.FRAGMENT_DEFINITION
    ) as FragmentDefinitionNode[]).map((fragmentDef) => ({
      node: fragmentDef,
      name: fragmentDef.name.value,
      onType: fragmentDef.typeCondition.name.value,
      isExternal: false,
    })),
    ...(config.externalFragments || []),
  ];

  const visitor = new ReactformsVisitor(
    schema,
    allFragments,
    config,
    documents
  );

  visit(allAst, { leave: visitor });

  return {
    prepend: visitor.formsImports(),
    content: [visitor.sdkContent].join('\n'),
  };
};

export const validate: PluginValidateFn<any> = async (
  _schema: GraphQLSchema,
  _documents: Types.DocumentFile[],
  _config: ReactformsRawPluginConfig,
  outputFile: string
) => {
  if (extname(outputFile) !== '.tsx') {
    throw new Error(
      `Plugin "typescript-react-forms" requires extension to be ".tsx"`
    );
  }
};

export { ReactformsVisitor as ReactApolloVisitor };
