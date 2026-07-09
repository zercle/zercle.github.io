---
title: Graceful Shutdown in Go HTTP Servers
description: Stopping a Go HTTP server without dropping in-flight requests — signals, contexts, and Shutdown with a deadline.
date: 2026-01-20
author: Zercle Technology
tags: [go, backend, infrastructure]
---

# Graceful Shutdown in Go HTTP Servers

Abruptly stopping a Go HTTP server—for instance, by triggering `os.Exit` or allowing a `log.Fatal` to run mid-request—is poor practice. This approach immediately drops all in-flight requests, returns errors to clients, and can leave shared state or database transactions in a corrupted or inconsistent condition.

### The Mechanism

We achieve graceful shutdown by listening for operating system termination signals, specifically `SIGINT` (Ctrl+C) and `SIGTERM` (typical in containerized environments like Kubernetes). In Go 1.16 and later, `signal.NotifyContext` provides an idiomatic way to handle this by creating a context that is automatically cancelled when a signal is received.

The `http.Server` struct provides a `Shutdown` method, which stops the server from accepting new connections while allowing existing ones to complete. It accepts a `context.Context` to define a deadline for this process. It is critical to note that `Shutdown` does not forcefully cancel your handler functions. If a handler is blocked in a long-running process, it will keep running until it finishes—unless the handler explicitly checks for context cancellation using `r.Context().Done()`.

### Worked Example

The following example implements a server that responds to shutdown signals and provides a slow endpoint that respects request context cancellation.

```go
package main

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
)

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/slow", func(w http.ResponseWriter, r *http.Request) {
		select {
		case <-time.After(5 * time.Second):
			fmt.Fprintln(w, "Request finished")
		case <-r.Context().Done():
			log.Println("Handler cancelled due to shutdown")
		}
	})

	srv := &http.Server{
		Addr:              ":8080",
		Handler:           mux,
		ReadHeaderTimeout: 5 * time.Second,
	}

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	go func() {
		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			log.Fatalf("listen: %s\n", err)
		}
	}()
	log.Println("Server started on :8080")

	<-ctx.Done()
	log.Println("Shutting down server...")

	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := srv.Shutdown(shutdownCtx); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}

	log.Println("Server exited gracefully")
}
```

### Common Pitfalls

The most common mistake is ignoring the request context in handlers. If a handler performs database queries or heavy computation without checking `r.Context().Done()`, `srv.Shutdown` will wait indefinitely (or until the timeout is reached) for the handler to return, rendering the grace period useless.

Failing to provide a timeout context to `Shutdown` is also dangerous; if a connection remains stuck, the server will never terminate, potentially causing deployment pipelines to hang. Finally, differentiate clearly between `Shutdown` (graceful, waits for active connections) and `Close` (immediate, forces connections to close, often resulting in "connection reset by peer" errors for clients).

### What We Do

At Zercle, we ensure every service integrates graceful shutdown during initialization. We define a hard deadline for the shutdown context that is slightly shorter than our infrastructure provider's own SIGKILL timeout to ensure the process exits cleanly before the orchestrator resorts to force-killing it.
