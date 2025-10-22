type LogLevel = "info" | "warn" | "error" | "debug";

class Logger {
  private log(level: LogLevel, message: string, meta?: any) {
    const logMessage = `[${level.toUpperCase()}] ${message}`;

    console[level](logMessage, meta || "");
  }

  info(message: string, meta?: any) {
    this.log("info", message, meta);
  }

  warn(message: string, meta?: any) {
    this.log("warn", message, meta);
  }

  error(message: string, meta?: any) {
    this.log("error", message, meta);
  }

  debug(message: string, meta?: any) {
    this.log("debug", message, meta);
  }
}


export const logger = new Logger();