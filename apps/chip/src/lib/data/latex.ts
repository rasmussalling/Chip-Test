export const quizzes = {
assignQuiz:
`// TODO: Replace the question marks to make the program verify and fully annotated
{ ? }
x := z + y;
{ ? } 
y := y + 1
{ x > 10 & y > 5 }
`,
seqQuiz:
`// TODO: Fully annotate the program
{ x > 5 }
y := x + 2; x := y - 1
{ x > 6 }
`,
skipQuiz:
`// TODO: Fully annotate the program
{ x > 0 } 
skip
{ ? }
`,
condQuiz:
`// TODO: Fully annotate the program
{ x > 0 }
if (x > 5) ->
  y := x - 2
[] (x <= 5) ->
  y := x + 1
fi
{ y > 1 }
`,
}

const assign = `\\frac{ }{\\{Q[a/x]\\} \\ x := a \\ \\{Q\\}} \\quad \\text{[assign]}`;
const seq = `\\frac{\\{P\\} C_1 \\{R\\} \\quad \\{R\\} C_2 \\{Q\\}}{\\{P\\} \\ C_1;C_2 \\ \\{Q\\}} \\quad \\text{[seq]}`;
const skip = `\\frac{ }{\\{Q\\} \\ \\text{skip} \\ \\{Q\\}} \\quad \\text{[skip]}`;
const cons = `\\frac{P \\models P' \\quad \\{P'\\} C \\{Q'\\} \\quad Q' \\models Q}{\\{P\\} \\ C \\ \\{Q\\}} \\quad \\text{[cons]}`;
const cond = `\\frac{\\{P \\land b_1\\} C_1 \\{Q\\} \\quad \\cdots \\quad \\{P \\land b_n\\} C_n \\{Q\\}}{\\{P\\} \\ \\text{if } b_1 \\rightarrow C_1 \\ [] \\ \\cdots \\ [] \\ b_n \\rightarrow C_n \\ \\text{fi} \\ \\{Q\\}} \\quad \\text{[cond]}`;
const loop = `
    \\frac
    { \\{I \\land b_1\\} C_1 \\{I\\} \\quad \\cdots \\quad \\{I \\land b_n\\} C_n \\{I\\}} 
    { \\{I\\} \\ \\text{do } b_1 \\rightarrow \\{I \\land b_1\\} C_1 \\{I\\} \\ [] \\ \\cdots \\ [] \\ b_n \\rightarrow C_n \\ \\text{od} \\ \\{I \\land \\neg b_1 \\land \\cdots \\land \\neg b_n\\}} 
    \\quad \\text{[loop]}
  `;


