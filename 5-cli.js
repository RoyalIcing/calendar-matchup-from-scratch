#!/usr/bin/env node

function isLeapYear(year) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

function daysInMonth(year, month) {
  switch (month) {
    case 2:
      return isLeapYear(year) ? 29 : 28;
    case 4:
    case 6:
    case 9:
    case 11:
      return 30;
    default:
      return 31;
  }
}

function dayOfWeek(year, month, day) {
  if (month < 3) {
    month = month + 12;
    year = year - 1;
  }

  return (day + Math.floor(2.6 * (month + 1)) + year + Math.floor(year / 4) - Math.floor(year / 100) + Math.floor(year / 400) + 6) % 7 || 7;
}

const monthYearFormatter = new Intl.DateTimeFormat(undefined, {
  month: "long",
  year: "numeric",
});

const weekdayFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: "short",
});

function* renderDays(year, month) {
  for (let offset = 0; offset < 7; offset++) {
    yield weekdayFormatter.format(new Date(2000, 0, 3 + offset));
    yield " ";
  }
  yield "\n";

  let weekdayOfFirstDay = dayOfWeek(year, month, 1);
  while (weekdayOfFirstDay > 1) {
    yield "    ";
    weekdayOfFirstDay--;
  }

  const totalDays = daysInMonth(year, month);

  for (let day = 1; day <= totalDays; day++) {
    const weekday = dayOfWeek(year, month, day);
    if (weekday === 1 && day !== 1) {
      yield '\n';
    }

    yield `  ${day}`.slice(-3);
    yield ' ';
  }
}

class CalendarState {
  constructor(year, month) {
    this.year = year;
    this.month = month;
    Object.freeze(this);
  }

  previous() {
    const year = this.year - (this.month === 1 ? 1 : 0);
    const month = this.month === 1 ? 12 : this.month - 1;
    return new CalendarState(year, month);
  }

  next() {
    const year = this.year + (this.month === 12 ? 1 : 0);
    const month = this.month === 12 ? 1 : this.month + 1;
    return new CalendarState(year, month);
  }
}

const today = new Date();
const year = today.getFullYear();
const month = today.getMonth() + 1;
let state = new CalendarState(year, month);

// Configure stdin to read raw input
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding('utf8');

// Clear screen and display initial value
console.clear();
updateDisplay();

// Listen for keypress events
process.stdin.on('data', (key) => {
  // Ctrl+C to exit
  if (key === '\u0003' || key === 'q') {
    process.exit();
  }

  // Check for arrow keys (escape sequences)
  if (key === '\x1b[C') {
    // Right arrow - increment
    state = state.next();
    updateDisplay();
  } else if (key === '\x1b[D') {
    // Left arrow - decrement
    state = state.previous();
    updateDisplay();
  }
});

function updateDisplay() {
  console.clear();
  console.log('Use arrow keys: ← for previous month, → for next month');
  console.log('Press Ctrl+C to exit\n');

  const { year, month } = state;

  const monthYear = monthYearFormatter.format(new Date(year, month - 1));
  console.log(" ".repeat(14).slice(Math.floor(monthYear.length / 2)) + monthYear);

  console.log([...renderDays(year, month)].join(""))
}