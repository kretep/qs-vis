import { writable } from 'svelte/store';

// Create a writable Svelte store
const aggregatedData = writable(null);

async function calculateAggregation() {
  const endpointUrl = 'http://localhost:5530/aggregate_by_period';
  const requestBody = {
    table: 'hardlooptijden',
    date_column: 'date',
    agg_column: 'distance',
    aggregation_type: 'sum',
    period: 'week'
  };

  try {
    const response = await fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error('Request failed');
    }

    const data = await response.json();

    // Update the store with the response data
    aggregatedData.set(data);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

export { aggregatedData, calculateAggregation };