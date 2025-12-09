#!/usr/bin/env node

const readline = require('readline');

// Initialize counter
let counter = 10;

// Configure stdin to read raw input
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding('utf8');

// Clear screen and display initial value
console.clear();
console.log(`Value: ${counter}`);
console.log('\nUse arrow keys: ← to decrement, → to increment');
console.log('Press Ctrl+C to exit\n');

// Listen for keypress events
process.stdin.on('data', (key) => {
  // Ctrl+C to exit
  if (key === '\u0003') {
    process.exit();
  }

  // Check for arrow keys (escape sequences)
  if (key === '\x1b[C') {
    // Right arrow - increment
    counter++;
    updateDisplay();
  } else if (key === '\x1b[D') {
    // Left arrow - decrement
    counter--;
    updateDisplay();
  }
});

function updateDisplay() {
  // Move cursor up 3 lines and clear from cursor to end of screen
  process.stdout.write('\x1b[3A\x1b[J');
  console.log(`Value: ${counter}`);
  console.log('\nUse arrow keys: ← to decrement, → to increment');
  console.log('Press Ctrl+C to exit\n');
}