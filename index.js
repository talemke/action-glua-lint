
// GitHub Action modules
const core = require('@actions/core');
const github = require('@actions/github');

// Other modules
const exec = require('child_process');

// Other constants
const REGEX = '([a-zA-Z_\\-\\/.]+):\\s\\[([a-zA-Z]+)\\]\\sline\\s([0-9]+),\\scolumn\\s([0-9]+)\\s-\\sline\\s([0-9]+),\\scolumn\\s([0-9]+):\\s+(.*)';

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

let message = '';
let errors = {};
let errorCount = 0;
let warnings = {};
let warningCount = 0;
let elements = output.split('\n');

for (let i = 0; i < elements.length; i++) {
    let matches = elements[i].match(REGEX);
    if (!matches) continue;
    /* Matches Structure:
     * [0] = full line
     * [1] = file path
     * [2] = type (Error, Warning)
     * [3] = line (from)
     * [4] = column (from)
     * [5] = line (to)
     * [6] = column (to)
     * [7] = message
     */
    if (matches[2] == 'Error') {
        errorCount++;
        if (!errors[matches[7]]) errors[matches[7]] = 1;
        else errors[matches[7]]++;
        message += matches[0] + '\n';
    } else if (matches[2] == 'Warning') {
        warningCount++;
        if (!warnings[matches[7]]) warnings[matches[7]] = 1;
        else warnings[matches[7]]++;
    }
}



if (errorCount != 0) {
    message = ' Found ' + errorCount + ' error(s) and ' + warningCount + ' warning(s):\n' + message;
    core.setFailed(message);
}



console.log(warningCount + ' warning(s):');
for (const type in warnings) {
    console.log(type + ': ' + warnings[type] + 'x');
}
console.log('');



console.log(errorCount + ' error(s):');
for (const type in errors) {
    console.log(type + ': ' + errors[type] + 'x');
}
console.log('');



console.log('\n\n------------------------------------------');
console.log('Full Linter Output (' + elements.length + ' entries):\n\n');
console.log(output);