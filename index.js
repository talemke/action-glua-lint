
// Modules
const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('child_process');
const os = require('os');
const fs = require('fs');


// Other constants
const REGEX = '([a-zA-Z_\\-\\/.]+):\\s\\[([a-zA-Z]+)\\]\\sline\\s([0-9]+),\\scolumn\\s([0-9]+)\\s-\\sline\\s([0-9]+),\\scolumn\\s([0-9]+):\\s+(.*)';


// Fetch NodeJS version (and also test exec functionality)
let result = exec.execSync('node -v');
console.log('');
console.log('Repository: ' + github.context.repo.owner + '/' + github.context.repo.repo);
console.log('Commit SHA: ' + github.context.sha);
console.log('Operating System: ' + os.type() + ' ' + os.release());
console.log('Running NodeJS: ' + result.toString('utf-8').trim());
console.log('Running GLuaFixer: v1.16.0 (https://github.com/FPtje/GLuaFixer/releases/tag/1.16.0)');
console.log('Running GLua-Lint: v0.2');
console.log('');



// Download the linter
console.log('Downloading linter...');
exec.execSync('mkdir ' + __dirname + '/dependencies', { stdio: 'ignore' });
exec.execSync('wget -O ' + __dirname + '/dependencies/glualint.zip https://github.com/FPtje/GLuaFixer/releases/download/1.16.0/glualint-1.16.0-linux.zip', { stdio: 'ignore' });

console.log('Unzipping linter...');
exec.execSync('unzip ' + __dirname + '/dependencies/glualint.zip -d' + __dirname + '/dependencies');

console.log('Done!');
console.log('');



// Create the configuration
const cfg = {};
cfg.lint_maxScopeDepth = core.getInput('lint_maxScopeDepth');
cfg.lint_syntaxErrors = core.getInput('lint_syntaxErrors');
cfg.lint_syntaxInconsistencies = core.getInput('lint_syntaxInconsistencies');
cfg.lint_deprecated = core.getInput('lint_deprecated');
cfg.lint_trailingWhitespace = core.getInput('lint_trailingWhitespace');
cfg.lint_whitespaceStyle = core.getInput('lint_whitespaceStyle');
cfg.lint_beginnerMistakes = core.getInput('lint_beginnerMistakes');
cfg.lint_emptyBlocks = core.getInput('lint_emptyBlocks');
cfg.lint_shadowing = core.getInput('lint_shadowing');
cfg.lint_gotos = core.getInput('lint_gotos');
cfg.lint_doubleNegations = core.getInput('lint_doubleNegations');
cfg.lint_redundantIfStatements = core.getInput('lint_redundantIfStatements');
cfg.lint_redundantParentheses = core.getInput('lint_redundantParentheses');
cfg.lint_duplicateTableKeys = core.getInput('lint_duplicateTableKeys');
cfg.lint_profanity = core.getInput('lint_profanity');
cfg.lint_unusedVars = core.getInput('lint_unusedVars');
cfg.lint_unusedParameters = core.getInput('lint_unusedParameters');
cfg.lint_unusedLoopVars = core.getInput('lint_unusedLoopVars');
cfg.lint_ignoreFiles = [];
cfg.prettyprint_spaceAfterParens = false;
cfg.prettyprint_spaceAfterBrackets = false;
cfg.prettyprint_spaceAfterBraces = false;
cfg.prettyprint_spaceBeforeComma = false;
cfg.prettyprint_spaceAfterComma = true;
cfg.prettyprint_semicolons = false;
cfg.prettyprint_cStyle = false;
cfg.prettyprint_rejectInvalidCode = false;
cfg.prettyprint_indentation = '\t';
fs.writeFileSync(__dirname + '/dependencies/glualint.json', JSON.stringify(cfg));


