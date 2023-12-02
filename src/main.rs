use std::fs::read_to_string;
use regex::Regex;

struct Turn {
    red: i32,
    blue: i32,
    green: i32
}

struct Game {
    num: i32,
    turn: Vec<Turn>
}

fn load_lines() -> Vec<String> {
    let file = read_to_string("./input.txt").expect("Input file not found");
    let lines = file.split('\n').map(|x| String::from(x)).collect();
    lines
}

fn extract_game_number(line: &str) -> Option<i32> {
    let parts: Vec<&str> = line.split(":").collect();
    match parts.first() {
        Some(x) => {
            let num_part: Vec<&str> = x.split(" ").collect();
            match num_part.last() {
                Some(y) => {
                    let num: Option<i32> = y.parse().ok();
                    num
                }
                None => None
            }
        }
        _ => None,
    }
}

fn line_to_game(line: &str) -> Game {
    unimplemented!()
}


fn main() {
    let re = Regex::new(r"Game (\d): (.*)").unwrap();
    let lines = load_lines();
    let lol = re.captures(lines.first().unwrap());
    let first = lol.unwrap();
    // let game_numbers = lines.iter().map(|x| extract_game_number(x));
    // for line in game_numbers {
    //     println!("{:?}", line);
    // }
}