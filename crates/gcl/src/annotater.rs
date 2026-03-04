use std::collections::HashMap;
use rand::{rngs::ThreadRng, Rng};  

use crate::{
    ast::{Target, Variable},
    interpreter::{Execution, InterpreterMemory},
    pg::{Node, Edge, ProgramGraph, Action::{Assignment, Condition, Skip}},
    };

pub fn post_condition(pg: ProgramGraph, rng: &mut ThreadRng) -> String {
    
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

    format!("{}", vec![post_a, post_b, post_c].join(" & "))

}

pub fn annotate(pg: ProgramGraph, post_cond: String, program: String) -> String {

    let final_node = Node::End;

    
    let mut current_cond = post_cond.clone();

    let mut total_cond = format!("{{{}}}", current_cond.clone());

    let mut incoming_edges: Vec<&Edge> = pg.incoming(final_node);

    while incoming_edges.len() > 0 {

        let next_node = incoming_edges[0].from();
        let next_edges = pg.incoming(next_node);
        if incoming_edges.len() > 0 {
            match incoming_edges[0].action() {
                Assignment(Target::Variable(var), val) => {
                    let var_name = &var.0;
                    current_cond = current_cond.replace(var_name, &format!("{}", val));
                    if next_edges.len() > 0 {
                        match next_edges[0].action() {
                            Condition(cond) => {}
                            _ => total_cond = format!("{{{}}}\n{}", current_cond, total_cond),
                        }
                    } else {
                        total_cond = format!("{{{}}}\n{}", current_cond, total_cond);
                    }
                }
                Assignment(Target::Array(_, _), _) => current_cond = "unknown".to_string(),
                Condition(cond) => {
                    let cond_str = format!("{}", cond);
                    let if_cond = format!("{} & ({})", current_cond, cond_str);
                    total_cond = format!("{{{}}}\n{}", if_cond, total_cond);
                }
                _ => current_cond = "unknown".to_string(),
            }
        } else {
            break
        }
        
        incoming_edges = next_edges;
    };

    

    format!("{}\n\n{}", program, total_cond)
}