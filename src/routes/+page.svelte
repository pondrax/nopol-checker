<script lang="ts">
  import { enhance } from "$app/forms";
  import type { PageData, ActionData } from "./$types";
  export let data: PageData;
  export let form: ActionData;

  let loading = false;
</script>

<svelte:head>
  <title>Nopol Checker</title>
</svelte:head>

<div>
  <h1>Nopol Checker</h1>
  <hr />
  <form
    use:enhance
    method="post"
    on:submit={() => (loading = true)}
    on:reset={() => (loading = false)}
  >
    <input
      name="nopol"
      placeholder="Tulis Nomor Kendaraan"
      bind:value={data.nopol}
    />
    {#if loading}
      <button disabled>Loading...</button>
    {:else}
      <button>Check</button>
    {/if}
  </form>
  {#if form}
    <pre>{JSON.stringify(form, null, 2)}</pre>
  {/if}

  <pre>
[USAGE]
curl '{data.origin}/api?nopol={data.nopol}'
  </pre>
</div>
