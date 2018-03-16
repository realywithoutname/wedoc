let path = require('path')
let file = require('./file')
let fs = require('fs')
let shell = require('shelljs')
let esprima = require('esprima')
let estraverse = require('estraverse')
let escodegen = require('escodegen')
let templateConf = path.join(__dirname, '../doc.config.js.tpl')
let configFile = null

let configdir

module.exports = function ({config, docs = [], async: isAsync}) {
  configFile = initConf(config)
  configdir = path.dirname(configFile)
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
      res[key] = 'REGIN_PLUGIN_PATH$$' + f + '$$./' + path.relative(configdir, f) + '$$'
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
            if (node.type === 'Identifier' && parent.type === 'Property' && keys.indexOf(node.name) === -1) {
              let _file = parent.value.arguments[0].value
              let _path = _file.substr(0, 1) === '/' ? _file : path.join(configdir, _file)
              console.log(_path, _file)
              if (!_file || !file.isFile(_path)) {
                throw new Error('找不到文件' + _file)
              }

              _path = 'REGIN_PLUGIN_PATH$$' + _path + '$$' + _file + '$$'
              parent.value = esprima.parseScript(`__module__('${_path}')`).body[0]
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
            if (node.type === 'Literal') {
              node.value = 'REGIN_PLUGIN_PATH$$' + (node.value.substr(0, 1) === '/' ? node.value : path.join(path.dirname(configFile), node.value)) + '$$' + node.value + '$$'
            }
          }
        })
      }
    }
  })
  return escodegen.generate(ast, {indent: '  '})
}

function updateConfig (confFile, code, isAsync) {
  code = code.replace(/__module__/g, isAsync ? 'import' : 'require').replace(/;/g, '')
  let realyCode = code.replace(/REGIN_PLUGIN_PATH\$\$(.+?)\$\$.*?\$\$/g, function($, $1) {
    return $1
  })
  code = code.replace(/REGIN_PLUGIN_PATH\$\$.+?\$\$(.*?)\$\$/g, function($, $1) {
    return $1
  })
  file.mkfile(confFile, '/* eslint-disable */\n' + code)
  file.mkfile(path.join(__dirname, '../src/doc.config.js'), '/* eslint-disable */\n' + realyCode)
}
