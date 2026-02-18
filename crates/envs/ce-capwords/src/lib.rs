use ce_core::{Env, Generate, ValidationResult, define_env, rand};
use serde::{Deserialize, Serialize};

define_env!(CapwordsEnv);

#[derive(tapi::Tapi, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[tapi(path = "Capwords")]
pub struct Input {
    pub text: String,
}

#[derive(tapi::Tapi, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[tapi(path = "Capwords")]
pub struct Output {
    pub cap_string: String,
}

impl Env for CapwordsEnv {
    type Input = Input;

    type Output = Output;

    type Meta = ();

    fn run(input: &Self::Input) -> ce_core::Result<Self::Output> {
        
        let mut word_index = 0;

        let cap_string: Vec<String> = input.text
            .split_whitespace()
            .map(|word| {
                // Count only words that contain alphabetic characters
                let is_real_word = word.chars().any(|c| c.is_alphabetic());

                if !is_real_word {
                    // Emoji / symbols don't affect the counter
                    return word.to_string();
                }

                let output = if word_index % 2 == 1 {
                    word.to_uppercase()
                } else {
                    word.to_string()
                };

                word_index += 1;
                output
            })
            .collect();
        let cap_string = cap_string.join(" ");
        Ok(Output { cap_string })
    }

    fn validate(_input: &Self::Input, _output: &Self::Output) -> ce_core::Result<ValidationResult> {
        Ok(ValidationResult::Correct)
    }
}

impl Generate for Input {
    type Context = ();

    fn gn<R: rand::Rng>(_cx: &mut Self::Context, rng: &mut R) -> Self {
        let alphabet = "abcdefghijklmnopqrstuvwxyz";
        let num_words = rng.random_range(3..8);

        let words: Vec<String> = (0..num_words)
            .map(|_| {
                let word_len = rng.random_range(1..8);
                (0..word_len)
                    .map(|_| alphabet.chars().nth(rng.random_range(0..alphabet.len())).unwrap())
                    .collect()
            })
            .collect();

        // Randomly intersperse some emojis
        let mut result: Vec<String> = Vec::new();
        for word in words {
            result.push(word);
            // 30% chance to add a random emoji after each word
            if rng.random_range(0..100) < 30 {
                let emoji_code = rng.random_range(0x1F300..=0x1F9FF);
                if let Some(emoji) = char::from_u32(emoji_code) {
                    result.push(emoji.to_string());
                }
            }
        }

        Self {
            text: result.join(" "),
        }
    }
}
