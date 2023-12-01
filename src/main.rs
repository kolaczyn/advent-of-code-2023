use std::fs::{read_to_string};

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

fn main() {
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
