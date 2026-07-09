import { description } from '../../package.json'

export default {
  title: 'Zercle Technology',
  description,
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ['link', { rel: 'icon', href: '/img/zercle_logo_on_light.png' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['meta', { property: 'og:title', content: 'Zercle Technology' }],
    ['meta', { property: 'og:description', content: description }],
    ['meta', { property: 'og:type', content: 'website' }]
  ],
  themeConfig: {
    siteTitle: 'Zercle Technology',
    socialLinks: [
      { icon: 'github', link: 'https://github.com/zercle' }
    ],
    outline: {
      level: 2,
      label: 'On this page'
    },
    search: {
      provider: 'local'
    },
    nav: [
      { text: 'Blog', link: '/blog/' },
      { text: 'About Us', link: '/about-us/' },
      { text: 'Our Services', link: '/our-services/' },
      { text: 'Contact Us', link: '/contact/' }
    ],
    sidebar: {
      '/blog/': [
        {
          text: 'Blog',
          collapsed: false,
          items: [
            { text: 'Linux Backups That Actually Work', link: '/blog/linux-backups-that-work' },
            { text: 'Why We Choose Boring Technology', link: '/blog/boring-technology' },
            { text: 'Building Observable Go Services', link: '/blog/observable-go-services' },
            { text: 'Zero-Trust Access with Cloudflare Tunnel', link: '/blog/cloudflare-tunnel-zero-trust' },
            { text: 'Graceful Shutdown in Go HTTP Servers', link: '/blog/go-graceful-shutdown' },
            { text: 'Using Cloudflare Email Routing', link: '/blog/cf-email-routing' }
          ]
        }
      ]
    }
  }
}