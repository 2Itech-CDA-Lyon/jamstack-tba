import { Handler } from "@netlify/functions";
import faunaClient from "../../../scripts/fauna-client";
import { Direction, Room } from "../../../src/types/api";
import { query as fql } from 'faunadb';

export const handler: Handler = async (event, context) => {
  // Test whether the requested URL has the correct syntax
  const match = event.path.match(/^\/\.netlify\/functions\/[^\/]+\/(\d+)\/([^\/]+)$/);
  if (match === null) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Invalid URI syntax. Expected URI syntax is: \/room-by-from-room-and-direction-name\/{room_id}\/{command}.'
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }
  }

  // Extract room ID and command from request URI
  const fromRoomId = match[1];
  const command = match[2];

  // Fetch the direction matching the requested command
  const directionResult: { data: Direction[] } = await faunaClient.query(
    fql.Map(
      fql.Paginate(
        fql.Match(
          fql.Index('direction_by_command'),
          command
        )
      ),
      fql.Lambda(
        'ref',
        fql.Get(
          fql.Var('ref')
        )
      )
    )
  )

  // If direction was not found
  if (directionResult.data.length === 0) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: `Command '${command}' does not match any directions.'`
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }
  }

  const direction = directionResult.data[0];

  // Fetch the target room in requested direction when coming from requested room
  const result: { data: Room[] } = await faunaClient.query(
    fql.Map(
      fql.Paginate(
        fql.Match(
          fql.Index('room_connection_by_from_room_and_direction'),
          fql.Ref(
            fql.Collection('Room'),
            fromRoomId
          ),
          direction.ref
        )
      ),
      fql.Lambda(
        'ref',
        fql.Get(
          fql.Select(['data', 'toRoom'], fql.Get(fql.Var('ref')))
        )
      )
    )
  )
  
  // If no rooms match the requested starting room and direction
  if (result.data.length === 0) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: `No room is connected to this room through that direction.'`
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
