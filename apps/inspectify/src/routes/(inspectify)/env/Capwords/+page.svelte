<script lang="ts">
  import Env from '$lib/components/Env.svelte';
  import StandardInput from '$lib/components/StandardInput.svelte';
  import { Io } from '$lib/io.svelte';

  const io = new Io('Capwords', { text: 'hello world' });
</script>

<Env {io}>
  {#snippet inputView()}
    <StandardInput analysis="Capwords" code="text" {io} />
  {/snippet}
  {#snippet outputView({ output })}
    <div class="grid grid-cols-1">
      <div class="relative">
        <div class="absolute inset-0 flex flex-col border-r">
          <h1 class="border-t bg-slate-900 p-2 text-2xl font-light italic">Output</h1>
          {#if output.cap_string}
            <h2 class="p-2 text-lg font-bold italic text-green-400">Result</h2>
            <pre class="overflow-auto rounded-md px-2 text-base">{output.cap_string}</pre>
          {/if}
        </div>
      </div>
      <!-- <div class="relative">
          <div class="absolute inset-0 flex flex-col border-r">
            <h1 class="border-t bg-slate-900 p-2 text-2xl font-light italic">Reference</h1>
            {#if referenceOutput.result}
              <h2 class="p-2 text-lg font-bold italic text-green-400">Result</h2>
              <pre class="overflow-auto rounded-md px-2 text-base">{referenceOutput.result}</pre>
            {:else if referenceOutput.error}
              <h2 class="p-2 text-lg font-bold italic text-orange-400">Evaluation error</h2>
              <pre class="overflow-auto rounded-md px-2 text-base">{referenceOutput.error}</pre>
            {/if}
          </div>
        </div> -->
    </div>
  {/snippet}
</Env>
