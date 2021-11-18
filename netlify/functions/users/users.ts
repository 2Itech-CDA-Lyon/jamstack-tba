import { Handler } from '@netlify/functions'
import faunaClient from '../../../scripts/fauna-client';
import { query as fql } from 'faunadb';
import { User } from '../../../src/types/api';

export const handler: Handler = async (event, context) => {
  const allUsers: { data: User[] } = await faunaClient.query(
    fql.Map(
      fql.Paginate(
        fql.Match(
          fql.Index('all_users')
        )
      ),
      fql.Lambda('user_ref', fql.Get(fql.Var('user_ref')))
    )
  );

  return {
    statusCode: 200,
    body: JSON.stringify(allUsers.data),
    headers: {
      'Content-Type': 'application/json'
    }
  }
}
