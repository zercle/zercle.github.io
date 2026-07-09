---
title: Using Cloudflare Email Routing
description: How Cloudflare Email Routing keeps your personal inbox private, for free — a practical setup guide.
date: 2025-09-15
author: Zercle Technology
tags: [cloudflare, email, guides]
---

# Using Cloudflare Email Routing

## What's Cloudflare Email Routing

Cloudflare Email Routing is designed to simplify the way you create and manage email addresses, without needing to keep an eye on additional mailboxes. With Email Routing, you can create any number of custom email addresses to use in situations where you do not want to share your primary email address, such as when you subscribe to a new service or newsletter. Emails are then routed to your preferred email inbox, without you ever having to expose your primary email address.

Email Routing is free and private by design. Cloudflare will not store or access the emails routed to your inbox. It is available to all Cloudflare customers [using Cloudflare as an authoritative nameserver](https://developers.cloudflare.com/dns/zone-setups/full-setup/).

## Why use it

The short version: **privacy, cost, and convenience**.

- **Privacy.** Your real inbox address never has to leave your hands. Each service you sign up for can get its own address — `github@yourdomain`, `newsletter@yourdomain`, `bank@yourdomain` — and if one of them starts leaking spam or gets breached, you can disable just that one address without affecting anything else.
- **Free.** Email Routing is included on every Cloudflare-managed domain at no additional cost. There's no mailbox quota, no per-forward fee, and nothing to maintain.
- **No extra mailbox.** You don't run a mail server, don't pay for Google Workspace or iCloud+, and don't configure an IMAP client. Everything ends up in the inbox you already use.
- **Unlimited custom addresses.** Create as many forwarding addresses as you need. They're MX records and dashboard entries, not paid seats.

## Prerequisites

You only need two things:

1. A **Cloudflare account**.
2. A **domain whose authoritative DNS is delegated to Cloudflare** (i.e. the domain uses Cloudflare's nameservers, not your registrar's). If your domain is still pointing at the registrar's nameservers, Email Routing will be disabled in the dashboard until you move it.

You do **not** need to host a website, change your existing email provider, or move any other DNS records. Cloudflare Email Routing only handles the `MX` records and routing rules for your domain.

## Setting it up

The full flow lives in the Cloudflare dashboard — no CLI or API calls required.

1. In the Cloudflare dashboard, select your domain.
2. In the left sidebar, click **Email** → **Email Routing**.
3. Cloudflare will offer to **enable Email Routing** for the domain. Accept; it will add the required `MX` records automatically.
4. Click **Destination addresses** and **Add destination address**. Enter the personal inbox you actually read mail at (e.g. your Gmail or iCloud address). Cloudflare emails that address a verification link — click it to confirm.
5. Wait a few minutes for DNS to propagate. The destination address will show as **Verified** in the dashboard.

That's the setup. From here, every address you create on your domain will forward into that verified inbox.

## Routing rules

Email Routing has two kinds of rules, both configured on the same dashboard page:

- **Custom address rules.** You create a specific address (e.g. `hello@yourdomain.com`) and choose which verified destination it forwards to. Use this when you want a stable, identifiable address — for a project, a client, or a service that ships email you'd actually want to read.
- **Catch-all rule.** A single toggle that forwards **every other address** on your domain — anything that doesn't match a custom rule — to a destination. This is the killer feature for newsletters, sign-ups, and one-off forms: invent `randomstring@yourdomain.com` on the spot, and it just works.

Both rule types can be enabled, disabled, or deleted independently. You can also edit or remove a custom address at any time; sending mail to a deleted address will start bouncing.

## Tips

- **One address per service.** Treat each signup like its own inbox. `github@`, `amazon@`, `bank@` — when one starts spamming or selling your address, kill the rule and move on. Your real address never has to change.
- **Use catch-all for throwaway sign-ups.** Anything where you'll never need to email them back is a candidate for an invented address under the catch-all. It's faster than creating a new rule.
- **Don't disable your existing email.** Email Routing runs at the `MX` layer for your *domain*. If you already use Google Workspace, Fastmail, or another provider on the same domain, Email Routing will conflict with it — pick one. The easiest setup is Email Routing for forwarding only, with your real address on a different domain.
- **SPF / DKIM stay correct.** When Cloudflare adds the `MX` records for Email Routing, it can also publish the right SPF/DKIM records for forwarding (the `include:_spf.mx.cloudflare.net` mechanism). You don't need to edit your DNS by hand.

## Conclusion

Cloudflare Email Routing is one of the most quietly useful features on Cloudflare's free tier. If you own a domain and you've ever hesitated to hand out your real email address, it's a five-minute setup that solves the problem permanently — no new mailbox, no extra subscription, and full control over every address your domain exposes.