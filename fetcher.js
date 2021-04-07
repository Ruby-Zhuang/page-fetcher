// Get command line arguments
const args = process.argv.slice(2);
const URL = args[0];
const filePath = args[1];

// Require libraries/modules
const request = require('request');
const fs = require("fs");
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to prompt user for input
const promptUser = (body) => {
  let overwrite = true;
  rl.question("File already exists! Do you want to overwrite? (Y/N) ", (answer) => {
    console.log(answer);
    overwrite = (answer === 'Y');
    if (overwrite) writeFile(body);
    rl.close();
  });
};

// Function to write to file
const writeFile = (body) => {
  fs.writeFile(`${filePath}`, `${body}`, (error) => {
    if (error) {
      // Handle error
      console.log("Failed to write to file");
      rl.close();
      return;
    }
    // Success!
    const stats = fs.statSync(`${filePath}`);
    const fileSizeInBytes = stats.size;
    console.log(`Downloaded and saved ${fileSizeInBytes} bytes to ${filePath}`);
    rl.close();
  });
};

// Use request library to make the HTTP request
request(`${URL}`, (error, response, body) => {

  if (error || response.statusCode !== 200) {
    console.log('error:', error);
    console.log('statusCode:', response && response.statusCode);
    rl.close();
    return;
  }
  // If there's no error, it means that the file exists (because it was readable)
  // If there's an error, it means the file doesn't exist and therefore we can create a new file right away
  fs.readFile(`${filePath}`, 'utf8', (error) => {
    (error) ?  writeFile(body) : promptUser(body);
  });

});