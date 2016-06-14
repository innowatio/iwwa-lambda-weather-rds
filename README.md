[![Build Status](https://travis-ci.org/innowatio/iwwa-lambda-weather-rds.svg?branch=master)](https://travis-ci.org/innowatio/iwwa-lambda-weather-rds)
[![codecov](https://codecov.io/gh/innowatio/iwwa-lambda-weather-rds/branch/master/graph/badge.svg)](https://codecov.io/gh/innowatio/iwwa-lambda-weather-rds)
[![Dependency Status](https://david-dm.org/innowatio/iwwa-lambda-weather-rds.svg)](https://david-dm.org/innowatio/iwwa-lambda-weather-rds)
[![devDependency Status](https://david-dm.org/innowatio/iwwa-lambda-weather-rds/dev-status.svg)](https://david-dm.org/innowatio/iwwa-lambda-weather-rds#info=devDependencies)


# iwwa-lambda-weather-rds

Lambda function for weather infos

## Deployment

This project deployment is automated with Lambdafile [`lambda-boilerplate`](https://github.com/lk-architecture/lambda-boilerplate/).

### Configuration

The following environment variables are needed to configure the function:

- `DB_USER`
- `DB_PASS`
- `DB_URL`
- `DB_NAME`

### Run test

In order to run tests locally a Postgres instance and the above environment
variables are needed.
Then, just run `npm run test` command.
