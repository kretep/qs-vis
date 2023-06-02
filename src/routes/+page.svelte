<script>
  import { onMount } from 'svelte';
  import { dataStore } from './dataStore.js';

  let database;

  onMount(() => {
    // Subscribe to the store and access the database value
    const unsubscribe = dataStore.subscribe(database => {
      if (database.exec !== undefined) {
        const result = database.exec("SELECT date, distance, run_time FROM hardlooptijden ORDER BY distance DESC;");
        console.log(result);
      }
    });

    // Clean up the subscription when the component is destroyed
    return () => {
      unsubscribe();
    };
  });
</script>
