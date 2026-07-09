import { test, expect, type ConsoleMessage } from '@playwright/test'

const NAV_LINKS = [
  { name: 'Blog', href: '/blog/' },
  { name: 'About Us', href: '/about-us/' },
  { name: 'Our Services', href: '/our-services/' },
  { name: 'Contact Us', href: '/contact/' },
] as const

test.describe('Zercle VitePress site', () => {
  test.describe('Home page', () => {
    test('renders hero, logo, and CTAs', async ({ page }) => {
      await page.goto('/')

      await expect(page.getByRole('heading', { name: 'Zercle Technology', level: 1 }))
        .toBeVisible()
      await expect(page.getByText('Software, scaled with intent', { exact: true }))
        .toBeVisible()
      await expect(page.getByRole('img', { name: 'Zercle Technology logo' }))
        .toHaveAttribute('src', /\/img\/zercle_logo_on_light\.png$/)

      const servicesCta = page.getByRole('link', { name: 'Our Services' }).first()
      const contactCta = page.getByRole('link', { name: 'Contact Us' }).first()
      await expect(servicesCta).toBeVisible()
      await expect(contactCta).toBeVisible()
      await expect(servicesCta).toHaveAttribute('href', '/our-services/')
      await expect(contactCta).toHaveAttribute('href', '/contact/')
    })
  })

  test.describe('Top navigation', () => {
    test('exposes the four expected nav links', async ({ page }) => {
      await page.goto('/')

      const nav = page.getByRole('navigation', { name: 'Main Navigation' })
      await expect(nav).toBeVisible()

      for (const { name, href } of NAV_LINKS) {
        const link = nav.getByRole('link', { name, exact: true })
        await expect(link).toBeVisible()
        await expect(link).toHaveAttribute('href', href)
      }
    })
  })

  test.describe('Section pages', () => {
    const pages = [
      { url: '/about-us/', h1: 'About Us' },
      { url: '/our-services/', h1: 'Our Services' },
      { url: '/contact/', h1: 'Contact Us' },
      { url: '/blog/', h1: 'Blog' },
    ]

    for (const { url, h1 } of pages) {
      test(`${url} returns 200 and renders H1 "${h1}"`, async ({ page }) => {
        const response = await page.goto(url)
        expect(response, `navigation to ${url} produced no response`).not.toBeNull()
        expect(response!.status(), `unexpected status for ${url}`).toBe(200)
        await expect(page.getByRole('heading', { name: h1, level: 1 })).toBeVisible()
      })
    }
  })

  test.describe('Contact page', () => {
    test('exposes a mailto link to contact@zercle.tech', async ({ page }) => {
      await page.goto('/contact/')
      const mailto = page.locator('a[href="mailto:contact@zercle.tech"]')
      await expect(mailto.first()).toBeVisible()
    })
  })

  test.describe('Blog article', () => {
    test('cf-email-routing is reachable from the blog index and renders its H1', async ({ page }) => {
      await page.goto('/blog/')
      const articleLink = page.getByRole('link', {
        name: /Using Cloudflare Email Routing/,
      })
      await expect(articleLink).toBeVisible()
      await expect(articleLink).toHaveAttribute('href', '/blog/cf-email-routing')

      await articleLink.click()
      await page.waitForURL('**/blog/cf-email-routing')
      await expect(
        page.getByRole('heading', { name: 'Using Cloudflare Email Routing', level: 1 }),
      ).toBeVisible()

      const direct = await page.goto('/blog/cf-email-routing')
      expect(direct, 'direct navigation to article produced no response').not.toBeNull()
      expect(direct!.status(), 'blog article navigation should be 200').toBe(200)
      await expect(
        page.getByRole('heading', { name: 'Using Cloudflare Email Routing', level: 1 }),
      ).toBeVisible()
    })
  })

  test.describe('Global footer', () => {
    test('shows cc-by-4.0 attribution and a link to the Zercle GitHub', async ({ page }) => {
      await page.goto('/about-us/')

      const footer = page.locator('footer.vp-footer')
      await expect(footer).toBeVisible()
      await expect(footer).toContainText('cc-by-4.0')
      const ghLink = footer.locator('a[href="https://github.com/zercle"]')
      await expect(ghLink).toBeVisible()
      await expect(ghLink).toContainText('Zercle Technology')
    })
  })

  test.describe('Console health', () => {
    test('home and about-us pages have no console errors or uncaught page errors', async ({ page }) => {
      const consoleErrors: string[] = []
      const pageErrors: string[] = []

      const collectConsole = (msg: ConsoleMessage) => {
        if (msg.type() === 'error') consoleErrors.push(msg.text())
      }
      const collectPageError = (err: Error) => {
        pageErrors.push(err.message)
      }

      page.on('console', collectConsole)
      page.on('pageerror', collectPageError)

      for (const path of ['/', '/about-us/'] as const) {
        await page.goto(path)
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      }

      page.off('console', collectConsole)
      page.off('pageerror', collectPageError)

      expect(consoleErrors, `console errors: ${consoleErrors.join(' | ')}`).toEqual([])
      expect(pageErrors, `page errors: ${pageErrors.join(' | ')}`).toEqual([])
    })
  })
})
