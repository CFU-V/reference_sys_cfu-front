'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_URL: '"http://127.0.0.1:8080/"',
  BASE_URL_API: '"http://127.0.0.1:7777/"',
  HOST: '"127.0.0.1"',
  PORT: '"8080"',
  VersionType: '"Alpha"',
  Version: '"5.0.0"'
})
