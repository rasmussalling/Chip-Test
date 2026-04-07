<script lang="ts">
  import Katex from '$lib/components/Katex.svelte';

  const axioms = `
  \\begin{gather*}
  \\frac{ }{\\{Q[a/x]\\} \\ x := a \\ \\{Q\\}} \\quad \\text{[assign]} \\\\[12pt]

  \\frac{\\{P\\} C_1 \\{R\\} \\quad \\{R\\} C_2 \\{Q\\}}{\\{P\\} \\ C_1;C_2 \\ \\{Q\\}} \\quad \\text{[seq]} \\\\[12pt]

  \\frac{P \\models P' \\quad \\{P'\\} C \\{Q'\\} \\quad Q' \\models Q}{\\{P\\} \\ C \\ \\{Q\\}} \\quad \\text{[cons]} \\\\[12pt]

  \\frac{ }{\\{Q\\} \\ \\text{skip} \\ \\{Q\\}} \\quad \\text{[skip]} \\\\[12pt]

  \\frac{\\{P \\land b_1\\} C_1 \\{Q\\} \\quad \\cdots \\quad \\{P \\land b_n\\} C_n \\{Q\\}}{\\{P\\} \\ \\text{if } b_1 \\rightarrow C_1 \\ [] \\ \\cdots \\ [] \\ b_n \\rightarrow C_n \\ \\text{fi} \\ \\{Q\\}} \\quad \\text{[cond]}
  \\end{gather*}
  `;
</script>

<article class="prose prose-invert mx-auto">
  <h1>Hoare Rules</h1>
  <Katex math={axioms} displayMode={true} />
</article>