<script lang="ts">
  import Grammar from '$lib/components/Grammar.svelte';
  import Nav from '$lib/components/Nav.svelte';
  import Icon from '~icons/heroicons/book-open';
</script>

<svelte:head>
  <title>Chip – Guide</title>
  <meta name="description" content="Guide" />
</svelte:head>

<Nav title="Guide" {Icon}></Nav>

<div class="py-10">
  <Grammar />
</div>
