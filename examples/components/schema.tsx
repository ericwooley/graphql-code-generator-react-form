import { Card, CardContent, CardHeader } from '@material-ui/core';
import schemaDoc from '../schemas/schema.graphql';
import { GraphqlCode } from './graphqlCode';
export const Schema = () => {
  return (
    <Card elevation={0} style={{ borderRadius: '0 0 4px 4px' }}>
      <CardHeader title="Graphql Schema" />
      <CardContent>
        <GraphqlCode>{schemaDoc}</GraphqlCode>
      </CardContent>
    </Card>
  );
};
