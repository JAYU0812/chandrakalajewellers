import { supabase } from './supabase';

export interface PerformanceMetric {
  name: string;
  value: number; // Duration in milliseconds
  path: string;
  timestamp: string;
}

export interface ClientErrorLog {
  message: string;
  stack?: string;
  path: string;
  userAgent: string;
  timestamp: string;
}

/**
 * Capture performance speed metrics (LCP, FID, CLS, or page transitions).
 */
export const logPerformanceMetric = async (metricName: string, durationMs: number) => {
  const metric: PerformanceMetric = {
    name: metricName,
    value: durationMs,
    path: window.location.pathname,
    timestamp: new Date().toISOString(),
  };

  // Log in-memory console tracker
  console.info(`[Monitoring Performance]: ${metric.name} loaded in ${metric.value.toFixed(1)}ms on path ${metric.path}`);

  // Sync to database audit logs under a custom payload category
  try {
    const { error } = await supabase.from('audit_logs').insert([{
      action: 'INSERT',
      table_name: 'monitoring_performance',
      record_id: '00000000-0000-0000-0000-000000000000',
      new_data: metric as any,
    }]);
    if (error) throw error;
  } catch (err) {
    // Graceful fallback during local previews
  }
};

/**
 * Capture client exceptions and write them to system audit logs.
 */
export const logClientError = async (error: Error) => {
  const log: ClientErrorLog = {
    message: error.message,
    stack: error.stack,
    path: window.location.pathname,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
  };

  console.error(`[Monitoring Exception]: ${log.message} at ${log.path}`, error);

  try {
    const { error: dbErr } = await supabase.from('audit_logs').insert([{
      action: 'INSERT',
      table_name: 'monitoring_exceptions',
      record_id: '00000000-0000-0000-0000-000000000000',
      new_data: log as any,
    }]);
    if (dbErr) throw dbErr;
  } catch (err) {
    // Graceful fallback during sandbox previews
  }
};

/**
 * React hook to auto-measure component mount and render speeds.
 */
export const useMeasureRender = (componentName: string) => {
  const start = performance.now();

  return () => {
    const duration = performance.now() - start;
    logPerformanceMetric(`Render_${componentName}`, duration);
  };
};
