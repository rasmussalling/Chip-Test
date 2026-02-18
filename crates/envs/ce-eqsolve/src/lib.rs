use ce_core::{Env, Generate, ValidationResult, define_env, rand};
use serde::{Deserialize, Serialize};

define_env!(EqsolveEnv);

#[derive(tapi::Tapi, Debug, Default, Clone, PartialEq, Serialize, Deserialize)]
pub struct Input {
    pub eq: String,
}

#[derive(tapi::Tapi, Debug, Default, Clone, PartialEq, Serialize, Deserialize)]
pub struct Output {
    pub result: String,
}

impl Env for EqsolveEnv {
    type Input = Input;

    type Output = Output;

    type Meta = ();

    fn run(_input: &Self::Input) -> ce_core::Result<Self::Output> {
        let result = solve_equation(&_input.eq);
        Ok(Output { result })
    }

    fn validate(_input: &Self::Input, _output: &Self::Output) -> ce_core::Result<ValidationResult> {
        Ok(ValidationResult::Correct)
    }
}

fn solve_equation(input: &str) -> String {
    const ERR: &str = "Could not solve (only linear equations supported)";

    let eq = input.trim().replace(' ', "");
    let mut it = eq.split('=');

    let left = match it.next() {
        Some(s) if !s.is_empty() => s,
        _ => return ERR.to_string(),
    };
    let right = match it.next() {
        Some(s) if !s.is_empty() => s,
        _ => return ERR.to_string(),
    };
    if it.next().is_some() {
        return ERR.to_string(); // more than one '='
    }

    let (a_l, b_l) = match parse_expression(left) {
        Some(v) => v,
        None => return ERR.to_string(),
    };
    let (a_r, b_r) = match parse_expression(right) {
        Some(v) => v,
        None => return ERR.to_string(),
    };

    let mut sign_of_b1 = "+";
    let mut sign_of_b2 = "+";

    if b_l < 0.0 {
        sign_of_b1 = "-";
    }
    if b_r < 0.0 {
        sign_of_b2 = "-";
    }

    let reduced: String = format!(
        "{}x {} {} = {}x {} {}",
        a_l, sign_of_b1, b_l.abs(), a_r, sign_of_b2, b_r.abs()
    );

    let a = a_l - a_r;
    let b = b_r - b_l;

    if a == 0.0 {
        return "No unique solution".to_string();
    }

    let isolated = format!("{}x = {}", a, b);

    let x = b / a;

    let total: String = format!("x = {}", x);

    format!(
        "Reduced form: {}\nIsolated form: {}\nResult: {}",
        reduced, isolated, total
    )
}

// Parses an expression like: 2x-3+4*x/2
// Returns (coef_x, constant) or None if invalid/non-linear.
fn parse_expression(expr: &str) -> Option<(f64, f64)> {
    let mut coef_x = 0.0;
    let mut constant = 0.0;

    let mut term = String::new();
    let mut sign = 1.0;

    for c in expr.chars().chain(std::iter::once('+')) {
        if c == '+' || c == '-' {
            if !term.is_empty() {
                apply_term(&term, sign, &mut coef_x, &mut constant)?;
                term.clear();
            }
            sign = if c == '-' { -1.0 } else { 1.0 };
        } else {
            term.push(c);
        }
    }

    Some((coef_x, constant))
}

// Term is a product/division of factors, like: 3*x/2 or 2x
fn apply_term(term: &str, sign: f64, coef_x: &mut f64, constant: &mut f64) -> Option<()> {
    if term.is_empty() {
        return None;
    }

    let mut value = 1.0;
    let mut has_x = false;

    let mut cur = String::new();
    let mut op = '*';

    for c in term.chars().chain(std::iter::once('*')) {
        if c == '*' || c == '/' {
            let (v, is_x) = parse_factor(&cur)?;
            cur.clear();

            // Non-linear: x*x, or divide by x, or (number)/x
            if is_x {
                if has_x || op == '/' {
                    return None;
                }
                has_x = true;
                value *= v;
                
            } else {
                match op {
                    '*' => value *= v,
                    '/' => value /= v,
                    _ => {}
                }
            }

            op = c;
        } else {
            cur.push(c);
        }
    }

    if has_x {
        *coef_x += sign * value;
    } else {
        *constant += sign * value;
    }

    Some(())
}

// Returns (numeric_value, is_x)
//
// Allowed:
// - "x"
// - "2x" (implicit multiplication)
// - "3.5"
fn parse_factor(s: &str) -> Option<(f64, bool)> {
    if s.is_empty() {
        return None;
    }

    if s == "x" {
        return Some((1.0, true));
    }

    if let Some(num) = s.strip_suffix('x') {
        if num.is_empty() {
            return Some((1.0, true));
        }

        let v = num.parse::<f64>().ok()?;
        return Some((v, true));
    }
    let v = s.parse::<f64>().ok()?;
    Some((v, false))
}

impl Generate for Input {
    type Context = ();

    fn gn<R: rand::Rng>(_cx: &mut Self::Context, _rng: &mut R) -> Self {
        Self::default()
    }
}