export const pages = [
    {
      title: 'Hoare Rules',
      description: 'A quick overview of the main Hoare logic proof rules.',
      math: `
      \\begin{gather*}
        ${assign} \\\\[12pt]
        ${seq} \\\\[12pt]
        ${skip} \\\\[12pt]
        ${cons} \\\\[12pt]
        ${cond} \\\\[12pt]
        ${loop}
      \\end{gather*}
      `,
    },
    {
      title: 'Assignment Rule',
      math: `
      \\boxed{${assign}}
      \\\\[8pt]
      \\textbf{Goal: Derive the precondition}
      \\\\[8pt]

      \\begin{aligned}
        &\\{\\ ?\\ \\} \\\\
        &x := z + y \\\\
        &\\{x > 10 \\ \\& \\ k \\geq 3 \\}
      \\end{aligned}

      \\\\[12pt]

      \\textbf{Apply assignment rule}
      \\\\[6pt]
      \\text{Substitute } x \\text{ with } (z + y) \\text{ in the postcondition}
      \\\\[8pt]

      \\{x > 10 \\ \\& \\ k \\geq 3\\} \\Rightarrow \\{z + y > 10 \\ \\& \\ k \\geq 3\\}

      \\\\[12pt]

      \\textbf{Final result:}
      \\\\[8pt]

      \\begin{aligned}
        &\\{z + y > 10 \\ \\& \\ k \\geq 3\\} \\\\
        &x := z + y \\\\
        &\\{x > 10 \\ \\& \\ k \\geq 3\\}
      \\end{aligned}
      `,
    },
    {
      title: 'Sequence Rule',
      math: `
      \\boxed{${seq}}
      \\\\[8pt]

      \\textbf{Goal: Find the intermediate assertion}
      \\\\[8pt]

      \\begin{aligned}
        &\\{\\ x > 5\\ \\} \\\\
        &x := x + 1; \\\\
        &y := x * 2 \\\\
        &\\{y > 12\\}
      \\end{aligned}

      \\\\[12pt]

      \\textbf{Use assignment rule to find the intermediate assertion}
      \\\\[8pt]

      \\begin{aligned}
        &\\{x > 5\\} \\\\
        &x := x + 1 \\\\
        &\\{x * 2 > 12\\} \\\\
        &y := x * 2 \\\\
        &\\{y > 12\\}
      \\end{aligned}

      \\\\[12pt]

      \\textbf{Get final result by reducing the assertion}
      \\\\[8pt]
      \\begin{aligned}
        &\\{x > 5\\} \\\\
        &x := x + 1 \\\\
        &\\{x > 6\\} \\\\
        &\\{x * 2 > 12\\} \\\\
        &y := x * 2 \\\\
        &\\{y > 12\\}
      \\end{aligned}
      `,
    },
    {
      title: 'Skip Rule',
      math: `
      \\boxed{${skip}}
      \\\\[8pt]

      \\textbf{Skip does not change the state, so the precondition and postcondition are the same}
      \\\\[8pt]

      \\begin{aligned}
        &\\{\\ z > \\text{exp}(3, i)\\ \\} \\\\
        &\\text{skip}; \\\\
        &\\{\\ z > \\text{exp}(3, i)\\ \\}
      \\end{aligned}
      `,
    },
    {
      title: 'Consequence Rule',
      math: `
      \\boxed{${cons}}
      \\\\[8pt]
      \\textbf{Goal: Strengthen the precondition and weaken the postcondition}
      \\\\[8pt]

      \\begin{aligned}
        &\\{x > 5\\} \\\\
        &x := x + 1 \\\\
        &\\{x > 6\\}
      \\end{aligned}

      \\\\[12pt]

      \\textbf{We want:}
      \\\\[8pt]

      \\begin{aligned}
        &\\{x > 10\\} \\\\
        &x := x + 1 \\\\
        &\\{x > 0\\}
      \\end{aligned}

      \\\\[12pt]

      \\textbf{Check implications}
      \\\\[6pt]

      \\text{P: } x > 10 \\Rightarrow x > 5
      \\\\[4pt]
      \\text{Q: } x > 6 \\Rightarrow x > 0

      \\\\[12pt]

      \\textbf{Apply consequence rule}
      \\\\[8pt]

      \\begin{aligned}
        &x > 10 \\ \\models \\ x > 5 \\\\
        &\\{x > 5\\} \\ x := x + 1 \\ \\{x > 6\\} \\\\
        &x > 6 \\ \\models \\ x > 0
      \\end{aligned}

      \\\\[12pt]

      \\textbf{Final result:}
      \\\\[8pt]

      \\begin{aligned}
        &\\{x > 10\\} \\\\
        &x := x + 1 \\\\
        &\\{x > 0\\}
      \\end{aligned}
      `,
    },
    {
      title: 'Conditional Rule',
      math: `
      \\boxed{${cond}}
      \\\\[8pt]

      \\textbf{Goal: Verify each branch preserves Q}
      \\\\[8pt]

      \\textbf{Given program:}
      \\\\[6pt]

      \\begin{aligned}
        &\\text{if } (x > 0) \\rightarrow \\\\
        &\\quad x := x - 1 \\\\
        &[] \\ (x \\leq 0) \\rightarrow \\\\
        &\\quad x := x + 1 \\\\
        &\\text{fi}
      \\end{aligned}

      \\\\[12pt]

      \\textbf{Precondition: } P = x \\leq 2
      \\\\[8pt]

      \\textbf{Postcondition: } Q = x \\leq 1
      \\\\[12pt]

      \\textbf{Check each branch}
      \\\\[10pt]

      \\begin{aligned}
        &\\{(x \\leq 2) \\land x > 0\\} \\ x := x - 1 \\ \\{x \\leq 1\\} \\\\
        &\\{(x \\leq 2) \\land x \\leq 0\\} \\ x := x + 1 \\ \\{x \\leq 1\\}
      \\end{aligned}

      \\\\[14pt]

      \\textbf{Reasoning}
      \\\\[8pt]
      \\begin{aligned}
      &\\ \\text{Branch 1: } x \\leq 2 \\land x > 0 \\Rightarrow x \\leq 2 \\Rightarrow x - 1 \\leq 1
      \\\\
      &\\ \\text{Branch 2: } x \\leq 0 \\Rightarrow x + 1 \\leq 1
      \\end{aligned}

      \\\\[12pt]

      \\textbf{Apply conditional rule and write annotations}
      \\\\[10pt]

      \\begin{aligned}
        &\\{x \\leq 2\\} \\\\
        &\\text{if } (x > 0) \\rightarrow \\\\ 
        &\\quad \\{x \\leq 2 \\land x > 0\\} \\\\
        &\\quad x := x - 1 \\\\
        &\\quad \\{x \\leq 1\\} \\\\
        &[] \\ (x \\leq 0) \\rightarrow \\\\
        &\\quad \\{x \\leq 2 \\land x \\leq 0\\} \\\\
        &\\quad x := x + 1 \\\\
        &\\quad \\{x \\leq 1\\} \\\\
        &\\text{fi} \\\\
        &\\{x \\leq 1\\}
      \\end{aligned}
      `,
    },
    {
      title: 'Loop Rule',
      math: `
      \\begin{gather*}
        ${loop}
      \\end{gather*}
      \\\\[12pt]
      \\text{A loop is correct if we can find an invariant I:}\\\\
      \\begin{aligned}
        &\\text{1. I holds before the loop starts} \\\\
        &\\text{2. I is preserved by each iteration of the loop} \\\\
        &\\text{3. When the loop terminates, I and the negation of the loop condition holds}
      \\end{aligned}
      \\\\[12pt]
      \\textbf{Given the program:}\\\\
      \\begin{aligned}
        &r := 1; \\\\
        &i := 0; \\\\
        &\\text{do }[false] \\\\
        &\\quad i \\neq n \\rightarrow \\\\
        &\\quad \\quad r := e \\cdot r; \\\\
        &\\quad \\quad i := i + 1 \\\\
        &\\text{od}\\\\
        &\\{i = n \\land r = \\text{exp}(e, n)\\}
      \\end{aligned}
      \\\\[12pt]
      \\textbf{Find an invariant I}
      \\\\[8pt]
      \\text{Initially:}\\\\
      i = 0 \\text{ and } r = 1 = e^0 \\\\[8pt]
      \\text{Each loop iteration } r \\text{ is multiplied by } e \\text{ and } i \\text{ increases by 1} \\\\[8pt]

      \\begin{aligned}
        &1 \\text{ iteration: } &&r = e^1 \\\\
        &2 \\text{ iterations: } &&r = e \\cdot e = e^2 \\\\
        &3 \\text{ iterations: } &&r = e^2 \\cdot e = e^3 \\\\
      \\end{aligned}
      \\\\[8pt]
      \\begin{aligned}
        \\boxed{r = \\text{exp}(e, i)}
      \\end{aligned}
      \\\\[16pt]
      \\textbf{Proof by mathematical induction:}\\\\
      \\text{Base case: } \\\\
      \\begin{aligned}
        &i = 0 \\\\
        &r = 1 = e^i = e^0 = 1
      \\end{aligned} 
      \\\\
      \\checkmark \\\\[8pt]
      \\text{Inductive step: }\\\\
      \\begin{aligned}
        &r = e^k\\\\
        &r' = e \\cdot r = e \\cdot e^k = e^{k + 1} \\\\
        &i' = k + 1\\\\
        &r' = e^{i'}
      \\end{aligned}
      \\\\
      \\checkmark\\\\ 
      \\textbf{Lastly we reason that } i \\text{ stays in a known domain}\\\\
      0 \\leq i \\leq n \\\\[12pt]
      \\textbf{Final program:}\\\\
      \\begin{aligned}
        &r := 1; \\\\
        &i := 0; \\\\
        &\\text{do }[0 \\leq i \\ \\land i \\leq n \\ \\land r = \\text{exp}(e, i)] \\\\
        &\\quad i \\neq n \\rightarrow \\\\
        &\\quad \\quad r := e \\cdot r; \\\\
        &\\quad \\quad i := i + 1 \\\\
        &\\text{od}\\\\
        &\\{i = n \\land r = \\text{exp}(e, n)\\}
      \\end{aligned}

      `,
    },    
  ];





