---
title: Why We Choose Boring Technology
description: Choosing proven, unglamorous tools is a deliberate strategy — not a lack of ambition. The economics of innovation tokens and operational risk.
date: 2026-05-22
author: Zercle Technology
tags: [engineering, culture]
---

# Why We Choose Boring Technology

Choosing boring technology is a deliberate strategy, not a sign of lacking ambition. We define boring technology as tools that are mature, widely deployed, well-documented, and possess predictable failure modes, which we contrast against the allure of novel, unproven solutions. For a small software studio like Zercle, opting for the boring path is an investment in stability and focus.

## The innovation-token budget

Every engineering team operates with a finite budget of what Dan McKinley famously termed "innovation tokens." You can afford to introduce one or two novel components into your stack, but not ten. If you choose to use a bleeding-edge database, an experimental language, and a pre-release cloud provider simultaneously, you are effectively guaranteed to encounter a catastrophic incident. We treat every novel technology as a liability that consumes these tokens; we spend them only when absolutely necessary, recognizing that spreading novelty across every layer of our stack invites unacceptable operational risk.

## What boring looks like for us

For our team in Khon Kaen, our default stack is comprised of technologies that have stood the test of time: Linux, PostgreSQL, Go, nginx, Cloudflare, standard HTTP/JSON APIs, cron, and systemd. Each of these tools has been around for decades, has a well-understood failure shape, and is supported by a massive community. We choose these as our baseline because they work reliably. Novel technology is never selected by default; it is only brought in if we can justify its inclusion against the standard, time-tested alternatives.

## The hidden cost of novelty

When we adopt a new tool, the true cost is rarely just the initial learning curve. It introduces a new operational skill that must be maintained, a new set of failure modes that will inevitably require debugging during an on-call shift, and a new upgrade path that must be managed. For a small team, these hidden maintenance costs compound rapidly. We have seen how novelty bites: a beta framework that introduces breaking changes in every minor release, or a niche datastore that lacks documentation when you need it most at 3am, can paralyze development for days.

## When we DO choose novelty

Boring by default does not mean we never innovate. We consider spending an innovation token when a specific requirement genuinely exceeds the capabilities of our standard, boring tools, or when the team has dedicated capacity to learn a new technology thoroughly without the immediate pressure of shipping a high-stakes production feature. Our rule is simple: the risk must be justified by the value added, and the team must be prepared to own the operational burden of that choice.

## The payoff

The payoff of this strategy is tangible. Boring technology runs for years without surprises, making our on-call rotations quieter and more predictable. It allows new hires to ramp up quickly because they are likely already familiar with the components of our stack. Ultimately, by eliminating the need to constantly battle our infrastructure, we spend our energy on what actually matters: solving the problems our clients rely on us to address. Reliability is not an accidental byproduct of our work; it is the result of choosing tools that do not fight back.
