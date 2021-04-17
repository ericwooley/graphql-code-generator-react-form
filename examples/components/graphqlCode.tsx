import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
export const GraphqlCode: React.FunctionComponent = ({ children }) => {
  return (
    <SyntaxHighlighter
      language="graphql"
      style={dark}
      customStyle={{ backgroundColor: '#002b35', border: 0 }}
    >
      {children}
    </SyntaxHighlighter>
  );
};
