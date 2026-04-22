<script lang="ts">
  import { onMount } from 'svelte';
  import Katex from '$lib/components/Katex.svelte';
  import { quizzes, pages } from '$lib/data/latex';

  interface Props {
    onProgramChange?: (prog: string) => void;
    onClose?: () => void;
  }

  let { onProgramChange, onClose }: Props = $props();

  let page = $state(initPage());

  function initPage() {
    if (typeof window === 'undefined') return 0;
    const saved = localStorage.getItem('guide-current-page');
    const p = Number(saved);
    return (saved !== null && Number.isInteger(p) && p >= 0 && p < pages.length) ? p : 0;
  }

  $effect(() => {
    localStorage.setItem('guide-current-page', String(page));
  });

  const prevPage = () => { page = (page - 1 + pages.length) % pages.length; };
  const nextPage = () => { page = (page + 1) % pages.length; };

  const getQuizByPage = (page: number) => {
    const quizMap: Record<number, string> = {
      9: quizzes.loopQuiz,
      11: quizzes.skipQuiz,
      12: quizzes.assignQuiz,
      13: quizzes.seqQuiz,
      14: quizzes.condQuiz,
    };
    return quizMap[page] ?? ``;
  };

  let container: HTMLElement;
  onMount(() => { container?.focus(); });
</script>

<article 
  class="prose prose-invert max-w-none outline-none" 
  tabindex="-1" 
  bind:this={container}
>
  <div class="flex flex-col min-h-full">
    
    <div class="mb-6 flex items-start justify-between gap-4">
      <div>
        <h1 class="m-0 text-2xl font-bold leading-tight sm:text-3xl">
          {pages[page].title}
        </h1>
      </div>
      <div class="flex-shrink-0 font-mono text-sm text-slate-400">
        Page {page + 1} / {pages.length}
      </div>
    </div>

    <div class="flex-1">
      <Katex math={pages[page].math} displayMode={true} />
    </div>

    <div class="mt-auto flex flex-col gap-6 pt-8">
      {#if getQuizByPage(page) != `` && onProgramChange}
        <button
          class="w-fit rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 active:scale-95"
          type="button"
          onclick={() => {
            onProgramChange(getQuizByPage(page));
            onClose?.();
          }}
        >
          Try
        </button>
      {/if}

      <div class="flex items-center justify-between border-t border-slate-700/50 pt-6">
        <div class="flex gap-3">
          <button
            class="rounded-md bg-slate-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-30"
            type="button"
            onclick={prevPage}
          >
            Previous
          </button>
          <button
            class="rounded-md bg-slate-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-30"
            type="button"
            onclick={nextPage}
          >
            Next
          </button>
        </div>
        
        <button 
          class="text-sm font-medium text-slate-400 transition hover:text-white"
          onclick={onClose}
        >
          Close Guide
        </button>
      </div>
    </div>
  </div>
</article>