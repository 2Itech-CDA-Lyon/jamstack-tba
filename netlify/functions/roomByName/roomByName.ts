import { Handler } from "@netlify/functions";
import faunaClient from "../../../scripts/fauna-client";
import { Room } from "../../../src/types/api";
import { query as fql } from 'faunadb';

export const handler: Handler = async (event, context) => {
  // Test whether the requested URL has the correct syntax
  const match = event.path.match(/^\/\.netlify\/functions\/[^\/]+\/([^\/]+)$/);
  if (match === null) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Invalid URI syntax. Expected URI syntax is: \/roomByName\/{room_name}.'
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }
  }

  // Extract the requested room name from the URI
  const name = match[1];

  // Find all rooms matching the requested name in the database
  const result: { data: Room[] } = await faunaClient.query(
    fql.Map(
      fql.Paginate(
        fql.Match(
          fql.Index('room_by_name'),
          name
        )
      ),
      fql.Lambda('ref', fql.Get(fql.Var('ref')))
    )
  );

  // If the list of rooms is empty, this means no room has the requested name
  if (result.data.length === 0) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: `No room with the name '${name}' exists.`
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }
  }

  // Otherwise, return the room-s data
  return {
    statusCode: 200,
    body: JSON.stringify(result.data[0]),
    headers: {
      'Content-Type': 'application/json'
    }
  }
}
