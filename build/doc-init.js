let path = require('path')
let file = require('./file')
let fs = require('fs')
let shell = require('shelljs')
let esprima = require('esprima')
let estraverse = require('estraverse')
let escodegen = require('escodegen')
let templateConf = path.join(__dirname, '../doc.config.js.tpl')
let configFile = null

const configDir = path.resolve(__dirname, '../src')
module.exports = function ({config, docs = [], async: isAsync}) {
  configFile = initConf(config)
  const docFiles = getDocFiles(docs)
  const configAst = parseCodeToAST(configFile)
  const code = parseASTToCode(docFiles, configAst, isAsync)
  updateConfig(configFile, code, isAsync)
}
function initConf (config) {
  if (!config) {
    config = path.join(process.cwd(), 'doc.config.js')
  }
  if (file.isFile(config)) return config
  else {
    file.mkfile(config)
    shell.cp(templateConf, config)
    return config
  }
}
function getDocFiles (docDir) {
  const mds = {}
  docDir = Array.isArray(docDir) ? docDir : [docDir]

  docDir.forEach(dir => {
    if (!file.isDir(dir)) {
      console.log('[目录不存在]:', dir)
      process.exit(1)
    }
    Object.assign(mds, getFiles(dir))
  })

  function getFiles (dir) {
    let mds = file.getFiles(dir).filter(f => {
      return file.getExtname(f) === 'md'
    })

    return mds.reduce((res, f) => {
      let dir = path.dirname(f)
      let key = dir.substr(dir.lastIndexOf('/') + 1)
      res[key] = path.relative(configDir, f)
      return res
    }, {})
  }
  return mds
}

function parseCodeToAST (confFile) {
  let config = fs.readFileSync(confFile, 'utf-8').replace(/import/g, '__module__')
  return esprima.parseScript(config)
}

function parseASTToCode (docs, ast) {
  let keys = Object.keys(docs)
  ast = estraverse.replace(ast, {
    enter (node, parent) {
      if (node.name === 'include') {
        estraverse.replace(parent.value, {
          enter (node, parent) {
            if (node.type === 'Identifier' && parent.type === 'Property' && keys.indexOf(node.name) !== -1) {
              let path = docs[node.name]
              parent.value = esprima.parseScript(`__module__('${path}')`).body[0]
              delete docs[node.name]
            }
          }
        })
      }
    }
  })

  ast = estraverse.replace(ast, {
    enter (node, parent) {
      if (node.name === 'docs') {
        let properties = parent.value.properties.filter(prop => prop.key.name === 'include')
        let newProperties = Object.keys(docs).map(key => `${key}: __module__('${docs[key]}')`)
        if (newProperties.length) {
          newProperties = 'props = {' + newProperties.join() + '}'
          newProperties = esprima.parseScript(newProperties).body[0].expression.right.properties
          properties[0].value.properties.push(...newProperties)
        }
      }
    }
  })

  ast = estraverse.replace(ast, {
    enter (node, parent) {
      if (node.name === 'plugins') {
        estraverse.replace(parent.value, {
          enter (node) {
            if (node.type === 'Literal')
              node.value = node.value.substr(0, 1) === '/' ? node.value : path.join(path.dirname(configFile), node.value)
          }
        })
      }
    }
  })
  return escodegen.generate(ast, {indent: '  '})
}

function updateConfig (confFile, code, isAsync) {
  code = code.replace(/__module__/g, isAsync ? 'import' : 'require').replace(/;/g, '')
  file.mkfile(confFile, '/* eslint-disable */\n' + code)
  shell.cp(confFile, path.join(__dirname, '../src/doc.config.js'))
}
