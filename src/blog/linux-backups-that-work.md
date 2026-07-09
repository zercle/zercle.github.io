---
title: Linux Backups That Actually Work
description: "A pragmatic backup strategy for Linux servers — the 3-2-1 rule, what to back up, automation, and the only test that matters: restoring."
date: 2026-06-30
author: Zercle Technology
tags: [linux, infrastructure, guides]
---

# Linux Backups That Actually Work

Most backups fail silently. The only backups we trust are those we have verified by restoring. Our goal is a system that automates the backup process, monitors for failures, and provides a clear procedure for recovery.

## The 3-2-1 Rule

We follow the 3-2-1 rule: maintain 3 copies of your data, on 2 different media, with 1 copy stored off-site. This protects against drive failure, local infrastructure disasters, and human error. Each layer adds redundancy that reduces the probability of total data loss.

## What to Back Up

We categorize server data into two buckets.

1. **Non-regenerable data**: This must be backed up. It includes database dumps, user uploads, application configuration files, and secrets (keys, certificates).
2. **Regenerable data**: We do not back this up. It includes the base operating system, installed software packages, and ephemeral caches. These can be recreated via configuration management or by reinstalling packages.

For databases, always create a consistent snapshot before backing up. Do not copy live database files while the server is running. Use standard tools like `pg_dump` for PostgreSQL to ensure integrity.

## Tools

We use `restic` as our primary tool. It provides deduplication, encryption, and supports multiple backends including local storage, S3, and B2. `borg` is a viable alternative if your specific environment requires it.

Example `pg_dump` sequence:

```bash
# Dump the database to a file
pg_dump -U db_user -h localhost -f /var/backups/db/production.sql production_db
```

Example `restic` workflow:

```bash
# Initialize a new repository
restic init -r /mnt/backups/repo

# Backup data
restic -r /mnt/backups/repo backup /var/backups/db /etc/nginx /home/app/uploads

# Apply retention policy: keep last 7 daily, 4 weekly, 6 monthly
restic -r /mnt/backups/repo forget --keep-daily 7 --keep-weekly 4 --keep-monthly 6 --prune
```

## Automation and Monitoring

We run backups using systemd timers rather than cron jobs to benefit from better logging through `journalctl`. A backup script that fails silently is worse than having no backups. Every script must emit a non-zero exit code if it fails. We monitor the age of the last successful backup to detect if the automated process has stalled, rather than simply checking if the job triggered.

Example systemd service logic with a health check hook:

```bash
# On success, ping a monitoring endpoint
if [ $? -eq 0 ]; then
  curl -fsS -m 10 --retry 5 https://hc-ping.com/your-uuid-here
fi
```

## The Only Test That Matters: Restore

A backup you have never restored from is unverified. We periodically perform a full restore into a temporary location to confirm that files are accessible and database dumps load correctly.

```bash
# Restore files from the latest snapshot
restic -r /mnt/backups/repo restore latest --target /tmp/restore-test
```

## What We Do

We use `restic` to push encrypted backups to off-site object storage, complemented by local database dumps. We rely on systemd timers for execution, age-based alerts for monitoring, and conduct a quarterly restore drill to ensure our procedures remain valid.
