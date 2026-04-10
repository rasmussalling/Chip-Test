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
      \\begin{gather*}
        ${seq}
      \\end{gather*}
      `,
    },
    {
      title: 'Skip Rule',
      math: `
      \\begin{gather*}
        ${skip}
      \\end{gather*}
      `,
    },
    {
      title: 'Consequence Rule',
      math: `
      \\begin{gather*}
        ${cons}
      \\end{gather*}
      `,
    },
    {
      title: 'Conditional Rule',
      math: `
      \\begin{gather*}
        ${cond}
      \\end{gather*}
      `,
    },
    {
      title: 'Loop Rule',
      math: `
      \\begin{gather*}
        ${loop}
      \\end{gather*}
      `,
    },    
  ];