// Do the actual linting
console.log('Linting ' + process.env.GITHUB_WORKSPACE + core.getInput('directory') + '...');
exec.execSync('chmod +x glualint', { cwd: __dirname + '/dependencies' });
let output;
try {
    const cmd = './glualint ' + process.env.GITHUB_WORKSPACE + core.getInput('directory') + ' --config=' + __dirname + '/dependencies/glualint.json';
    console.log('> ' + cmd);
    let result2 = exec.execSync(cmd, { cwd: __dirname + '/dependencies' });
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
    let msg = matches[7];
    if (msg.match('(Unused variable:\\s)(.*)')) {
        msg = 'Unused variable(s)';
    } else if (msg.match('(Deprecated: )(.*)')) {
        msg = 'Deprecation(s)';
    } else if (msg.match('(Empty )(elseif|else|if)( statement)')) {
        msg = 'Empty If/Else-Statement(s)';
    } else if (msg.match('(Double if statement\\. Please combine the condition of this if statement with that of the outer if statement using `and`\\.)')) {
        msg = 'Double If-Statement(s)';
    } else if (msg.match('(Variable \')(.*)(\' shadows existing binding, defined at line )([0-9]+)(, column )([0-9]+)')) {
        msg = 'Shadow existing binding(s)';
    } else if (msg.match('(Inconsistent use of \')(!|not)(\' and \')(!|not)(\')')) {
        msg = 'Inconsistent usage(s) (\'!\' and \'not\')';
    } else if (msg.match('(Inconsistent use of \')(&&|and)(\' and \')(&&|and)(\')')) {
        msg = 'Inconsistent usage(s) (\'&&\' and \'and\')';
    } else if (msg.match('(Inconsistent use of \')(\\|\\||or)(\' and \')(\\|\\||or)(\')')) {
        msg = 'Inconsistent usage(s) (\'||\' and \'or\')';
    } else if (msg.match('(Inconsistent use of \')(\\/\\/|--)(\' and \')(\\/\\/|--)(\')')) {
        msg = 'Inconsistent usage(s) (\'//\' and \'--\')';
    } else if (msg.match('(Inconsistent use of \')(~=|!=)(\' and \')(~=|!=)(\')')) {
        msg = 'Inconsistent usage(s) (\'!=\' and \'~=\')';
    } else if (msg.match('(Style: Please put some whitespace )(after|before)(.*)')) {
        msg = 'Missing whitespace(s)';
    } else if (msg.match('(Trailing whitespace)')) {
        msg = 'Trailing whitespace(s)';
    } else if (msg.match('(Unnecessary parentheses)')) {
        msg = 'Unnecessary parentheses';
    } else if (msg.match('(Inconsistent use of )(tabs|spaces)( and )(tabs|spaces)( for indentation)')) {
        msg = 'Inconsistent usage(s) (tabs and spaces)';
    } else if (msg.match('(Inconsistent use of \')(single|double)( quoted strings\' and \')(single|double)( quoted strings\')')) {
        msg = 'Inconsistent usage(s) (\' and ")';
    } else if (msg.match('(Are you Egyptian\\? What\'s with these fucking scope pyramids!\\?)')) {
        msg = 'Scope pyramid(s)';
    } else if (msg.match('(\'self.)(Entity|Weapon)(\' is the same as just \'self\' in )(SENT|SWEP)(s)')) {
        msg = 'Unnecessary member accessement(s)';
    } else if (msg.match('(Silly negation\\. Use \'~=\')')) {
        msg = 'Silly negation(s)';
    } else if (msg.match('(Don\'t use self in a non-metafunction)')) {
        msg = 'Usage of \'self\' in non-metafunction(s)';
    } else if (msg.match('(Duplicate key in table: \')(.*)(\'\\.)')) {
        msg = 'Duplicate key(s) in table(s)';
    } else {
        msg = '[UNGROUPED] ' + msg;
    }

    if (matches[2] === 'Error') {
        errorCount++;
        if (!errors[msg]) errors[msg] = 1;
        else errors[msg]++;
        message += matches[0] + '\n';

    } else if (matches[2] === 'Warning') {
        warningCount++;
        if (!warnings[msg]) warnings[msg] = 1;
        else warnings[msg]++;

    }
}



if (errorCount !== 0) {
    message = ' Found ' + errorCount + ' error(s) and ' + warningCount + ' warning(s):\n' + message;
    core.setFailed(message);
}



function printType(type, count) {
    if (count === 1) type = type.replace('(s)', '');
    else type = type.replace('(s)', 's');
    console.log('» ' + type + ': ' + count + 'x');
}



console.log(warningCount + ' warning(s):');
for (let type in warnings) {
    printType(type, warnings[type]);
}
console.log('');



console.log(errorCount + ' error(s):');
for (let type in errors) {
    printType(type, errors[type]);
}
console.log('');



console.log('------------------------------------------');
console.log('Full Linter Output (' + elements.length + ' entries):\n\n');
console.log(output);