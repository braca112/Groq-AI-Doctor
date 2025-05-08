type LogLevel = "info" | "warn" | "error" | "debug"

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  data?: any
}

class Logger {
  private static instance: Logger

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  private log(level: LogLevel, message: string, data?: any) {
    const timestamp = new Date().toISOString()
    const logEntry: LogEntry = {
      timestamp,
      level,
      message,
      data: this.sanitizeData(data),
    }

    // In production, you would send this to a logging service
    if (process.env.NODE_ENV === "production") {
      // Send to logging service like Datadog, Sentry, etc.
      // this.sendToLoggingService(logEntry)
    }

    // Console output for development
    const consoleMethod =
      level === "error"
        ? console.error
        : level === "warn"
          ? console.warn
          : level === "debug"
            ? console.debug
            : console.log

    consoleMethod(`[${timestamp}] [${level.toUpperCase()}] ${message}`, data ? logEntry.data : "")
  }

  // Remove sensitive data before logging
  private sanitizeData(data: any): any {
    if (!data) return undefined

    if (typeof data === "object") {
      const sanitized = { ...data }

      // Remove sensitive fields
      const sensitiveFields = ["password", "token", "secret", "key", "authorization"]

      Object.keys(sanitized).forEach((key) => {
        if (sensitiveFields.some((field) => key.toLowerCase().includes(field))) {
          sanitized[key] = "[REDACTED]"
        } else if (typeof sanitized[key] === "object") {
          sanitized[key] = this.sanitizeData(sanitized[key])
        }
      })

      return sanitized
    }

    return data
  }

  public info(message: string, data?: any) {
    this.log("info", message, data)
  }

  public warn(message: string, data?: any) {
    this.log("warn", message, data)
  }

  public error(message: string, data?: any) {
    this.log("error", message, data)
  }

  public debug(message: string, data?: any) {
    if (process.env.NODE_ENV !== "production") {
      this.log("debug", message, data)
    }
  }
}

export const logger = Logger.getInstance()
