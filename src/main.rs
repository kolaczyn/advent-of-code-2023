use std::fs::{File, read_to_string};

const ONE: &str = "one";
const TWO: &str = "two";
const THREE: &str = "three";
const FOUR: &str = "four";
const FIVE: &str = "five";
const SIX: &str = "six";
const SEVEN: &str = "seven";
const EIGHT: &str = "eight";
const NINE: &str = "nine";

fn str_to_num(s: &str) -> Option<u32> {
    if s.contains(ONE) { return Some(1); }
    if s.contains(TWO) { return Some(2); }
    if s.contains(THREE) { return Some(3); }
    if s.contains(FOUR) { return Some(4); }
    if s.contains(FIVE) { return Some(5); }
    if s.contains(SIX) { return Some(6); }
    if s.contains(SEVEN) { return Some(7); }
    if s.contains(EIGHT) { return Some(8); }
    if s.contains(NINE) { return Some(9); }
    return None;
}

fn digits_to_number(digits: &Vec<u32>) -> u32 {
    match digits.iter().count() {
        0 => 0,
        1 => digits[0] * 10 + digits[0],
        _ => digits[0] * 10 + digits.last()
            .expect("We know that the length of vector is at least 2, so the last element should exist"),
    }
}

fn extract_digits_from_line(line: &str) -> Vec<u32> {
    line.chars()
        .filter_map(|x| x.to_digit(10))
        .collect()
}

fn extract_digits_from_line_v2(line: &str) -> Vec<u32> {
    let mut out_vec: Vec<u32> = Vec::new();
    let mut curr_str: String = String::from("");

    for ch in line.chars() {
        // println!("{:?}", curr_str);
        match ch.to_digit(10) {
            Some(digit) => {
                curr_str = String::from("");
                out_vec.push(digit);
            }
            None => {
                curr_str.push(ch);
                match str_to_num(&curr_str) {
                    Some(digit) => {
                        // we have to account for string like "oneight". "we just need to keep one last character
                        curr_str = curr_str.chars().last()
                            // I will burn in hell for this
                            .unwrap()
                            .to_string();
                        out_vec.push(digit);
                    }
                    None => {}
                }
            }
        }
    }
    return out_vec;
}

fn part_one() {
    let file = read_to_string("./input.txt").expect("Input file not found");
    let lines = file.split('\n');

    let extracted: Vec<u32> = lines.clone()
        .map(|line| extract_digits_from_line(line))
        .map(|x| digits_to_number(&x))
        .collect();

    let sum: u32 = lines
        .map(|line| extract_digits_from_line(line))
        .map(|x| digits_to_number(&x))
        .sum::<u32>();

    println!("Raw: {:?}", extracted);
    println!("The sum is {:?}", sum);
}

fn part_two() {
    let file = read_to_string("./input.txt").expect("Input file not found");
    let lines = file.split('\n');

    let step_one: Vec<Vec<u32>> = lines.clone()
        .map(|line| extract_digits_from_line_v2(line))
        .collect();

    let sum: u32 = lines
        .map(|line| extract_digits_from_line_v2(line))
        .map(|x| digits_to_number(&x))
        .sum::<u32>();

    for (i, x) in step_one.iter().enumerate()
    {
        println!("{:?}: {:?}", i + 1, x);
    }
    println!("--------------------------");
    println!("The sum is {:?}", sum);
}

fn main() {
    part_two();
}