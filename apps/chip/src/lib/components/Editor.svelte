<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import type * as Monaco from 'monaco-editor/esm/vs/editor/editor.api';
  import type { MarkerData } from 'chip-wasm';
  import { theme } from '$lib/theme';
  import chipDark from '$lib/themes/dark.json';
  import chipLight from '$lib/themes/light.json';
  import type monacoT from '../monaco';

  export let value: string = '';
  export let markers: MarkerData[] = [];
  export let hoveredMarker: number | null = null;
  export let readOnly = false;

  let editor: Monaco.editor.IStandaloneCodeEditor;
  let monaco: typeof Monaco;
  let model: Monaco.editor.ITextModel;
  let editorContainer: HTMLElement;

  let showOverlay = true;
  // We test for "{...} //GENERATED PRECONDITION"
  const PRECONDITION_REGEX = /^\{.*\}\s*\/\/GENERATED PRECONDITION$/i;

  onMount(() => {
    let observer: ResizeObserver | void;
    const run = async () => {
      monaco = (await import('../monaco')).default;
      const { GCL_LANGUAGE_ID } = await import('../langs/gcl');

      monaco.editor.defineTheme('chip-dark', chipDark as any);
      monaco.editor.defineTheme('chip-light', chipLight as any);

      // const { AYU_MIRAGE } = await import('../themes/ayu');

      editor = monaco.editor.create(editorContainer, {
        fontSize: 24,
        minimap: { enabled: false },
        lineNumbers: 'on',
        // theme: AYU_MIRAGE,
        theme: 'chip-dark',
        scrollBeyondLastLine: false,
        language: GCL_LANGUAGE_ID,
        readOnly,
      });
      model = monaco.editor.createModel(value, GCL_LANGUAGE_ID);
      editor.setModel(model);
      model.onDidChangeContent(() => {
        value = model.getValue();
        const lines = value.split('\n');
        const isMatch = PRECONDITION_REGEX.test(lines[0]?.trim());

        showOverlay = isMatch;
      });

      observer = new ResizeObserver(() => editor.layout());
      observer.observe(editorContainer);
    };
    run();
    return () => observer?.disconnect();
  });

  onDestroy(() => {
    monaco?.editor.getModels().forEach((model) => model.dispose());
    editor?.dispose();
  });

  $: if (model && typeof value == 'string' && model.getValue() != value) {
    const lines = value.split('\n');
    const isMatch = PRECONDITION_REGEX.test(lines[0]?.trim());

    showOverlay = isMatch;
    model.setValue(value);
  }

  let decorations: monacoT.editor.IEditorDecorationsCollection | null = null;
  $: if (model) {
    decorations = editor.createDecorationsCollection();
  }
  $: if (model && decorations) {
    const m2 = markers.map((m) => ({
      relatedInformation: m.relatedInformation?.map((r) => ({
        resource: model.uri,
        startLineNumber: r.span.startLineNumber,
        startColumn: r.span.startColumn,
        endLineNumber: r.span.endLineNumber,
        endColumn: r.span.endColumn,
        message: r.message,
      })),
      tags: (m.tags ?? []).map((t) => monaco.MarkerTag[t]),
      severity: monaco.MarkerSeverity[m.severity],
      message: m.message.split('\n')[0],
      startLineNumber: m.span.startLineNumber,
      startColumn: m.span.startColumn,
      endLineNumber: m.span.endLineNumber,
      endColumn: m.span.endColumn,
    }));
    monaco.editor.setModelMarkers(model, 'gcl', m2);
    decorations.set(
      markers.map((m) => ({
        options: {
          hoverMessage: {
            value: m.message.split('\n').slice(1).join('\n'),
            supportHtml: true,
            isTrusted: true,
          },
        },
        range: {
          startLineNumber: m.span.startLineNumber,
          startColumn: m.span.startColumn,
          endLineNumber: m.span.endLineNumber,
          endColumn: m.span.endColumn,
        },
      })),
    );
  }
  $: if (editor) {
    editor.updateOptions({ theme: $theme == 'dark' ? 'chip-dark' : 'chip-light' });
  }
  $: if (editor) {
    monaco.languages.registerHoverProvider('gcl', {
      provideHover(model, position, token) {
        const found = markers.findIndex((marker) => {
          const { column, lineNumber } = position;
          // check if positions is within the marker
          if (
            marker.span.startLineNumber <= lineNumber &&
            marker.span.endLineNumber >= lineNumber
          ) {
            if (marker.span.startColumn <= column && marker.span.endColumn >= column) {
              return true;
            }
          }
        });
        if (found >= 0) {
          hoveredMarker = found;
          const i = setInterval(() => {
            if (hoveredMarker != found) {
              clearInterval(i);
              return;
            }
            if (token.isCancellationRequested) {
              hoveredMarker = null;
              clearInterval(i);
            }
          }, 1000);
        } else {
          hoveredMarker = null;
        }
        token.onCancellationRequested(() => {
          console.log('cancel');
        });
        return null;
      },
    });
  }
</script>

<div class="relative h-full w-full">
  <div class="absolute inset-0 overflow-hidden" bind:this={editorContainer}></div>

  {#if showOverlay}
    <div class="absolute top-0 left-23 w-full h-8 z-10 border-b border-blue-500/30 bg-blue-900 flex items-center gap-6 px-2">
      <button
        class="text-[20px] font-bold text-white transition hover:text-blue-200 leading-none"
        on:click={() => (showOverlay = false)}
      >
        Close
      </button>

      <span class="text-[14px] font-medium text-blue-300/90 leading-none mt-0.5">
        Below this overlay, is a precondition...
      </span>
    </div>
  {/if}
</div>

<style>
  .container {
    width: 100%;
    height: 600px;
  }
</style>
