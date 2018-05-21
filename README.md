# 关于

一个基于 Vue 的简单易用的网页文档生成工具

## 使用

### 安装

```bash
  npm install wedoc
```

### 生成默认配置

```bash
 wedoc init --config ./doc.config.js --docs ./packages,./components --async
```

### 生成网站代码

```bash
 wedoc init --config ./doc.config.js --docs ./packages,./components --out ./dist --async
```

## 配置

* 命令

  * init 根据参数初始化配置文件
  * run <build | watch> 生成文档网站

* 参数

  | 名称   | 类型    | 描述                                                                      |
  | ------ | ------- | ------------------------------------------------------------------------- |
  | docs   | Array   | 文档目录位置，多个目录用逗号分隔                                          |
  | config | String  | 配置文件位置                                                              |
  | out    | String  | 网站输出目录                                                              |
  | async  | Boolean | 文档加载方式，`true` 使用 `import` 加载文档内容；`false` 则使用 `require` |

* 另一种方式在运行命令的目录中创建 `wedoc.js` 或 `wedoc.json`

  | 名称            | 类型     | 描述                                                                        |
  | --------------- | -------- | --------------------------------------------------------------------------- |
  | docs            | Array    | 文档目录位置，多个目录用逗号分隔                                            |
  | config          | String   | 配置文件位置                                                                |
  | out             | String   | 网站输出目录                                                                |
  | async           | Boolean  | 文档加载方式，`true` 使用 `import` 加载文档内容；`false` 则使用 `require`   |
  | markdown        | Object   | 对于文档在转换为 HTML 时的操作                                              |
  | markdown.before | Function | 对于文档在转换为 HTML 时的前置操作，参数为文档文本，上下文为 webpack 实例   |
  | markdown.after  | Function | 对于文档在转换为 HTML 时的后置操作，参数为 HTML 文本，上下文为 webpack 实例 |
  | webpack         | Object   | webpack 配置                                                                |

> async 为 `true` 时可以从 markdown 文件中读取标题作为侧边栏菜单，否则使用文件夹名称或文件名称作为侧边栏菜单

* 配置文件 - doc.config.js

> 文档配置，因为配置需要用到 require 或 import，所以需要使用 js, 而不是 json。

| 字段                    | 类型   | 含义                                                                     |
| ----------------------- | ------ | ------------------------------------------------------------------------ |
| docs                    | Object | 文档内容和结构配置                                                       |
| name                    | String | 网站 title，默认为 header.logo.title                                     |
| docs.base               | String | 文档根路由                                                               |
| docs.default            | String | 文档首页                                                                 |
| docs.include            | Object | markdown 文档集合（文档的 key 不支持 '-'，文件中的 '-' 将被替换为 '\_'） |
| docs.category           | Array  | 文档分类                                                                 |
| docs.category[].base    | String | 分类子路由                                                               |
| docs.category[].babel   | String | 分类名称                                                                 |
| docs.category[].include | Object | markdown 文档集合                                                        |
| header                  | Object | 默认使用 vant-doc 配置                                                   |
| footer                  | Object | 默认使用 vant-doc 配置                                                   |
| lang                    | Object | 多语言支持，使用改属性，前面的属性必须作为该属性的属性                   |
| plugins                 | Array  | 自定义的 vue 组件，支持在 markdown 中使用自定义的组件                    |

> 多语言支持可以设置 `lang` 字段，

```js
/* eslint-disable */
module.exports = {
  plugins: [require('~PATH~/zanui-weapp/website/plugins/wxapp-demo')],
  lang: {
    en: {
      docs: {
        base: 'zanui',
        category: [
          {
            base: 'base',
            label: '基础',
            include: {},
          },
          {
            base: 'layout',
            label: '布局',
            include: {},
          },
        ],
        include: {},
      },
    },
    'zh-cn': {
      name: 'ZanUI 小程序',
      header: {
        logo: {
          image:
            'https://img.yzcdn.cn/public_files/2017/12/18/fd78cf6bb5d12e2a119d0576bedfd230.png',
          title: 'ZanUI 小程序',
          href: 'http://www.youzanyun.com/zanui',
        },
        nav: {
          lang: {
            text: 'En',
            from: 'zh-CN',
            to: 'en-US',
          },
          github: 'https://github.com/youzan/zanui-weapp',
        },
      },
      footer: {
        github: 'https://github.com/youzan/zanui-weapp',
        nav: {
          'React 组件库': 'https://www.youzanyun.com/zanui/zent',
          'Vue 组件库': 'https://www.youzanyun.com/zanui/vant',
          意见反馈: 'https://github.com/youzan/zanui-weapp/issues',
          开发指南:
            'https://github.com/youzan/zanui-weapp/blob/dev/.github/CONTRIBUTING.zh-CN.md',
          加入我们: 'https://job.youzan.com',
        },
      },
      docs: {
        base: 'zanui',
        default: 'intro',
        category: [
          {
            base: 'base',
            label: '基础',
            include: {
              intro: require('~PATH~/intro.md'),
            },
          },
          {
            base: 'layout',
            label: '布局',
            include: {},
          },
        ],
        include: {},
      },
    },
  },
};
```

## 改进

* watch 目录的变化
* 同一目录支持多个文档
