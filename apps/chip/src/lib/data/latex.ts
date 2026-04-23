export const quizzes = {
loopQuiz:
`// Replace 'I' with a suitable variant to make the program verify
{e >= 0 & n >= 0}
i := 0;
r := 1;
do [I] // Replace me
    i < n ->
        r := r * e;
        i := i + 1
od
{r = exp(e, n)}
`,

assignQuiz:
`// TODO: Replace the question marks to make the program verify and fully annotated
{ ? }
x := z + y;
{ ? } 
y := y + 1
{ x > 10 & y > 5 }
`,
seqQuiz:
`// TODO: Replace the question mark to make the program verify,
// Try to do it without fully annotating the program.
{ ? }
y := x + 2; 
x := y - 1
{ x > 6 }
`,
skipQuiz:
`// TODO: Fully annotate the program
{ ? }
skip
{ x > 0 } 
`,
condQuiz:
`// TODO: Fully annotate the program
// Try using implication in your precondition. Check the grammar section: ==>
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
    title: 'Two Paths to Proof',
    math: String.raw`
      \textbf{1. Hoare Logic (Theory)}
      \\[4pt]
      \text{Used for building \textbf{Proof Trees}. This is the logical foundation shown in lecture.}
      \\[12pt]
      \textbf{2. WP Calculus (Practice)}
      \\[4pt]
      \text{This is the mechanical algorithm for finding preconditions.}
      \\[16pt]
      \textit{In Chip, you will primarily use \textbf{WP Calculus} to work backwards through your code.}
    `,
  },
  {
    title: 'Hoare Rules (Proof Trees)',
    math: String.raw`
      \text{These inference rules are used to decompose a program from the bottom up.}
      \\[12pt]
      \begin{gather*}
        ${skip} \\[8pt]
        ${assign} \\[12pt]
        ${seq} \\[12pt]
        ${cons} \\[12pt]
        ${cond} \\[14pt]
        ${loop}
      \end{gather*}
    `,
  },
  {
    title: 'Step-by-Step Proof Tree',
    math: String.raw`
      \text{Let us prove the triple: } \{ \text{true} \} \ \text{if } x > 0 \to x := 5 \ \text{fi} \ \{x = 5\}
      \\[12pt]
      \text{First, we identify that the command is an \texttt{if}, requiring us to prove the inner branch:}
      \\[8pt]
      \frac{\{\text{true} \land x > 0\} \ x := 5 \ \{x = 5\}}{\{\text{true}\} \ \text{if } x > 0 \to x := 5 \ \text{fi} \ \{x = 5\}} \text{[cond]}
      \\[18pt]
      \text{To prove the next inner branch we use the assignment and consequence rule}
      \\[8pt]
      \frac{ \text{true} \land x > 0 \models 5 = 5 \quad \frac{}{\displaystyle \{5 = 5\} \ x := 5 \ \{x = 5\}} \text{[assign]} }{ \{\text{true} \land x > 0\} \ x := 5 \ \{x = 5\} } \text{[cons]}
      \\[18pt]
      \textbf{The Final Nested Proof Tree} \\[6pt]
      \begin{equation*}
        \frac{
          \displaystyle
          \text{true} \land x > 0 \models 5 = 5
          \quad
          \frac{}{ \displaystyle \{5 = 5\} \ x := 5 \ \{x = 5\} }
        }{
          \displaystyle
          \frac{
            \displaystyle \{\text{true} \land x > 0\} \ x := 5 \ \{x = 5\}
          }{
            \displaystyle \{\text{true}\} \ \text{if } x > 0 \to x := 5 \ \text{fi} \ \{x = 5\}
          }
        }
      \end{equation*}
    `,
  },
  {
    title: 'Rules',
    math: String.raw`
      \begin{array}{l l l}
      \textbf{Skip} & \textbf{Assignment} \\
      \boxed{\frac{ }{\displaystyle \{Q\} \ \text{skip} \ \{Q\} } \text{[skip]}} & 
      \boxed{\frac{ }{\displaystyle \{Q[a/x]\} \ x := a \ \{Q\} } \text{[assign]}} \\
      \\
      \textbf{Example:} & \textbf{Example:} \\
      \frac{ }{\displaystyle \{x = 5\} \ \text{skip} \ \{x = 5\} } & 
      \frac{ }{\displaystyle \{10 = 10\} \ x := 10 \ \{x = 10\} } \\
      \\
    \end{array}
    \\[20pt]
          \textbf{Sequence}\\[4pt]
      \boxed{\frac{ \{P\} \ C_1 \ \{R\} \quad \{R\} \ C_2 \ \{Q\} }{ \{P\} \ C_1; C_2 \ \{Q\} } \text{[seq]}}
      \\[14pt]
      \textbf{Example:}\\[4pt]
      \frac{ \{1 = 1\} \ x := 1 \ \{x = 1\} \quad \{x = 1\} \ y := x \ \{y = 1\} }{ \{1 = 1\} \ x := 1; y := x \ \{y = 1\} }

    
    \\[20pt]
      \textbf{Consequence}\\[4pt]
      \boxed{\frac{ P \models P' \quad \{P'\} \ C \ \{Q'\} \quad Q' \models Q }{ \{P\} \ C \ \{Q\} } \text{[cons]}}
      \\[14pt]
      \textbf{Example:}\\[4pt]
      \frac{ x = 10 \models 10 = 10 \quad \frac{}{\displaystyle \{10 = 10\} \ x := 10 \ \{x = 10\}} \quad x = 10 \models x > 0 }{ \{x = 10\} \ x := 10 \ \{x > 0\} }
    
    \\[20pt]
    \textbf{Conditional:}\\[4pt]
      \boxed{${cond}}
      \\[14pt]
      \textbf{Example:}\\[4pt]
      \frac{ \{x > 0 \land x > 0\} \ \text{skip} \ \{x > 0\} \quad \{x > 0 \land x \le 0\} \ \text{skip} \ \{x > 0\} }{ \{x > 0\} \ \text{if } x > 0 \to \text{skip} \ [] \ x \le 0 \to \text{skip} \ \text{fi} \ \{x > 0\} }
    `,
  },
  {
    title: 'Loops',
    math: String.raw`
      \textbf{The Rule:}\\[4pt]
      \frac
      { \{I \land b\} \ C \ \{I\} } 
      { \{I\} \ \text{do } b \to C \ \text{od} \ \{I \land \neg b\} } 
      \quad \text{[loop]}
      \\[14pt]
      \textbf{Example: Simple Counter}\\[4pt]
      \frac{ \{x \le 10 \land x < 10\} \ x := x + 1 \ \{x \le 10\} }{ \{x \le 10\} \ \text{do } x < 10 \to x := x + 1 \ \text{od} \ \{x \le 10 \land \neg(x < 10)\} }
      \\[14pt]
      \textbf{The Invariant:}\\[4pt]
      \text{The invariant } I \text{ is a property that holds before and after every iteration of the loop.}\\
      \text{Please understand that the invariant is something that you must come up with yourself!}\\
    `,
  },
  {
    title: 'Finding the Invariant',
    math: String.raw`
      \text{A loop is correct if we can find an invariant } I \text{ such that:}\\
      \begin{aligned}
        &\text{1. } I \text{ holds before the loop starts} \\
        &\text{2. } I \text{ is preserved by each iteration} \\
        &\text{3. Upon termination, } I \land \neg b \text{ holds}
      \end{aligned}
      \\[12pt]
      \textbf{Observe the Pattern}\\[4pt]
      \begin{aligned}
        &\text{Initially: } &&i = 0, r = 1 = e^0 \\
        &\text{1st iteration: } &&i = 1, r = e = e^1 \\
        &\text{2nd iteration: } &&i = 2, r = e \cdot e = e^2 \\
      \end{aligned}
      \implies \text{Hypothesis: } r = e^i
      \\[12pt]
      \textbf{Define the Full Invariant}\\[4pt]
      \text{We must also bound } i \text{ using the loop guard } (i < n):\\
      \boxed{I: (r = e^i) \land (0 \le i \le n)}
      \\[12pt]
      \textbf{Proof by mathematical induction:}\\
      \text{Base case: } \\
      \begin{aligned}
        &i = 0 \\
        &r = 1 = e^i = e^0 = 1 \quad 
      \end{aligned} 
      \\ \checkmark
      \\[8pt]
      \text{Inductive step: }\\
      \begin{aligned}
        &r = e^k \\
        &r' = e \cdot r = e \cdot e^k = e^{k + 1} \\
        &i' = k + 1 \\
        &r' = e^{i'} \quad 
      \end{aligned}
      \\ \checkmark
      \\[12pt]
    `,
  },
  {
    title: 'WP Rules',
    math: String.raw`
      \text{The WP rules are the algorithmic counterpart to the Hoare rules.}\\
      \text{They are used to compute the weakest precondition for a given command and postcondition.}\\
      \text{For loop-free programs, } \mathrm{wp}(C, Q) \text{ is defined inductively:}\\
      \\[4pt]
      \mathrm{wp}(C, Q) = 
      \begin{cases} 
        Q, & \text{if } C = \text{skip} \\
        Q[a/x], & \text{if } C = x := a \\
        \mathrm{wp}(C_1, \mathrm{wp}(C_2, Q)), & \text{if } C = C_1 ; C_2 \\
        \displaystyle \bigwedge_{i=1}^n (b_i \Rightarrow \mathrm{wp}(C_i, Q)), & \text{if } C = \text{if } \dots \text{fi}
      \end{cases}
      \\[12pt]

    `,
  },
  {
    title: 'WP Rules - Skip',
    math: String.raw`
      \boxed{\mathrm{wp}(\text{skip}, Q) = Q}
      \\[14pt]
      \textbf{Goal: Derive the precondition}
      \\[8pt]
      \begin{aligned}
        &\{?\} \\ 
        &\text{skip} \\ 
        &\{x = 5\}
      \end{aligned}
      \\[6pt]
      \text{Since skip does not change the state, the precondition is the same as the postcondition.}
      \\[8pt]
      \mathrm{wp}(\text{skip}, (x = 5)) = (x = 5)
      \\[12pt]
      \textbf{Final result:}\\[8pt]
      \begin{aligned}
        &\{x = 5\} \\ 
        &\text{skip} \\ 
        &\{x = 5\}
      \end{aligned}
    `,
  },
  {
    title: 'WP Rules - Assignment',
    math: String.raw`
      \boxed{\mathrm{wp}(x := a, Q) = Q[a/x]}
      \\[14pt]
      \textbf{Goal: Derive the precondition}\\
      \begin{aligned}
        &\{?\} \\
        &x := z + y \\
        &\{x > 10 \ \& \ k \geq 3 \}
      \end{aligned}

      \\[12pt]
      \text{Substitute } x \text{ with } (z + y) \text{ in the postcondition}
      \\[8pt]
      \mathrm{wp}(x := z + y, (x > 10 \ \& \ k \geq 3)) = (z + y > 10 \ \& \ k \geq 3)
      \\[12pt]
      \textbf{Final result:}\\[8pt]
      \begin{aligned}
        &\{z + y > 10 \ \& \ k \geq 3\} \\
        &x := z + y \\
        &\{x > 10 \ \& \ k \geq 3\}
      \end{aligned}
    `,
  },
  {
    title: 'WP Rules - Sequence',
    math: String.raw`
      \boxed{\mathrm{wp}(C_1; C_2, Q) = \mathrm{wp}(C_1, \mathrm{wp}(C_2, Q))}
      \\[14pt]
      \textbf{Goal: Derive the precondition}
      \\[8pt]
      \begin{aligned}
        &\{?\} \\ 
        &x := x + 1; \\ 
        &y := x + y \\ 
        &\{y > 10\}
      \end{aligned}
      \\[12pt]
      \textbf{Calculate the inner wp} \\
      \mathrm{wp}(y := x + y, (y > 10)) = (x + y > 10)
      \\[12pt]
      \textbf{Calculate the outer wp using the inner wp} \\
      \mathrm{wp}(x := x + 1, (x + y > 10)) = ((x + 1) + y > 10) = (x + y > 9)
      \\[12pt]
      \textbf{Final result:}\\[8pt]
      \begin{aligned}
        &\{x + y > 9\} \\ 
        &x := x + 1; \\ 
        &y := x + y \\ 
        &\{y > 10\}
      \end{aligned}
    `,
  },
  {
    title: 'WP Rules - Conditionals',
    math: String.raw`
      \boxed{\mathrm{wp}(\text{if } \dots \text{fi}, Q) = \bigwedge_{i=1}^n (b_i \Rightarrow \mathrm{wp}(C_i, Q))}
      \\[14pt]
      \textbf{Goal: Derive the precondition}
      \\[8pt]
      \begin{aligned}
        &\{?\} \\
        &\text{if } x > 0 \rightarrow \\
        &\quad x := x - 1 \\
        &[] \ x \leq 0 \rightarrow \\
        &\quad x := x + 1 \\
        &\text{fi} \\
        &\{x = 0\}
      \end{aligned}
      \\[12pt]
      \textbf{Apply to each branch} \\
      \begin{aligned}
        &x > 0 \Rightarrow \mathrm{wp}(x := x - 1, (x = 0))\\
        &= \quad x > 0 \Rightarrow (x = 1) \\
        &x \leq 0 \Rightarrow \mathrm{wp}(x := x + 1, (x = 0))\\
        &= \quad x \leq 0 \Rightarrow (x = -1)
      \end{aligned}
      \\[12pt]
      \textbf{Conjugate the implications}\\
      \mathrm{wp}(\text{if } \dots \text{fi}, (x = 0)) =\\
      (x \leq 0 \Rightarrow (x = -1)) \land (x > 0 \Rightarrow (x = 1))
      \\[12pt]
      \textbf{Final fully annotated program as it would "look" in Chip:}
      \\[8pt]
      \begin{aligned}
        &\{x = 1 \ | \ x = -1 \}\\
        &\{(x > 0 \Rightarrow x = 1) \land (x \leq 0 \Rightarrow x = -1)\}\\
        &\text{if } x > 0 \rightarrow \\
        &\quad \{x=1\}\\
        &\quad x := x - 1 \\
        &\quad \{x=0\}\\
        &[] \ x \leq 0 \rightarrow \\
        &\quad \{x=-1\}\\
        &\quad x := x + 1 \\
        &\quad \{x=0\}\\
        &\text{fi} \\
        &\{x = 0\}
      \end{aligned}
    `,
  }
];




