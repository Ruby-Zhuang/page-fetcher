// Get command line arguments
const args = process.argv.slice(2);
const URL = args[0];
const filePath = args[1];

// Require libraries/modules
const request = require('request');
const fs = require("fs");
const readline = require('readline');

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

// Use request library to make the HTTP request
request(`${URL}`, (error, response, body) => {
  




  fs.writeFile(`${filePath}`, `${body}`, (error) => {
    if (error) {
      // Handle error
      console.log("Failed to write to file");
      return;
    }
    // Success!
    const stats = fs.statSync(`${filePath}`);
    const fileSizeInBytes = stats.size;
    console.log(`Downloaded and saved ${fileSizeInBytes} bytes to ${filePath}`);
  });
});

// console.log('error:', error); // Print the error if one occurred
// console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
// console.log('body:', body); // Print the HTML for the Google homepage.