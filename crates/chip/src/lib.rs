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
    
    let check = format!("x = x & y = y & z = z");
    if post_cond == check {
        generate_sample_program()
    } else {
        annotate(pg.clone(), post_cond, string_program)
    }
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
    
    let check = format!("x = x & y = y & z = z");
    if post_cond != check {
        let annotated = annotate(pg, post_cond.clone(), string_program.clone());

        let pre_cond = annotated
            .lines()
            .next()
            .map(|s| s.to_string())
            .unwrap_or_else(|| String::from("true"));

        let pre_cond_with_comment = format!("{} //GENERATED PRECONDITION", pre_cond);

        let challenge_text = "// TODO: Fully annotate the following program.\n\
                            // Try to make your annotations such that the precondition is as weak as possible.";

        format!(
            "{}\n{}\n{}\n\n{{{}}}",
            pre_cond_with_comment,
            challenge_text,
            string_program,
            post_cond
        )
    } else {
        generate_challenge()
    }
}