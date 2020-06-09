
// GitHub Action modules
const core = require('@actions/core');
const github = require('@actions/github');

// Other modules
const exec = require('child_process');

// Fetch NodeJS version (and also test exec functionality)
let result = exec.execSync('node -v');
console.log('Running NodeJS ' + result.toString('utf8'));



// Do the actual linting
console.log('Linting ' + process.env.GITHUB_WORKSPACE + '...');
result = exec.execSync('sudo ' + __dirname + '/dependencies/glualint ' + process.env.GITHUB_WORKSPACE);

console.log('Done! Analyzing result...');
console.log(result.toString('utf8'));

core.setOutput('warnings', 0);
core.setOutput('errors', 0);