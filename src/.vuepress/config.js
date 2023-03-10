const { description } = require('../../package')

module.exports = {
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: 'Zercle Technology',
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: description,

  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }]
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    repo: 'https://github.com/zercle',
    editLinks: false,
    docsDir: '',
    editLinkText: '',
    lastUpdated: false,
    search: true,
    nav: [
      {
        text: 'Blog',
        link: '/blog/',
      },
      {
        text: 'About Us',
        link: '/about-us/'
      },
      {
        text: 'Our Services',
        link: '/our-services/'
      },
      {
        text: 'Contact Us',
        link: '/contact/'
      }
    ],
    sidebar: {
      '/blog/': [
        {
          title: 'Blog',
          collapsable: false,
          children: [
            'cf-email-routing',
          ]
        }
      ],
    }
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom',
  ]
}
