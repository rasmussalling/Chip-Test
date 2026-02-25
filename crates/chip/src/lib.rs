pub mod agcl;
pub mod ast;
pub mod ast_ext;
pub mod ast_smt;
pub mod fmt;
pub mod interpreter;
pub mod model_check;
pub mod parse;
pub mod triples;

pub use smtlib;

#[cfg(feature = "generate")]
pub fn generate_sample_program() -> String {

    use gcl::{
        ast::{Commands, Int, TargetDef, Variable},
        interpreter::{Execution, InterpreterMemory, Step, TerminationState},
        pg::{Determinism, Node},
    };
    use rand::{rngs::ThreadRng, Rng};
    use ce_core::{
            Generate, 
            gn::GclGenContext,
            Env, ValidationResult, define_env,
            rand::{self, seq::IndexedRandom},
        };
    use stdx::stringify::Stringify;
    use std::collections::HashMap;

    use itertools::Itertools;
    
    let mut custom_ctx = GclGenContext {
        fuel: 4,
        recursion_limit: 2,
        negation_limit: 2,
        no_loops: true,
        no_division: false,
        no_unary_minus: false,
        names: vec!["a".into(), "b".into(), "c".into()],
    };

    let trace_length = 100;

    let determinism = Determinism::Deterministic;

    let mut rng = rand::rng();

    let first_program = Commands::gn(&mut custom_ctx, &mut rng);

    let string_program = first_program.to_string();

    let program = Stringify::new(first_program);
    
    let pg =
            gcl::pg::ProgramGraph::new(
                determinism,
                &program.try_parse().expect("failed to parse generated program"),
            );

    let mut values: HashMap<Variable, Vec<i32>> = HashMap::new();

    let mut mem = InterpreterMemory {
            variables: [
                (Variable("a".to_string()), rng.random_range(-10..10)),
                (Variable("b".to_string()), rng.random_range(-10..10)),
                (Variable("c".to_string()), rng.random_range(-10..10)),
            ]
            .into_iter()
            .collect(),
            arrays: Default::default(),
    };

    let start = mem.variables.iter().map(|(v, val)| format!("{} = {}", v, val)).join(" & ");

    let mut exe = Execution::new(mem.clone());

    for _ in 0..trace_length {
        if let Some(next) = exe.nexts(&pg).first().cloned() {
            if next.is_stuck(&pg) {
                exe = next;
                break;
            }
            exe = next;
            continue;
        }

        break;
    }

    let result = exe.current_mem().variables.iter().map(|(v, val)| format!("{} = {}", v, val)).join(" & ");
    
    format!("{{{}}}\n\n{}\n\n{{{}}}",start, string_program, result)
}