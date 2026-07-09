---
title: Building Observable Go Services
description: The three pillars — metrics, structured logging, and tracing — wired into a Go service so production is debuggable, not mysterious.
date: 2026-04-18
author: Zercle Technology
tags: [go, observability, backend]
---

# Building Observable Go Services

Logs are not enough. When a service fails at 3am, raw text files leave us guessing; we need metrics to see WHAT is happening, traces to see WHERE the request traveled, and structured logs to understand WHY it failed. Observability is a feature, not an afterthought.

## The Three Pillars

Metrics provide aggregated numerical data over time, enabling threshold alerts. Logs capture discrete, time-stamped events with high-cardinality context. Traces map the path of a single request across service boundaries and internal operations, revealing latency bottlenecks.

## Metrics with the Prometheus Client

We use `github.com/prometheus/client_golang/prometheus` to measure request latency. A histogram allows us to calculate quantiles and heatmaps to understand performance distribution.

```go
package main

import (
	"net/http"
	"time"

	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

var requestDuration = prometheus.NewHistogramVec(
	prometheus.HistogramOpts{
		Name:    "http_request_duration_seconds",
		Help:    "Latency of HTTP requests.",
		Buckets: prometheus.DefBuckets,
	},
	[]string{"route"},
)

func init() {
	prometheus.MustRegister(requestDuration)
}

func instrumentedHandler(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		next(w, r)
		duration := time.Since(start).Seconds()
		requestDuration.WithLabelValues(r.URL.Path).Observe(duration)
	}
}

func main() {
	http.Handle("/metrics", promhttp.Handler())
	http.HandleFunc("/api", instrumentedHandler(func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("ok"))
	}))
	http.ListenAndServe(":8080", nil)
}
```

## Structured Logging with log/slog

Structured logs allow us to query events by fields. Using `log/slog`, we output JSON and inject request-scoped data like trace IDs.

```go
package main

import (
	"context"
	"log/slog"
	"os"
)

func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	slog.SetDefault(logger)

	ctx := context.WithValue(context.Background(), "trace_id", "abc-123")
	
	slog.Info("processed request",
		slog.String("trace_id", ctx.Value("trace_id").(string)),
		slog.Int("status", 200),
		slog.Duration("latency", 50*time.Millisecond),
	)
}
```

## Tracing

OpenTelemetry (`go.opentelemetry.io/otel`) provides a standardized way to trace execution spans. We start a span at the entry point and end it after completion.

```go
package main

import (
	"context"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/trace"
)

func handleRequest(ctx context.Context) {
	tracer := otel.Tracer("service-name")
	ctx, span := tracer.Start(ctx, "handleRequest")
	defer span.End()

	// Perform work...
	span.SetAttributes(attribute.String("db.query", "SELECT * FROM users"))
}
```

## Wiring Together via Context

The `context.Context` is the glue. Middleware extracts the trace ID from incoming headers, stores it in the context, and injects a logger derived from that context. Metrics are updated based on the route defined in the handler. This ensures that one request yields one trace, matching logs, and accounted metrics.

## What We Do

Every service at Zercle Technology includes these three pillars on day one. We configure alerts based on SLOs derived from metrics, and we debug incidents by filtering logs and traces using the shared trace ID. For us, observability is non-negotiable infrastructure.
