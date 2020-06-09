
// GitHub Action modules
const core = require('@actions/core');
const github = require('@actions/github');

// Other modules
const exec = require('child_process');

// Fetch NodeJS version (and also test exec functionality)
let result = exec.execSync('node -v');
console.log('Running 8 NodeJS ' + result.toString('utf-8').trim());



// Do the actual linting
console.log('Linting ' + process.env.GITHUB_WORKSPACE + '...');
exec.execSync('chmod +x glualint', { cwd: __dirname + '/dependencies' });

let output;

try {
    let result2 = exec.execSync('./glualint ' + process.env.GITHUB_WORKSPACE, { cwd: __dirname + '/dependencies' });
    output = result2.stdout.toString('utf-8').trim();
} catch (error) {
    console.log(error);
    output = error.stdout.toString('utf-8').trim();
}

console.log('Done! Result:');
console.log('-------------\n');
console.log(output);

core.setOutput('warnings', 0);
core.setOutput('errors', 0);