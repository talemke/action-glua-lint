const core = require('@actions/core');
const github = require('@actions/github');

try {
    console.log('Testing GitHub action! Success!');

    core.setOutput('warnings', 0);
    core.setOutput('errors', 0);
} catch (error) {
    core.setFailed(error.message);
}