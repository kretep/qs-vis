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
      db.exec('CREATE TABLE IF NOT EXISTS hardlooptijden (date date, distance numeric, run_time time without time zone, comments text)');

      // Insert data into the in-memory database
      const stmt = db.prepare(`INSERT INTO hardlooptijden VALUES (?, ?, ?, ?)`);
      data.forEach(record => {
        const { date, distance, run_time, comments } = record;
        stmt.run([date, distance, run_time, comments]);
      });
      stmt.free();

      // Update the store with the populated in-memory database
      dataStore.set(db);
    });
});
