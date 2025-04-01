# ui-claim-counter-sign

## Summary

Application for the Access To Work Claim journey involving counter-sign using the govuk-casa framework. This allows the counter-signer to review a claim submitted by the claimant and to confirm if the submitted claim is correct or not.

## Install

```
npm install
```

## Run

```
NODE_ENV=production DEBUG=ui-claim-counter-sign*,casa*,-*debug npm start
```
Debug
```
NODE_ENV=production DEBUG=ui-claim-counter-sign*,casa* npm start
```
## Test

```
npm run test:coverage
```

## Pre-commit Hooks

Install dependencies

```shell
npm install
```

Run once (when you clone the repo):

```shell
npm run prepare
```

Now when you commit the hooks in `.husky/pre-commit` will run


Maintainer Team: Bluejay

Contributing file: ../CONTRIBUTING.md