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

  use gcl::{
        ast::Commands,
        pg::Determinism,
        annotater::{post_condition, annotate},
    };
    use rand::{rngs::ThreadRng, Rng};
    use ce_core::{
            Generate, 
            gn::GclGenContext,
            rand::{self},
        };
    use stdx::stringify::Stringify;

pub fn generate_sample_program() -> String {

  
    
    let mut custom_ctx = GclGenContext {
        fuel: 4,
        recursion_limit: 2,
        negation_limit: 2,
        no_loops: true,
        no_division: false,
        no_unary_minus: false,
        names: vec!["x".into(), "y".into(), "z".into()],
    };

    let determinism = Determinism::NonDeterministic;

    let mut rng = rand::rng();

    let first_program = Commands::gn(&mut custom_ctx, &mut rng);

    let string_program = first_program.to_string();

    let program = Stringify::new(first_program);
    
    let pg =
            gcl::pg::ProgramGraph::new(
                determinism,
                &program.try_parse().expect("failed to parse generated program"),
            );

    let post_cond = post_condition(pg.clone(), &mut rng);

    annotate(pg.clone(), post_cond, string_program)
}


pub fn generate_challenge() -> String {
   
    
    let mut custom_ctx = GclGenContext {
        fuel: 4,
        recursion_limit: 2,
        negation_limit: 2,
        no_loops: true,
        no_division: false,
        no_unary_minus: false,
        names: vec!["x".into(), "y".into(), "z".into()],
    };

    let determinism = Determinism::NonDeterministic;

    let mut rng = rand::rng();

    let first_program = Commands::gn(&mut custom_ctx, &mut rng);

    let string_program = first_program.to_string();

    let program = Stringify::new(first_program);
    
    let pg =
            gcl::pg::ProgramGraph::new(
                determinism,
                &program.try_parse().expect("failed to parse generated program"),
            );

    let post_cond = post_condition(pg.clone(), &mut rng);

    let challenge_text: String = 
        "// TODO: Fully annotate the following program. \n// Try to make your annotations such that the precondition is as weak as possible."
        .to_string();

    
    format!("{}\n{}\n\n{{{}}}", challenge_text, string_program, post_cond)
}