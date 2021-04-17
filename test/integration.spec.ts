import { validateTs } from './typescript-testing-utils';
import { plugin } from '../src/index';
import { parse, GraphQLSchema, buildSchema } from 'graphql';
import { Types, mergeOutputs } from '@graphql-codegen/plugin-helpers';
import { plugin as tsPlugin } from '@graphql-codegen/typescript';
import { plugin as tsDocumentsPlugin } from '@graphql-codegen/typescript-operations';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('React Apollo', () => {
  let spyConsoleError: jest.SpyInstance;
  beforeEach(() => {
    spyConsoleError = jest.spyOn(console, 'warn');
    spyConsoleError.mockImplementation();
  });

  afterEach(() => {
    spyConsoleError.mockRestore();
  });

  const schema = buildSchema(
    readFileSync(
      join(__dirname, '../examples/schemas/schema.graphql')
    ).toString()
  );
  const basicDoc = parse(/* GraphQL */ `
    query users {
      allUsers {
        id
      }
    }
  `);
  const mutationDoc = parse(/* GraphQL */ `
    mutation addUsers($users: [UserInput]!) {
      addUsers(users: $users) {
        id
      }
    }
  `);

  const validateTypeScript = async (
    output: Types.PluginOutput,
    testSchema: GraphQLSchema,
    documents: Types.DocumentFile[],
    config: any
  ) => {
    const tsOutput = await tsPlugin(testSchema, documents, config, {
      outputFile: '',
    });
    const tsDocumentsOutput = await tsDocumentsPlugin(
      testSchema,
      documents,
      config,
      { outputFile: '' }
    );
    const merged = mergeOutputs([tsOutput, tsDocumentsOutput, output]);
    // process.stdout.write(`\n\n---------- merged \n${merged}\n`);
    validateTs(merged, undefined, true, false, [
      `Cannot find namespace 'Types'.`,
    ]);

    return merged;
  };

  describe('Imports', () => {
    it('should import React and forms dependencies', async () => {
      const docs = [{ location: '', document: basicDoc }];
      const content = (await plugin(
        schema,
        docs,
        {},
        {
          outputFile: 'graphql.tsx',
        }
      )) as Types.ComplexPluginOutput;

      expect(content.prepend).toContain(`import * as React from 'react';`);
      await validateTypeScript(content, schema, docs, {});
    });
  });
  describe('Forms', () => {
    it('should generate a Form', async () => {
      const docs = [{ location: '', document: mutationDoc }];
      const content = (await plugin(
        schema,
        docs,
        {},
        {
          outputFile: 'graphql.tsx',
        }
      )) as Types.ComplexPluginOutput;
      expect(content.content).toMatchSnapshot();
      await validateTypeScript(content, schema, docs, {});
    });
  });
});
