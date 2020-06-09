
// GitHub Action modules
const core = require('@actions/core');
const github = require('@actions/github');

// Other modules
const exec = require('child_process');

try {
    console.log('Linting...');
    var result = exec.execSync('./dependencies/glualint').toString();

    console.log('Done! Analyzing result...');
    console.log(result);

    core.setOutput('warnings', 0);
    core.setOutput('errors', 0);
} catch (error) {
    core.setFailed(error.message);
}
