const path = require('path')

const file = require('./file')
const docInit = require('./doc-init')
const docWatch = require('./doc-dev')
const docBuild = require('./doc-build')

const processDir = process.cwd()
let wedocConfig = null

if (file.isFile(path.join(processDir, 'wedoc.js')) || file.isFile(path.join(processDir, 'wedoc.json'))) {
  wedocConfig = require(`${processDir}/wedoc`)
  if (typeof wedocConfig === 'function') {
    wedocConfig = wedocConfig()
  }
}

module.exports = function ({docs, config, out, async}, name) {
  wedocConfig = Object.assign({}, {docs, config, out, async}, wedocConfig)
  docInit(wedocConfig)

  if (name === 'build') {
    docBuild(wedocConfig)
  }

  if (name === 'watch') {
    docWatch(wedocConfig)
  }
}