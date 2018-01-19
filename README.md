# Git Template
The Git template for cloned Repos

## What is this
This repo provides 4 git pre-commit hooks (and 1 runner hook) that will run before a commit is allowed.
The hooks are written in Bash, Python, and Javascript. All hooks should exit with success if any required modules
are not available. As the hooks are written in Python and Javascript, they will fail if Python or Node are not installed.

* **Pre-Commit Runner** - Runs the 4 main hooks (and any other approiately named pre-commit hooks)
* **Pylint** - Runs `pylint` against the files being committed
* **Flake8** - Runs `flake8` against the files being committed
* **Branch Checker** - Checks if you are committed to a _protected_ branch. Asks for verification.
* **Tag Checker** - Checks for matches of a specified tag. Asks for verification.
* **ESLint** - Runs `eslint` against any js(x)? files being committed
* **Coverage.js** - If there are modified js files and a packge.json with a `coverage` script, prompts to run coverage

## Setup
The git template may be cloned and used globally for all new cloned repos.
Alternatively you may copy the hooks locally to existing repos as you choose.

### Global setup
1. Clone the git_template repo

    ```bash
    cd ~; # You may change this location, but note the location is referenced in commands below
    git clone <this_repo> .git_template;
    cd ~/.git_template;
    ```
1. Optional: Install packages

    ```bash
    # The packages these hooks use could very well be installed by the requirements by the repo with which you are working.
    # If you'd like to install them globally:
    pip install -r requirements.txt
    npm install --save-dev eslint
    ```

1. Set up the global template

    ```bash
    git config --global init.templatedir '~/.git_template'
    ```

1. Specify the flake8 hook settings

    ```bash
    git config --global --bool flake8.strict true # Requires clean flake8 output for commit
    ```

1. Specify the tagmatch hook settings

    ```bash
    git config --add --global hooks.tagmatchpattern <enter a git search pattern here>
    # e.g git config --add --global hooks.tagmatchpattern jweir|todo
    ```

1. Clone your repositories. The template will be copied to your new clone.

### Local setup
1. Clone a repo of your choosing
1. Copy the runner (pre-commit) hook into your .git/hooks directory in your repo
1. Copy each additionaly hook you wish to use into the .git/hooks directory in your repo
1. If you choose to use the flake8 hook, install and setup

    ```bash
    git install flake8
    git config --local --bool flake8.strict true # Requires clean flake8 output for commit
    ```

1. If you choose to use the tagmatch hook, specify the tagmatch hook settings

    ```bash
    git config --add --local hooks.tagmatchpattern <enter a git search pattern here>
    # e.g git config --add --local hooks.tagmatchpattern jweir|todo
    ```

1. If you choose to use the pylint hook, you will need to install `pylint` and `git-pylint-commit-hook`

    ```bash
    pip install pylint
    pip install git-pylint-commit-hook
    ```

1. If you choose to use the eslint hook, you will need to install `eslint` and any dependancies

    ```bash
    npm install --save-dev eslint # Local to project install
    # OR
    npm install --global eslint # Global path install
    ```

1. If you choose to use the coverage.js hook, you will need to have node installed and have a package.json with
a `coverage` script
