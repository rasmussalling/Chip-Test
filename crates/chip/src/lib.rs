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


// Ensure split_program is accessible and correctly typed
fn split_program(cmds: Commands, rng: &mut impl Rng) -> (Commands, Commands) {
    let mut cmd_vec = cmds.0; // Accessing the Vec<Command> inside the wrapper
    let len = cmd_vec.len();
    
    // Pick a split point. If len is 1, k=0 makes Part A empty, k=1 makes Part B empty.
    let k = rng.gen_range(0..=len);
    
    let part_b = cmd_vec.split_off(k);
    (Commands(cmd_vec), Commands(part_b))
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

    // 1. GENERATE BASE PROGRAM
    let full_program = Commands::gn(&mut custom_ctx, &mut rng);
    let pg_full = gcl::pg::ProgramGraph::new(determinism, &full_program);
    let post_cond = post_condition(pg_full, &mut rng);

    // 2. SELECT INSERTION POINT & SPLIT
    let (part_a, part_b) = split_program(full_program, &mut rng);

    // 3. CALCULATE REQUIRED STATE AT POINT K (WP of Part B)
    let required_state_k = if part_b.0.is_empty() {
        post_cond.clone()
    } else {
        let pg_b = gcl::pg::ProgramGraph::new(determinism, &part_b);
        let annotated_b = annotate(pg_b, post_cond.clone(), part_b.to_string());
        annotated_b
            .lines()
            .next()
            .map(|s| s.trim_matches(|c| c == '{' || c == '}').trim().to_string())
            .unwrap_or_else(|| "true".to_string())
    };

    // 4 & 5. GENERATE LOOP & COMBINE INVARIANT
    let l_init = "i := 0;\n r := 0";
    let l_inv = "i <= n & r = a * i";
    let l_body = "r := r + a; i := i + 1";
    let guard = "i < n";
    let combined_inv = format!("{} & {}", l_inv, required_state_k);
    let combined_post = format!("{} & {}", "r = a * i", post_cond);

    // 7. ASSEMBLE FINAL OUTPUT
    let challenge_header = "// TODO: Fully annotate the following program.\n\
                            // Try to make your annotations such that the precondition is as weak as possible.";

    let program_code = format!(
        "{};\n{};\ndo [{}] {} ->\n    {}\nod;\n{}",
        part_a.to_string(),
        l_init,
        combined_inv,
        guard,
        l_body,
        part_b.to_string()
    );

    format!(
        "{}\n{}\n\n{{{}}}",
        challenge_header,
        program_code,
        combined_post
    )
}
