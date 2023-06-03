<script>
  import { onMount } from 'svelte';
  import { dataStore } from './dataStore.js';

  let container;

  const chartSpec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "width": 800,
    "height": 600,
    "padding": 5,
    "encoding": {
      "x": {
        "field": "date",
        "type": "temporal",
        "axis": {"format": "%Y-%m-%d", "labelAngle": 45}
      },
      "y": {"field": "speed", "type": "quantitative"}
    },
    "mark": "point"
  };

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
            (3600 * distance / (STRFTIME('%H', run_time) * 3600 + STRFTIME('%M', run_time) * 60 + STRFTIME('%S', run_time))) AS speed
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
        const spec = {
          ...chartSpec, data: {
            "name": "table",
            "values": jsonArray
          }
        };
        console.log(spec);
        vegaEmbed(container, spec, { actions: false });
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
