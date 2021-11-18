import faunadb from 'faunadb';
import faunaClient from './fauna-client.mjs';
const fql = faunadb.query;

const userData = [
  { firstName: 'Jean-Pierre', lastName: 'Martin', email: 'jeanpierre.martin@test.com' },
  { firstName: 'Marie-Madeleine', lastName: 'Michel', email: 'mariemadeleine.michel@test.com' },
  { firstName: 'Charles-Henri', lastName: 'Lefevre', email: 'charleshenri.lefevre@test.com' },
];

// This script migrates the database schema to the database server
const run = async () => {
  // Establish connection with database
  console.info('Connecting to database...');
    
  console.info('Migrating schema...')
  await faunaClient.query(
    fql.If(
      fql.Exists(
        fql.Collection('User')
      ),
      null,
      fql.CreateCollection({ name: 'User' })
    )
  );

  await faunaClient.query(
    fql.If(
      fql.Exists(
        fql.Index('all_users')
      ),
      null,
      fql.CreateIndex({
        name: 'all_users',
        source: fql.Collection('User')
      })  
    )
  );

  for (let data of userData) {
    await faunaClient.query(
      fql.Create(
        fql.Collection('User'),
        {
          data
        }
      )
    )
  }
}

// Run main process
run().catch((err) => {
  console.error(err);
  process.exit(1);
});
