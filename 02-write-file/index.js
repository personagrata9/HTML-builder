const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

const filePath = path.join(__dirname, 'text.txt');
fs.writeFile(filePath, '', error => {
  if (error) throw error;
}
);

rl.question('Введите текст\n', (input) => {
  if (input === 'exit') {
    rl.close();
  } else {
    const text = `${input}\n`;
    fs.appendFile(filePath, text, error => {
      if (error) throw error;
    })
  }
})

rl.on('line', (input) => {
  if (input === 'exit') {
    rl.close();
  } else {
    const text = `${input}\n`;
    fs.appendFile(filePath, text, error => {
      if (error) throw error;
    })
  }
});

rl.on('close', () => {
  console.log('Создан файл text.txt, введенный Вами текст записан в файл!');
})