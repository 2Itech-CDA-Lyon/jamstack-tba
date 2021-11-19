import faunadb from 'faunadb';
import faunaClient from './fauna-client.mjs';
const fql = faunadb.query;

const collections = [
  { name: 'Room', allIndexName: 'all_rooms' },
  { name: 'Direction', allIndexName: 'all_directions' },
  { name: 'RoomConnection', allIndexName: 'all_room_connections' },
];

const createDocument = (collectionName, data) =>
  faunaClient.query(
    fql.Create(
      fql.Collection(collectionName),
      {
        data
      }
    )
  );

const run = async () => {
  console.info('Purging collections...');
  for (let collection of collections) {
    await faunaClient.query(
      fql.Map(
        fql.Paginate(
          fql.Match(
            fql.Index(collection.allIndexName)
          )
        ),
        fql.Lambda(
          'document_ref',
          fql.Delete(
            fql.Var('document_ref')
          )
        )
      )
    )
  }

  console.info('Creating rooms...');
  const bedroom = await createDocument('Room', { name: 'bedroom', description: 'This is where you usually sleep.' });
  const bathroom = await createDocument('Room', { name: 'bathroom', description: 'This is where you usually wash.' });
  const kitchen = await createDocument('Room', { name: 'kitchen', description: 'This is where you usually eat.' });
  
  console.info('Creating directions...');
  const east = await createDocument('Direction', { name: 'East', command: 'east' });
  const south = await createDocument('Direction', { name: 'South', command: 'south' });
  const west = await createDocument('Direction', { name: 'West', command: 'west' });
  const north = await createDocument('Direction', { name: 'North', command: 'north' });

  console.info('Creating room connections...');
  await createDocument('RoomConnection', {
    fromRoom: bedroom.ref,
    toRoom: bathroom.ref,
    direction: east.ref,
  })
  await createDocument('RoomConnection', {
    fromRoom: bathroom.ref,
    toRoom: bedroom.ref,
    direction: west.ref,
  })
  await createDocument('RoomConnection', {
    fromRoom: bedroom.ref,
    toRoom: kitchen.ref,
    direction: north.ref,
  })
  await createDocument('RoomConnection', {
    fromRoom: kitchen.ref,
    toRoom: bedroom.ref,
    direction: south.ref,
  })
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
