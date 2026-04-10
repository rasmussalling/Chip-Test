<script lang="ts">
  import { onMount } from 'svelte';
  import Katex from '$lib/components/Katex.svelte';
  import { quizzes, pages } from '$lib/data/latex';

  interface Props {
    onProgramChange?: (prog: string) => void;
    onClose?: () => void;
  }

  let { onProgramChange, onClose }: Props = $props();

  let page = $state(0);
  let container: HTMLElement;

  const prevPage = () => {
    page = (page - 1 + pages.length) % pages.length;
  };

  const nextPage = () => {
    page = (page + 1) % pages.length;
  };

  const getQuizByPage = (page: number) => {
    switch (page) {
      case 1:
        return quizzes.assignQuiz;
      case 2:
        return quizzes.seqQuiz;
      case 3:
        return quizzes.skipQuiz;
      case 5:
        return quizzes.condQuiz;
      case 6:
        return `Check the loop examples in the dropdown in the right corner!`;
      default:
        return `No Quiz for this page`;
    }
  };
  
  onMount(() => {
    container?.focus();
  });
</script>

<article class="prose prose-invert mx-auto" tabindex="-1" bind:this={container}>
  <div class="flex flex-col gap-4">
    <div class="flex items-start justify-between gap-4">
      <div>
        <h1>{pages[page].title}</h1>
      </div>
      <div class="flex items-center gap-2 text-slate-300">
        <span>Page {page + 1} / {pages.length}</span>
      </div>
    </div>

    <Katex math={pages[page].math} displayMode={true} />

    {#if page > 0 && page !== 4 && onProgramChange}
      <div class="pt-4">
        <button
          class="rounded bg-blue-600 px-3 py-2 text-sm text-white transition hover:bg-blue-500"
          type="button"
          onclick={() => {
            onProgramChange(getQuizByPage(page));
            onClose?.();
          }}
        >
          Try
        </button>
      </div>
    {/if}

    <div class="flex flex-wrap items-center justify-between gap-2 pt-4">
      <div class="flex gap-2">
        <button
          class="rounded bg-slate-700 px-3 py-2 text-sm text-white transition hover:bg-slate-600"
          type="button"
          onclick={prevPage}
        >
          Previous
        </button>
        <button
          class="rounded bg-slate-700 px-3 py-2 text-sm text-white transition hover:bg-slate-600"
          type="button"
          onclick={nextPage}
        >
          Next
        </button>
      </div>
  </div>
</article>
