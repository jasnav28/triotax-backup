export type NetworkErrorCode =
  | "CLIENT_OFFLINE"
  | "SERVER_UNAVAILABLE"
  | "REQUEST_TIMEOUT"
  | "API_ERROR"
  | "SLOW_RESPONSE"
  | "DATABASE_ERROR"
  | "UNKNOWN_ERROR";

export interface NetworkErrorClassification {
  code: NetworkErrorCode;
  isClientOffline: boolean;
  userFacingMessage: string;
  technicalDetails?: string;
  httpStatus?: number;
  durationMs?: number;
  timestamp: number;
}

/**
  * Centralized Network & API Error Classification System
  * Ensures that backend latency, server cold starts, or API errors are NEVER
  * falsely reported as "Poor Internet Connection" to the user.
  */
export function classifyNetworkError(
  error: any,
  options?: {
    durationMs?: number;
    httpStatus?: number;
    responseBody?: any;
  }
): NetworkErrorClassification {
  const timestamp = Date.now();
  const durationMs = options?.durationMs;
  const httpStatus = options?.httpStatus;

  // 1. Check if the browser is genuinely offline
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return {
      code: "CLIENT_OFFLINE",
      isClientOffline: true,
      userFacingMessage: "No Internet Connection. Please check your network.",
      technicalDetails: "navigator.onLine is false",
      timestamp,
    };
  }

  // 2. Abort / Timeout check
  if (error?.name === "AbortError" || error?.message?.includes("timeout")) {
    return {
      code: "REQUEST_TIMEOUT",
      isClientOffline: false,
      userFacingMessage: "The server request timed out. Please try again.",
      technicalDetails: `Request exceeded timeout threshold (${durationMs || "unknown"} ms)`,
      durationMs,
      timestamp,
    };
  }

  // 3. HTTP Server Status Codes (5xx = Server/DB issue, 4xx = API issue)
  if (httpStatus) {
    if (httpStatus === 502 || httpStatus === 503 || httpStatus === 504) {
      return {
        code: "SERVER_UNAVAILABLE",
        isClientOffline: false,
        userFacingMessage: "Unable to connect to the server. Please try again shortly.",
        technicalDetails: `HTTP ${httpStatus} Server Error`,
        httpStatus,
        durationMs,
        timestamp,
      };
    }

    if (httpStatus >= 500) {
      return {
        code: "DATABASE_ERROR",
        isClientOffline: false,
        userFacingMessage: options?.responseBody?.message || "Server encountered an internal error. Please try again.",
        technicalDetails: `HTTP ${httpStatus} Internal Server Error`,
        httpStatus,
        durationMs,
        timestamp,
      };
    }

    if (httpStatus >= 400) {
      return {
        code: "API_ERROR",
        isClientOffline: false,
        userFacingMessage: options?.responseBody?.message || "Invalid request. Please check your inputs.",
        technicalDetails: `HTTP ${httpStatus} Client Request Error`,
        httpStatus,
        durationMs,
        timestamp,
      };
    }
  }

  // 4. TypeError / Fetch Network Error when browser IS online
  if (error instanceof TypeError || error?.message?.includes("Failed to fetch")) {
    return {
      code: "SERVER_UNAVAILABLE",
      isClientOffline: false,
      userFacingMessage: "Server is temporarily unavailable. Please try again later.",
      technicalDetails: error?.message || "Fetch network failure",
      durationMs,
      timestamp,
    };
  }

  // 5. Slow Response handling (Never label as poor client internet!)
  if (durationMs && durationMs > 3000) {
    return {
      code: "SLOW_RESPONSE",
      isClientOffline: false,
      userFacingMessage: "The server is taking longer than expected to respond.",
      technicalDetails: `Backend response duration: ${durationMs}ms`,
      durationMs,
      timestamp,
    };
  }

  // Default fallback
  return {
    code: "UNKNOWN_ERROR",
    isClientOffline: false,
    userFacingMessage: error?.message || "An unexpected error occurred. Please try again.",
    technicalDetails: String(error),
    durationMs,
    timestamp,
  };
}

/**
  * Centralized Notification Manager to prevent notification spam / duplication.
  */
class NotificationDeduplicator {
  private lastNotificationTime: Map<string, number> = new Map();
  private cooldownMs: number = 4000;

  shouldShowNotification(key: string): boolean {
    const now = Date.now();
    const last = this.lastNotificationTime.get(key) || 0;
    if (now - last > this.cooldownMs) {
      this.lastNotificationTime.set(key, now);
      return true;
    }
    return false;
  }
}

export const notificationDeduplicator = new NotificationDeduplicator();
