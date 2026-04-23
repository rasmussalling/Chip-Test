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
      4: quizzes.loopQuiz,
      7: quizzes.skipQuiz,
      8: quizzes.assignQuiz,
      9: quizzes.seqQuiz,
      10: quizzes.condQuiz,
    };
    return quizMap[page] ?? ``;
  };

  let container: HTMLElement;
  onMount(() => { container?.focus(); });
</script>

<article 
  class="prose prose-invert w-[700px] h-[70vh] lg:h-[70vh] max-h-[900px] max-w-full outline-none flex flex-col overflow-hidden mx-auto"
  tabindex="-1" 
  bind:this={container}
>
  <header class="mb-2 flex items-start justify-between gap-4 flex-shrink-0">
    <div>
      <h1 class="m-0 text-xl font-bold leading-tight sm:text-2xl">
        {pages[page].title}
      </h1>
    </div>
    <div class="flex-shrink-0 font-mono text-xs text-slate-400">
      Page {page + 1} / {pages.length}
    </div>
  </header>

  <div class="flex-1 overflow-y-auto pr-2 min-h-0 text-base lg:text-[14px]">
    <div class="overflow-x-auto"> 
      <Katex math={pages[page].math} displayMode={true} />
    </div>
  </div>

  <footer class="mt-auto flex flex-col gap-6 pt-8 flex-shrink-0 bg-inherit">
    
    <div class="flex items-center justify-between border-t border-slate-700/50 pt-6 pb-2">
      <div class="flex gap-3">
        <button
          class="rounded-md bg-slate-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-30"
          type="button"
          disabled={page === 0}
          onclick={prevPage}
        >
          Previous
        </button>
        <button
          class="rounded-md bg-slate-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-30"
          type="button"
          disabled={page === pages.length - 1}
          onclick={nextPage}
        >
          Next
        </button>
        <select
          class="rounded bg-slate-900/60 px-3 py-1 text-lg transition hover:bg-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
          bind:value={page}
        >
          {#each pages as p, i}
            <option value={i} class="bg-slate-900">
              {i + 1}. {p.title}
            </option>
          {/each}
        </select>
        {#if getQuizByPage(page) !== "" && onProgramChange}
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
      </div>


      <button 
        class="text-sm font-medium text-slate-400 transition hover:text-white"
        type="button"
        onclick={onClose}
      >
        Close Guide
      </button>
    </div>
  </footer>
</article>