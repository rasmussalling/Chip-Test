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
    use gcl::ast::Commands;
    use rand::rngs::ThreadRng;
    use ce_core::Generate;

    let mut rng = rand::rng();
    Commands::gn(&mut Default::default(), &mut rng).to_string()
}