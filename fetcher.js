// 1) GET COMMAND LINE ARGUMENTS
const args = process.argv.slice(2);
const URL = args[0];
const filePath = args[1];

// REQUIRE LIBRARY & MODULES
const request = require('request');
const fs = require("fs");
const readline = require('readline');

// CREATE READLINE.INTERFACE INSTANCE TO READ DATA FROM A READABLE STREAM
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 5a) CHECK IF USER WANTS TO OVERWRITE FILE
const promptUser = (filePath, body) => {
  rl.question("File already exists! Do you want to overwrite? (Y/N) ", (answer) => {
    console.log(answer);
    if (answer === 'Y') writeFile(filePath, body);
    rl.close();
  });
};

// 5b) FUNCTION TO WRITE TO FILE
const writeFile = (filePath, body) => {
  fs.writeFile(filePath, body, (error) => {
    const stats = fs.statSync(filePath);
    const fileSizeInBytes = stats.size;

    if (error) {
      // Handle error if the file path is invalid
      console.log("Failed to write to file");
      rl.close();
      return;
    }
    // Success!
    console.log(`Downloaded and saved ${fileSizeInBytes} bytes to ${filePath}`);
    rl.close();
  });
};

const makeRequest = (URL, filePath, fileExistsCallback, createFileCallback) => {
  request(URL, (error, response, body) => {
  
    // 3) CHECK IF URL ENTERED IS ACCURATE
    if (error || response.statusCode !== 200) {
      console.log('error:', error);
      console.log('statusCode:', response && response.statusCode);
      rl.close();
      return;
    }
    // 4) CHECK IF FILE EXISTS
    // 4a) If there's no error, it means that the file exists (because it was readable)
    // 4b) If there's an error, it means the file doesn't exist and therefore we can create a new file right away (skip 5a)
    fs.readFile(filePath, 'utf8', (error) => {
      (error) ? createFileCallback(filePath, body) : fileExistsCallback(filePath, body);
    });
  });
};

// 2) USE REQUEST LIBRARY TO MAKE HTTP REQUEST
makeRequest(URL, filePath, promptUser, writeFile);

// Anything that you use inside the function should be passed in as argument (idepotency)
// best practices, refactor
// should writeFile and promptUser be based in as callbacks? and request be in another function?