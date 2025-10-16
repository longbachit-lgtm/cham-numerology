/**
 * Numerology calculation service using Pythagoras system
 */

// Letter to number mapping (A=1, B=2, ..., Z=26, then cycle 1-9)
const LETTER_VALUES: { [key: string]: number } = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
  S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8
};

const VOWELS = ['A', 'E', 'I', 'O', 'U'];
const MASTER_NUMBERS = [11, 22, 33];

/**
 * Reduce a number to single digit, keeping master numbers
 */
export function reduceNumber(num: number, keepMaster: number[] = MASTER_NUMBERS): string {
  if (keepMaster.includes(num)) {
    return num.toString();
  }
  
  while (num > 9) {
    const sum = num.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
    if (keepMaster.includes(sum)) {
      return sum.toString();
    }
    num = sum;
  }
  
  return num.toString();
}

/**
 * Calculate Life Path number from date of birth
 */
export function calculateLifePath(dob: Date): string {
  const day = dob.getDate();
  const month = dob.getMonth() + 1;
  const year = dob.getFullYear();
  
  const daySum = day.toString().split('').reduce((acc, d) => acc + parseInt(d), 0);
  const monthSum = month.toString().split('').reduce((acc, d) => acc + parseInt(d), 0);
  const yearSum = year.toString().split('').reduce((acc, d) => acc + parseInt(d), 0);
  
  const total = daySum + monthSum + yearSum;
  return reduceNumber(total);
}

/**
 * Get numeric value of a letter
 */
function getLetterValue(letter: string): number {
  const upper = letter.toUpperCase();
  return LETTER_VALUES[upper] || 0;
}

/**
 * Calculate sum of name letters
 */
function calculateNameSum(name: string): number {
  return name
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .split('')
    .reduce((sum, letter) => sum + getLetterValue(letter), 0);
}

/**
 * Calculate Destiny/Expression number from full name
 */
export function calculateDestiny(fullName: string): string {
  const sum = calculateNameSum(fullName);
  return reduceNumber(sum);
}

/**
 * Calculate Soul Urge number (vowels only)
 */
export function calculateSoulUrge(fullName: string): string {
  const vowelSum = fullName
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .split('')
    .filter(letter => VOWELS.includes(letter))
    .reduce((sum, letter) => sum + getLetterValue(letter), 0);
  
  return reduceNumber(vowelSum);
}

/**
 * Calculate Personality number (consonants only)
 */
export function calculatePersonality(fullName: string): string {
  const consonantSum = fullName
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .split('')
    .filter(letter => !VOWELS.includes(letter))
    .reduce((sum, letter) => sum + getLetterValue(letter), 0);
  
  return reduceNumber(consonantSum);
}

/**
 * Calculate Birthday number
 */
export function calculateBirthday(dob: Date): string {
  const day = dob.getDate();
  return reduceNumber(day);
}

/**
 * Calculate Maturity number (Life Path + Destiny)
 */
export function calculateMaturity(lifePath: string, destiny: string): string {
  const sum = parseInt(lifePath) + parseInt(destiny);
  return reduceNumber(sum);
}

/**
 * Calculate Attitude number (day + month)
 */
export function calculateAttitude(dob: Date): string {
  const day = dob.getDate();
  const month = dob.getMonth() + 1;
  const sum = day + month;
  return reduceNumber(sum);
}

/**
 * Calculate Personal Year
 */
export function calculatePersonalYear(dob: Date, currentYear: number): string {
  const day = dob.getDate();
  const month = dob.getMonth() + 1;
  
  const daySum = day.toString().split('').reduce((acc, d) => acc + parseInt(d), 0);
  const monthSum = month.toString().split('').reduce((acc, d) => acc + parseInt(d), 0);
  const yearSum = currentYear.toString().split('').reduce((acc, d) => acc + parseInt(d), 0);
  
  const total = daySum + monthSum + yearSum;
  return reduceNumber(total);
}

/**
 * Calculate Personal Month
 */
export function calculatePersonalMonth(personalYear: string, currentMonth: number): string {
  const sum = parseInt(personalYear) + currentMonth;
  return reduceNumber(sum, []);
}

/**
 * Calculate Personal Day
 */
export function calculatePersonalDay(personalMonth: string, currentDay: number): string {
  const sum = parseInt(personalMonth) + currentDay;
  return reduceNumber(sum, []);
}

/**
 * Generate birth chart (frequency of each number in DOB)
 */
export function generateBirthChart(dob: Date): { [key: string]: number } {
  const dobString = `${dob.getDate()}${dob.getMonth() + 1}${dob.getFullYear()}`;
  const chart: { [key: string]: number } = {};
  
  for (let i = 1; i <= 9; i++) {
    chart[i.toString()] = 0;
  }
  
  dobString.split('').forEach(digit => {
    if (digit !== '0') {
      chart[digit] = (chart[digit] || 0) + 1;
    }
  });
  
  return chart;
}

/**
 * Generate name chart (frequency of each number in name)
 */
export function generateNameChart(fullName: string): { [key: string]: number } {
  const chart: { [key: string]: number } = {};
  
  for (let i = 1; i <= 9; i++) {
    chart[i.toString()] = 0;
  }
  
  fullName
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .split('')
    .forEach(letter => {
      const value = getLetterValue(letter);
      if (value > 0) {
        chart[value.toString()] = (chart[value.toString()] || 0) + 1;
      }
    });
  
  return chart;
}

/**
 * Calculate all core numbers for a user
 */
export function calculateCoreNumbers(fullName: string, dob: Date) {
  const lifePath = calculateLifePath(dob);
  const destiny = calculateDestiny(fullName);
  const soul = calculateSoulUrge(fullName);
  const personality = calculatePersonality(fullName);
  const birthday = calculateBirthday(dob);
  const maturity = calculateMaturity(lifePath, destiny);
  const attitude = calculateAttitude(dob);
  const chartBirth = generateBirthChart(dob);
  const chartName = generateNameChart(fullName);
  
  return {
    lifePath,
    destiny,
    soul,
    personality,
    birthday,
    maturity,
    attitude,
    chartBirth,
    chartName,
  };
}

/**
 * Calculate current period numbers
 */
export function calculateCurrentPeriod(dob: Date, targetDate: Date = new Date()) {
  const currentYear = targetDate.getFullYear();
  const currentMonth = targetDate.getMonth() + 1;
  const currentDay = targetDate.getDate();
  
  const personalYear = calculatePersonalYear(dob, currentYear);
  const personalMonth = calculatePersonalMonth(personalYear, currentMonth);
  const personalDay = calculatePersonalDay(personalMonth, currentDay);
  
  return {
    personalYear,
    personalMonth,
    personalDay,
  };
}
