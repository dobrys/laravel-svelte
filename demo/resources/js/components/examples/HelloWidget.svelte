<svelte:options customElement={{ tag: 'svelte-hello-widget' }} />

<script>
  import { __ } from 'laravel-svelte-elements';
  let count = $state(0);
</script>

<div style="border:2px solid seagreen; padding:1rem; border-radius:8px;">
  <p>{__('Hello from Svelte custom element')}</p>
  <button onclick={() => count++}>clicks: {count}</button>
</div>
