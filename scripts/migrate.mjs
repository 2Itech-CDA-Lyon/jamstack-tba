import faunadb from 'faunadb';
import faunaClient from './fauna-client.mjs';
const fql = faunadb.query;

const createCollectionUnlessExists = (name) =>
  faunaClient.query(
    fql.If(
      fql.Exists(
        fql.Collection(name)
      ),
      null,
      fql.CreateCollection({ name })
    )
  );

const createAllIndexUnlessExists = (name, collectionName) =>
  faunaClient.query(
    fql.If(
      fql.Exists(
        fql.Index(name)
      ),
      null,
      fql.CreateIndex({
        name,
        source: fql.Collection(collectionName),
      })
    )
  )

// This script migrates the database schema to the database server
const run = async () => {
  // Establish connection with database
  console.info('Connecting to database...');
    
  console.info('Migrating schema...')
  console.info('Creating Room collection...')
  await createCollectionUnlessExists('Room')
  await createAllIndexUnlessExists('all_rooms', 'Room')

  console.info('Creating Direction collection...')
  await createCollectionUnlessExists('Direction')
  await createAllIndexUnlessExists('all_directions', 'Direction')

  console.info('Creating RoomConnection collection...')
  await createCollectionUnlessExists('RoomConnection')
  await createAllIndexUnlessExists('all_room_connections', 'RoomConnection')

  console.info('Creating room_by_name index...')
  await faunaClient.query(
    fql.If(
      fql.Exists(
        fql.Index('room_by_name')
      ),
      null,
      fql.CreateIndex({
        name: 'room_by_name',
        source: fql.Collection('Room'),
        terms: [
          { field: ['data', 'name'] },
        ],
        unique: true,
      })  
    )
  );

  console.info('Creating direction_by_command index...')
  await faunaClient.query(
    fql.If(
      fql.Exists(
        fql.Index('direction_by_command')
      ),
      null,
      fql.CreateIndex({
        name: 'direction_by_command',
        source: fql.Collection('Direction'),
        terms: [
          { field: ['data', 'command'] },
        ],
        unique: true,
      })  
    )
  );

  console.info('Creating room_connections_by_from_room...')
  await faunaClient.query(
    fql.If(
      fql.Exists(
        fql.Index('room_connections_by_from_room')
      ),
      null,
      fql.CreateIndex({
        name: 'room_connections_by_from_room',
        source: fql.Collection('RoomConnection'),
        terms: [
          { field: ['data', 'fromRoom' ]},
        ],
      })
    )
  )

  console.info('Creating room_connection_by_from_room_and_direction...')
  await faunaClient.query(
    fql.If(
      fql.Exists(
        fql.Index('room_connection_by_from_room_and_direction')
      ),
      null,
      fql.CreateIndex({
        name: 'room_connection_by_from_room_and_direction',
        source: fql.Collection('RoomConnection'),
        terms: [
          { field: ['data', 'fromRoom'] },
          { field: ['data', 'direction'] },
        ],
        unique: true,
      })
    )
  )
}

// Run main process
run().catch((err) => {
  console.error(err);
  process.exit(1);
});
