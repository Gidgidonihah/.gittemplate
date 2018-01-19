#!/usr/bin/env node
/* eslint-disable no-console, no-await-in-loop */

const fs = require('fs')
const util = require('util')
const readline = require('readline')
const childProcess = require('child_process')

// We could just use execSync and spawnSync, but hey, let's play with promises
const exec = util.promisify(childProcess.exec)
const spawn = childProcess.spawn

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

async function getStagedFileCount() {
  const { stdout } = await exec('git diff --cached --name-only --diff-filter=ACM | grep ".jsx\\{0,1\\}$" | wc -l')
  const count = parseInt(stdout, 10)
  return count
}

async function checkHasCoverage() {
  const { stdout } = await exec('git rev-parse --show-toplevel')
  const packagePath = `${stdout.trim()}/package.json`
  const obj = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
  return obj.scripts.coverage !== undefined
}

async function runCoverage() {
  const yellow = '\x1b[0;93m'
  const yellowUnderline = '\x1b[4;93m'
  const validResponses = {
    y: `${yellowUnderline}Y${yellow}es`,
    n: `${yellowUnderline}N${yellow}o`,
    a: `${yellowUnderline}A${yellow}bort`,
    q: null,
  }
  let response = ''
  const validKeys = Object.keys(validResponses)
  const validChoicesTxt = `\x1b[1;33;49m[${Object.values(validResponses).filter(o => o).join('/')}]`
  while (!validKeys.includes(response.toLowerCase())) {
    response = await new Promise(resolve => (
      rl.question(`\x1b[38;5;57mWould you like to run coverage? ${validChoicesTxt}\x1b[0m `, (res) => { resolve(res) })
    ))
  }

  if (response === 'n') {
    process.exit(0)
  } else if (response !== 'y') {
    process.exit(1)
  }

  console.log('\x1b[1mPlease wait for coverage to run...\x1b[0m')

  const yarn = childProcess.spawnSync('echo', [ 'done' ], { stdio: 'inherit' })
  const res = (yarn.status === 0)
    ? spawn('yarn', [ 'coverage' ], { stdio: 'inherit' })
    : spawn('npm', [ 'run', 'coverage' ], { stdio: 'inherit' })

  const coverage = new Promise((resolve, reject) => {
    res.addListener('error', reject)
    res.addListener('exit', resolve)
  })

  await coverage
  rl.close()

  return coverage
}

async function main() {
  try {
    // Check if we have modified javascript files
    const count = await getStagedFileCount()
    if (!count) process.exit(0)

    // Check if there is a coverage command in package.json
    const hasCoverage = await checkHasCoverage()
    if (!hasCoverage) process.exit(0)

    // Ask the user if we should run coverage and follow their instructions
    const exit = await runCoverage()
    process.exit(exit)
  } catch (error) {
    rl.close()
    console.error(`\x1b[31m${error.message}\x1b[0m`)
    process.exit(1)
  }
}

main()
