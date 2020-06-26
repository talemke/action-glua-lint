# GLua Linter

![](https://img.shields.io/github/license/TASSIA710/action-glua-lint?style=for-the-badge)
![](https://img.shields.io/github/issues/TASSIA710/action-glua-lint?style=for-the-badge)
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
        uses: TASSIA710/action-glua-lint@v0.2 # You can change v0.2 to a newer version or 'master.' Changing it to 'master' may cause bugs.
        with:
          directory: / # This is the directory to scan. If '/' is selected, it will scan the entire repository.
```
