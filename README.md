# GLua Linter

![](https://img.shields.io/github/license/TASSIA710/action-glua-lint?style=for-the-badge)
![](https://img.shields.io/github/issues/TASSIA710/action-glua-lint?style=for-the-badge)
![](https://img.shields.io/github/issues-pr/TASSIA710/action-glua-lint?style=for-the-badge)
![](https://img.shields.io/static/v1?label=Requires&message=Ubuntu%2018.04&color=orange&style=for-the-badge&logo=ubuntu)

GitHub action to lint GLua scripts.
Uses [GLuaFixer](https://github.com/FPtje/GLuaFixer) internally.

## Example workflow file

```yaml
# This is an example for a workflow file.
# Place this file in .github/workflows/glua_linter.yml

on: [push, pull_request]

jobs:
  lua_lint:
    runs-on: ubuntu-latest # The action only works on Ubuntu.
    name: GLua Linter # Name this whatever you want.
    steps:
      - name: Checkout # This step is required to clone the repository.
        id: checkout
        uses: actions/checkout@v2
      - name: Linting
        id: action-glua-lint
        # You can change v1.1.3 to a newer version or 'master.' Changing it to 'master' may cause unexpected behavior.
        uses: TASSIA710/action-glua-lint@v1.1.3
        with:
          directory: / # This is the directory to scan. If '/' is selected, it will scan the entire repository.
```

## Configuration

Basically just [look at this](https://github.com/FPtje/GLuaFixer#linter-options). All `lint_*` options are supported.
Prettyprint options aren't supported because this is a Linter and not a Prettyprinter.

**Fail on Warning:**\
You can also configure the action to fail if even a single warning occurs.
This is useful if you want to enforce consistent styles. To do so add the
`failOnWarning: true` option to the workflow file. If you choose to omit this
option, it will default to being disabled.\
([Contribution](https://github.com/TASSIA710/action-glua-lint/pull/4) by [rafraser](https://github.com/rafraser))
