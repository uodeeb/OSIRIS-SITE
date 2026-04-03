/**
 * Health Check & Monitoring
 * Server-side health checks and basic monitoring
 */

import { Request, Response } from 'express';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  checks: {
    database: boolean;
    storage: boolean;
    memory: {
      used: number;
      total: number;
      percentage: number;
    };
  };
  responseTime: number;
}

// Health check endpoint handler
export async function healthCheck(req: Request, res: Response): Promise<void> {
  const startTime = Date.now();
  
  const status: HealthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
    checks: {
      database: await checkDatabase(),
      storage: await checkStorage(),
      memory: getMemoryStats(),
    },
    responseTime: Date.now() - startTime,
  };

  // Determine overall status
  if (!status.checks.database || !status.checks.storage) {
    status.status = 'unhealthy';
  } else if (status.checks.memory.percentage > 90) {
    status.status = 'degraded';
  }

  const statusCode = status.status === 'healthy' ? 200 : 
                     status.status === 'degraded' ? 200 : 503;

  res.status(statusCode).json(status);
}

// Readiness check (for Kubernetes)
export function readinessCheck(req: Request, res: Response): void {
  // Check if app is ready to serve traffic
  const isReady = true; // Add actual readiness logic
  
  if (isReady) {
    res.status(200).json({ ready: true });
  } else {
    res.status(503).json({ ready: false });
  }
}

// Liveness check (for Kubernetes)
export function livenessCheck(req: Request, res: Response): void {
  // Simple check that process is alive
  res.status(200).json({ alive: true, pid: process.pid });
}

// Database connectivity check
async function checkDatabase(): Promise<boolean> {
  try {
    // Add your database check here
    // Example: await db.query('SELECT 1');
    return true;
  } catch {
    return false;
  }
}

// Storage check
async function checkStorage(): Promise<boolean> {
  try {
    // Check if critical directories are accessible
    const fs = await import('fs');
    fs.accessSync('./dist/public', fs.constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

// Memory statistics
function getMemoryStats(): { used: number; total: number; percentage: number } {
  const used = process.memoryUsage().heapUsed;
  const total = process.memoryUsage().heapTotal;
  
  return {
    used,
    total,
    percentage: Math.round((used / total) * 100),
  };
}

// Metrics collection for Prometheus
interface Metrics {
  httpRequestsTotal: number;
  httpRequestDuration: number[];
  activeConnections: number;
  errorsTotal: number;
}

let metrics: Metrics = {
  httpRequestsTotal: 0,
  httpRequestDuration: [],
  activeConnections: 0,
  errorsTotal: 0,
};

// Record HTTP request metrics
export function recordHttpRequest(duration: number, error: boolean): void {
  metrics.httpRequestsTotal++;
  metrics.httpRequestDuration.push(duration);
  
  // Keep only last 1000 durations for memory efficiency
  if (metrics.httpRequestDuration.length > 1000) {
    metrics.httpRequestDuration.shift();
  }
  
  if (error) {
    metrics.errorsTotal++;
  }
}

// Metrics endpoint for Prometheus
export function metricsEndpoint(req: Request, res: Response): void {
  const avgDuration = metrics.httpRequestDuration.length > 0
    ? metrics.httpRequestDuration.reduce((a, b) => a + b, 0) / metrics.httpRequestDuration.length
    : 0;

  const prometheusMetrics = `
# HELP osiris_http_requests_total Total HTTP requests
# TYPE osiris_http_requests_total counter
osiris_http_requests_total ${metrics.httpRequestsTotal}

# HELP osiris_http_request_duration_seconds Average HTTP request duration
# TYPE osiris_http_request_duration_seconds gauge
osiris_http_request_duration_seconds ${avgDuration / 1000}

# HELP osiris_errors_total Total errors
# TYPE osiris_errors_total counter
osiris_errors_total ${metrics.errorsTotal}

# HELP osiris_node_memory_usage_bytes Memory usage
# TYPE osiris_node_memory_usage_bytes gauge
osiris_node_memory_usage_bytes ${process.memoryUsage().heapUsed}

# HELP osiris_node_uptime_seconds Process uptime
# TYPE osiris_node_uptime_seconds gauge
osiris_node_uptime_seconds ${process.uptime()}
`.trim();

  res.set('Content-Type', 'text/plain');
  res.send(prometheusMetrics);
}

// Middleware to track request metrics
export function metricsMiddleware(req: Request, res: Response, next: () => void): void {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const error = res.statusCode >= 400;
    recordHttpRequest(duration, error);
  });
  
  next();
}

// Graceful shutdown handler
export function setupGracefulShutdown(server: any): void {
  const gracefulShutdown = (signal: string) => {
    console.log(`Received ${signal}. Starting graceful shutdown...`);
    
    server.close(() => {
      console.log('HTTP server closed.');
      process.exit(0);
    });

    // Force shutdown after 30 seconds
    setTimeout(() => {
      console.error('Forced shutdown after timeout');
      process.exit(1);
    }, 30000);
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}
