<script>
  import { onMount } from 'svelte';
  import { dataStore } from './dataStore.js';

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

        const chartSpec = {
          "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
          "width": 800,
          "height": 600,
          "padding": 5,
          "layer": [{
            "data": {
              "name": "table",
              "values": jsonArray
            },
            "encoding": {
              "x": {
                "field": "date",
                "type": "temporal",
                "axis": {"format": "%Y-%m-%d", "labelAngle": 45}
              },
              "y": {
                "field": "speed",
                "type": "quantitative",
                "axis": {
                  "labelExpr": "datum.value === null ? null : timeFormat(datum.value * 60 * 1000, '%M:%S', 'utc')",
                  "tickMinStep": {"seconds": 1},
                  "scale": {"zero": false}
                }
              }
            },
            "mark": {
              "type": "point",
              "tooltip": {"content": "data"}
            }
          }, {
            "data": {
              "values": [
                {"year": "2015-01-01"},
                {"year": "2016-01-01"},
                {"year": "2017-01-01"},
                {"year": "2018-01-01"},
                {"year": "2019-01-01"},
                {"year": "2020-01-01"},
                {"year": "2021-01-01"},
                {"year": "2022-01-01"},
                {"year": "2023-01-01"},
                {"year": "2024-01-01"}
              ]
            },
            "mark": {"type": "rule", "color": "black", "size": 2},
            "encoding": {
              "x": {"field": "year", "type": "temporal", "axis": {}},
              "y": {"value": 0}
            }
          }]
        };
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
