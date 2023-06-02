import { writable } from 'svelte/store';
import initSqlJs from 'sql.js/dist/sql-wasm';

export const dataStore = writable([]);

initSqlJs().then(SQL => {
  const db = new SQL.Database();

  // Fetch the data from PostgREST table
  fetch('http://localhost:5530/hardlooptijden')
    .then(response => response.json())
    .then(data => {

      // Create database schema and tables
      db.exec('CREATE TABLE IF NOT EXISTS hardlooptijden (date date, distance numeric, run_time time without time zone)');

      // Insert data into the in-memory database
      data.forEach(record => {
        const { date, distance, run_time } = record;
        db.exec(`INSERT INTO hardlooptijden VALUES ('${date}', '${distance}', '${run_time}')`);
      });

      // Update the store with the populated in-memory database
      dataStore.set(db);
    });
});
