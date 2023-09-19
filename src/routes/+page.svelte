<script>
  import { onMount } from 'svelte';
  import { dataStore } from './dataStore.js';
  import spec1 from './spec1.json';

  let container;


  let database;
  let jsonArray;

  onMount(async () => {
    // Subscribe to the store and access the database value
    const unsubscribe = dataStore.subscribe(value => {
      database = value;
      if (database.exec !== undefined) {
        const result = database.exec(
            `SELECT date, distance, run_time, 
            STRFTIME('%H', run_time) * 3600 + STRFTIME('%M', run_time) * 60 + STRFTIME('%S', run_time) AS duration_in_seconds,
            (1.0 * (STRFTIME('%H', run_time) * 3600 + STRFTIME('%M', run_time) * 60 + STRFTIME('%S', run_time)) / distance / 60) AS speed,
            comments
            FROM hardlooptijden;`);
        console.log(result);

        // Get the column names from the result
        const columns = result[0].columns;

        // Get the rows from the result
        const rows = result[0].values;

        // Convert rows to array of JSON objects
        jsonArray = rows.map(row => {
          const obj = {};
          columns.forEach((column, index) => {
            obj[column] = row[index];
          });
          return obj;
        });

        console.log(jsonArray);

        const chartSpec = spec1;
        spec1.layer[0].data.values = jsonArray;
        vegaEmbed(container, chartSpec, { actions: false });
      }
    });


    // Clean up the subscription when the component is destroyed
    return () => {
      unsubscribe();
    };

  });
</script>

<div bind:this={container}></div>

<style>
  div {
    margin: 1rem;
    border: 1px solid #ddd;
  }
</style>
