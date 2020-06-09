const core = require('@actions/core');
const github = require('@actions/github');

try {
    console.log('Testing GitHub action! Success!');
} catch (error) {
    core.setFailed(error.message);
}