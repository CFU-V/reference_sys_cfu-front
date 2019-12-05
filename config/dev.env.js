'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_URL: '"https://doctracker.cfuv-it.ru/"',
  BASE_URL_API: '"https://doctracker.cfuv-it.ru/api/"',
  HOST: '"127.0.0.1"',
  PORT: '"8080"',
  VersionType: '"Alpha"',
  Version: '"7.0.0"'
})
