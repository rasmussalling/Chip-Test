use std::collections::HashMap;
use rand::{rngs::ThreadRng, Rng};  

#[cfg(feature = "generate")]
pub fn post_condition(pg: gcl::pg::ProgramGraph, rng: &mut ThreadRng) -> String {
    use gcl::{
        ast::{Commands, Int, TargetDef, Variable},
        interpreter::{Execution, InterpreterMemory, Step, TerminationState},
        pg::{Determinism, Node, Edge},
    };
    
    let trace_length = 100;

    let mut values: HashMap<Variable, Vec<i32>> = HashMap::new();

    for _ in 0..10 {
        let mem = InterpreterMemory {
            variables: [
                (Variable("a".to_string()), rng.random_range(-10..10)),
                (Variable("b".to_string()), rng.random_range(-10..10)),
                (Variable("c".to_string()), rng.random_range(-10..10)),
            ]
            .into_iter()
            .collect(),
            arrays: Default::default(),
        };

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

        for (var, val) in exe.current_mem().variables.iter() {
            values.entry(var.clone()).or_default().push(*val);
        }
    }

    let rand_a = rng.random_range(0..9);
    let mut gr_we_a = ">=";
    if rand_a >= 5 {
        gr_we_a = "<=";
    }
    let post_a = format!("a {} {}", gr_we_a, values.get(&Variable("a".into())).and_then(|vals| vals.get(rand_a)).unwrap_or(&0));

    let rand_b = rng.random_range(0..9);
    let mut gr_we_b = ">=";
    if rand_b >= 5 {
        gr_we_b = "<=";
    }
    let post_b = format!("b {} {}", gr_we_b, values.get(&Variable("b".into())).and_then(|vals| vals.get(rand_b)).unwrap_or(&0));

    let rand_c = rng.random_range(0..9);
    let mut gr_we_c = ">=";
    if rand_c >= 5 {
        gr_we_c = "<=";
    }
    let post_c = format!("c {} {}", gr_we_c, values.get(&Variable("c".into())).and_then(|vals| vals.get(rand_c)).unwrap_or(&0));

    format!("{{{}}}", vec![post_a, post_b, post_c].join(" & "))

}
