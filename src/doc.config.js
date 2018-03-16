/* eslint-disable */
module.exports = {
  header: {
    logo: {
      image: 'https://img.yzcdn.cn/public_files/2017/12/18/fd78cf6bb5d12e2a119d0576bedfd230.png',
      title: 'ZanUI 小程序',
      href: 'http://www.youzanyun.com/zanui'
    },
    nav: {
      lang: {
        text: 'En',
        from: 'zh-CN',
        to: 'en-US'
      },
      github: 'https://github.com/youzan/zanui-weapp'
    }
  },
  footer: {
    github: 'https://github.com/youzan/zanui-weapp',
    nav: {
      'React 组件库': 'https://www.youzanyun.com/zanui/zent',
      'Vue 组件库': 'https://www.youzanyun.com/zanui/vant',
      意见反馈: 'https://github.com/youzan/zanui-weapp/issues',
      开发指南: 'https://github.com/youzan/zanui-weapp/blob/dev/.github/CONTRIBUTING.zh-CN.md',
      加入我们: 'https://job.youzan.com'
    }
  },
  plugins: [require('/Users/jdliu/projects/youzan/zanui-weapp/website/plugins/wxapp-demo')],
  docs: {
    base: 'zanui',
    default: 'icon',
    category: [
      {
        base: 'base',
        label: '基础',
        include: {
          icon: require('../../zanui-weapp/packages/icon/README.md'),
          btn: require('../../zanui-weapp/packages/btn/README.md'),
          helper: require('../../zanui-weapp/packages/helper/README.md')
        }
      },
      {
        base: 'layout',
        label: '布局',
        include: {
          row: require('../../zanui-weapp/packages/row/README.md'),
          cell: require('../../zanui-weapp/packages/cell/README.md'),
          card: require('../../zanui-weapp/packages/card/README.md'),
          panel: require('../../zanui-weapp/packages/panel/README.md')
        }
      },
      {
        base: 'form',
        label: '表单',
        include: {
          field: require('../../zanui-weapp/packages/field/README.md'),
          switch: require('../../zanui-weapp/packages/switch/README.md'),
          select: require('../../zanui-weapp/packages/select/README.md'),
          stepper: require('../../zanui-weapp/packages/stepper/README.md')
        }
      },
      {
        base: 'view',
        label: '展示',
        include: {
          tag: require('../../zanui-weapp/packages/tag/README.md'),
          badge: require('../../zanui-weapp/packages/badge/README.md'),
          capsule: require('../../zanui-weapp/packages/capsule/README.md'),
          noticebar: require('../../zanui-weapp/packages/noticebar/README.md'),
          steps: require('../../zanui-weapp/packages/steps/README.md')
        }
      },
      {
        base: 'interactive',
        label: '交互',
        include: {
          toast: require('../../zanui-weapp/packages/toast/README.md'),
          popup: require('../../zanui-weapp/packages/popup/README.md'),
          dialog: require('../../zanui-weapp/packages/dialog/README.md'),
          toptips: require('../../zanui-weapp/packages/toptips/README.md'),
          tab: require('../../zanui-weapp/packages/tab/README.md'),
          loadmore: require('../../zanui-weapp/packages/loadmore/README.md'),
          actionsheet: require('../../zanui-weapp/packages/actionsheet/README.md')
        }
      }
    ],
    include: {}
  }
}