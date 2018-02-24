#!/usr/bin/env node
const path = require('path')
const commander = require('commander')
const run = require('../build/doc-run')
const init = require('../build/doc-init')
const processDir = process.cwd()

function formatDocsPath (val = '') {
  return val.split(',').map(absolutePath)
}

function absolutePath (file) {
  if (file.slice(0, 1) === '/') return file
  else return path.join(processDir, file)
}

commander
  .option('--docs <doc path>', '文档目录位置，多个目录用逗号分隔', formatDocsPath)
  .option('--config <config path>', '配置文件位置', absolutePath)
  .option('--out <out path>', '网站输出目录', absolutePath)
  .option('--async', '文档加载方式')

commander
  .command('init')
  .description('初始化配置文件')
  .action(() => init(commander))

commander
  .command('run [build|watch]')
  .description('生成文档网站')
  .action((name) => run(commander, name))

commander.parse(process.argv)
