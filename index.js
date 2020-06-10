
// GitHub Action modules
const core = require('@actions/core');
const github = require('@actions/github');

// Other modules
const exec = require('child_process');

// Fetch NodeJS version (and also test exec functionality)
let result = exec.execSync('node -v');
console.log('Running NodeJS ' + result.toString('utf-8').trim());



// Do the actual linting
console.log('Linting ' + process.env.GITHUB_WORKSPACE + '...');
exec.execSync('chmod +x glualint', { cwd: __dirname + '/dependencies' });

let output;

try {
    let result2 = exec.execSync('./glualint ' + process.env.GITHUB_WORKSPACE, { cwd: __dirname + '/dependencies' });
    output = result2.stdout.toString().trim();
} catch (error) {
    output = error.stdout.toString().trim();
}

console.log('Done! Result:');
console.log('-------------\n');
console.log(output);

if (!output.includes('[Error]')) return;

let message = '';
let errors = 0;
let warnings = 0;
let elements = output.split('\n');

for (let i = 0; i < elements.length; i++) {
    if (elements[i].includes('[Error]')) {
        message += '\n' + elements[i];
        errors++;
    } else if (elements[i].includes('[Warning]')) {
        warnings++;
    }
}

message = 'Found ' + errors + ' error(s) and ' + warnings + ' warning(s):\n' + message;
core.setFailed(message);