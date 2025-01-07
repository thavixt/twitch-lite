import fs from 'fs';
import path from 'path';

// Replace these with the string you want to find and the string you want to replace it with
const targetString = '="/';
const replacementString = '="./';

// Function to replace strings in a file
function replaceInFile(filePath) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading file ${filePath}:`, err);
      return;
    }

    // Check if the file contains the target string
    if (data.includes(targetString)) {
      // Replace the target string with the replacement
      const updatedData = data.replace(new RegExp(targetString, 'g'), replacementString);

      // Write the updated data back to the file
      fs.writeFile(filePath, updatedData, 'utf8', (err) => {
        if (err) {
          console.error(`Error writing to file ${filePath}:`, err);
        } else {
          console.log(`Replaced "${targetString}" with "${updatedData}" in file ${filePath}`);
        }
      });
    }
  });
}

// Function to read the current directory and find all .js files
function replaceInAllHTMLFiles() {
  fs.readdir('.', (err, files) => {
    if (err) {
      console.error('Error reading the directory:', err);
      return;
    }

    // Filter for only .js files
    const jsFiles = files.filter(file => file.endsWith('.html'));

    // Replace the target string in each .js file
    jsFiles.forEach(file => {
      const filePath = path.join('dist/', file);
      replaceInFile(filePath);
    });
  });
}

// Start the replacement process
replaceInAllHTMLFiles();