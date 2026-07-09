---
title: Zero-Trust Access with Cloudflare Tunnel
description: Exposing internal services to the internet without opening inbound firewall ports, using cloudflared and Cloudflare Access.
date: 2026-03-05
author: Zercle Technology
tags: [cloudflare, security, infrastructure]
---

# Zero-Trust Access with Cloudflare Tunnel

We typically handle remote access by opening inbound firewall ports 80 and 443, exposing the server directly to the internet and relying on the local firewall to filter traffic. Cloudflare Tunnel changes this by establishing an outbound-only connection from our infrastructure to the Cloudflare edge, eliminating the need for inbound ports entirely.

## How a tunnel works

The `cloudflared` daemon runs on our local server and maintains persistent outbound connections to Cloudflare over QUIC or HTTP2. Because the connection is outbound-only, the server does not need a public IP address or an open inbound port; it can reside behind NAT or a restrictive firewall. When a user navigates to a configured hostname, Cloudflare routes the request back through the existing, authenticated tunnel. We manage tunnels via the Cloudflare dashboard or the CLI, and each tunnel uses a credentials file to authenticate with the Cloudflare control plane.

## Worked example

For quick testing, we use the ad-hoc tunnel command:

```bash
cloudflared tunnel --url http://localhost:8080
```

For production infrastructure, we define named tunnels in a `config.yml` file to ensure consistent ingress routing:

```yaml
tunnel: <UUID>
credentials-file: /root/.cloudflared/<UUID>.json
ingress:
  - hostname: internal.zercle.io
    service: http://localhost:8080
  - service: http_status:404
```

We initialize and route these tunnels with the following workflow:

```bash
# Create the tunnel
cloudflared tunnel create <name>

# Configure DNS to point to the tunnel
cloudflared tunnel route dns <name> internal.zercle.io

# Run the tunnel using the config file
cloudflared tunnel run <name>
```

## Adding authentication with Cloudflare Access

We wrap the tunnel with Cloudflare Access to add an identity layer before traffic even hits our origin. In the Cloudflare dashboard, we create an Access application for the hostname and define identity policies, such as allowing only specific email domains or OIDC groups. When a user visits the hostname, they are redirected to a login page; Cloudflare grants access only after successful authentication, ensuring our internal service remains protected.

## Why we like it

*   No inbound attack surface: We close all inbound ports at the firewall level.
*   NAT traversal: The tunnel works reliably behind NAT, CGNAT, or mobile networks.
*   Integrated security: We combine the tunnel with Cloudflare's existing WAF, DDoS protection, and SSO policies.
*   Minimal footprint: We only need to manage one lightweight daemon on the host.

This approach fits our operational philosophy of maintaining small, secure surfaces while relying on stable, managed infrastructure.
