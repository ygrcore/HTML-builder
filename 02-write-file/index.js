const { stdin: input, stdout: output } = require('node:process');
const fs = require('fs');
const path = require('path');
const readline = require('node:readline');

fs.appendFile(path.join(__dirname, 'notes.txt'), '', err => {
  if (err) throw err;
  output.write('Write a text?' + '\n');
})

function farewellMessage() {
  output.write('You have finished executing the program, please check the text file');
  process.exit();
}
const rl = readline.createInterface({ input, output });

rl.on('line', (input) => {
  if (input === 'exit') {
    farewellMessage();
  }
  fs.appendFile(path.join(__dirname, 'notes.txt'), `${input}\n`, (err) => {
    if (err) throw err;
  });
});

rl.on('close', () => farewellMessage());