
// GitHub Action modules
const core = require('@actions/core');
const github = require('@actions/github');

// Other modules
const exec = require('child_process');

try {
    console.log('Linting ' + process.env.GITHUB_WORKSPACE + '...');
    exec.execSync('chmod +x ' + __dirname + '/dependencies/glualint');
    var result = exec.execSync('sudo ' + __dirname + '/dependencies/glualint ' + process.env.GITHUB_WORKSPACE).toString();

    console.log('Done! Analyzing result...');
    console.log(result);

    exec.execSync('ls', {stdio: 'inherit'});

    core.setOutput('warnings', 0);
    core.setOutput('errors', 0);
} catch (error) {
    core.setFailed(error.message);
}
