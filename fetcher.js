// GET COMMAND LINE ARGUMENTS
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

// CHECK IF USER WANTS TO OVERWRITE FILE
const promptUser = (body) => {
  rl.question("File already exists! Do you want to overwrite? (Y/N) ", (answer) => {
    console.log(answer);
    if (answer === 'Y') writeFile(body);
    rl.close();
  });
};

// FUNCTION TO WRITE TO FILE
const writeFile = (body) => {
  fs.writeFile(filePath, body, (error) => {
    if (error) {
      // Handle error if the file path is invalid
      console.log("Failed to write to file");
      rl.close();
      return;
    }
    // Success!
    const stats = fs.statSync(filePath);
    const fileSizeInBytes = stats.size;
    console.log(`Downloaded and saved ${fileSizeInBytes} bytes to ${filePath}`);
    rl.close();
  });
};

// USE REQUEST LIBRARY TO MAKE HTTP REQUEST
request(URL, (error, response, body) => {

  if (error || response.statusCode !== 200) {
    console.log('error:', error);
    console.log('statusCode:', response && response.statusCode);
    rl.close();
    return;
  }
  // CHECK IF FILE EXISTS
  // If there's no error, it means that the file exists (because it was readable)
  // If there's an error, it means the file doesn't exist and therefore we can create a new file right away
  fs.readFile(filePath, 'utf8', (error) => {
    (error) ?  writeFile(body) : promptUser(body);
  });

});