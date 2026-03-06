use std::{collections::HashMap, vec};
use rand::{rngs::ThreadRng, Rng};  
use itertools::Itertools;

use crate::{
    ast::{Target, Variable},
    interpreter::{Execution, InterpreterMemory},
    pg::{Node, Edge, ProgramGraph, Action::{self, Assignment, Condition, Skip}},
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

    let mut total_cond: Vec<String> = vec![format!("{{{}}}\n", current_cond.clone())];
/*
    let mut incoming_edges: Vec<&Edge> = pg.incoming(final_node);

    while incoming_edges.len() > 0 {
    //Start of given guard if next node has multiple incoming edges.
    //End of given guard if next node hase multiple outgoing edges.

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
                            _ => total_cond.push(format!("{{{}}}\n", current_cond.clone())),
                        }
                    } else {
                        total_cond.push(format!("{{{}}}\n", current_cond.clone()));
                    }
                }
                Assignment(Target::Array(_, _), _) => current_cond = "unknown".to_string(),
                Condition(cond) => {
                    let cond_str = format!("{}", cond);
                    let if_cond = format!("{} & ({})", current_cond, cond_str);
                    total_cond.push(format!("{{{}}}\n", if_cond));
                }
                _ => current_cond = "unknown".to_string(),
            }
        } else {
            break
        }
        
        incoming_edges = next_edges;
    };
*/
    let mut _end_cond: String = String::new();
    let mut _end_node: Node = final_node.clone();
    (total_cond, _end_cond, _end_node) = make_pre_condition(pg.clone(), current_cond.clone(), total_cond.clone(), final_node, &Skip, false);

    format!("{}\n\n{}", program, total_cond.iter().rev().join(""))
}

fn make_pre_condition(pg: ProgramGraph, mut current_cond: String, mut total_cond: Vec<String>, cur_node: Node, action: &Action, g: bool) -> (Vec<String>, String, Node) {
    let mut guard_stack = vec![];
    let mut end_cond: String = String::new();
    
    let mut incoming_edges: Vec<&Edge> = pg.incoming(cur_node);

    let mut next_node: Node = incoming_edges[incoming_edges.len() - 1].from();

    if g {
        let next_edges = pg.incoming(cur_node);
            match action {
                Assignment(Target::Variable(var), val) => {
                    let var_name = &var.0;
                    current_cond = current_cond.replace(var_name, &format!("{}", val));
                    //if next_edges.len() > 0 {
                        match next_edges[0].action() {
                            Condition(_cond) => {}
                            _ => total_cond.push(format!("{{{}}}\n", current_cond.clone())),
                        }
                    /*
                    } else {
                        total_cond.push(format!("{{{}}}mmmmm\n", current_cond.clone()));
                    }*/
                }
                _ => current_cond = "unknown".to_string(),
            }
    }

    while incoming_edges.len() > 0 {
    //Start of given guard if next node has multiple incoming edges.
    //End of given guard if next node hase multiple outgoing edges.
        next_node = incoming_edges[incoming_edges.len() - 1].from();
        
        if incoming_edges.len() == 1 {
            
            let next_edges = pg.incoming(next_node);
            match incoming_edges[0].action() {
                Assignment(Target::Variable(var), val) => {
                    let var_name = &var.0;
                    current_cond = current_cond.replace(var_name, &format!("{}", val));
                    if next_edges.len() > 0 {
                        match next_edges[0].action() {
                            Condition(_cond) => {}
                            _ => total_cond.push(format!("{{{}}}\n", current_cond.clone())),
                        }
                    } else {
                        total_cond.push(format!("{{{}}}\n", current_cond.clone()));
                    }
                }
                Assignment(Target::Array(_, _), _) => current_cond = "unknown".to_string(),
                Condition(cond) => {
                    let cond_str = format!("{}", cond);
                    let if_cond = format!("{} & ({})", current_cond, cond_str);
                    total_cond.push(format!("{{{}}}\n", if_cond));
                    if pg.outgoing_edges(next_node).len() < 1 {
                        total_cond.push(format!("{{{}}}\n", current_cond.clone()));
                    }
                }
                _ => current_cond = "unknown".to_string(),
            }
        } else if incoming_edges.len() > 1 {
            for edge in incoming_edges.iter().rev() {
                let mut guard_cond: String = String::new();
                (total_cond, guard_cond, next_node) = make_pre_condition(pg.clone(), current_cond.clone(), total_cond.clone(), edge.from(), edge.action(), true);
                guard_stack.push(guard_cond.clone());
            }
            let total_guard_cond: String = guard_stack.iter().join(" | ");
            guard_stack.clear();
            current_cond = format!("{}", total_guard_cond);
            total_cond.push(format!("{{{}}}\n", current_cond.clone()));
        } else {
            break
        }
        let next_edges = pg.incoming(next_node);
        incoming_edges = next_edges;

        if pg.outgoing_edges(next_node).len() > 1 {
            end_cond = format!("{}", current_cond.clone());
            break
        }
    };

    (total_cond, end_cond, next_node)
}