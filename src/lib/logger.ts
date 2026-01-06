type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: any;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs: number = 100;

  private createEntry(level: LogLevel, message: string, data?: any): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      data,
    };
  }

  private addLog(entry: LogEntry): void {
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
  }

  info(message: string, data?: any): void {
    const entry = this.createEntry('info', message, data);
    this.addLog(entry);
    console.log(`[INFO] ${message}`, data || '');
  }

  warn(message: string, data?: any): void {
    const entry = this.createEntry('warn', message, data);
    this.addLog(entry);
    console.warn(`[WARN] ${message}`, data || '');
  }

  error(message: string, data?: any): void {
    const entry = this.createEntry('error', message, data);
    this.addLog(entry);
    console.error(`[ERROR] ${message}`, data || '');
  }

  debug(message: string, data?: any): void {
    const entry = this.createEntry('debug', message, data);
    this.addLog(entry);
    console.debug(`[DEBUG] ${message}`, data || '');
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
  }

  async sendToServer(entry: LogEntry): Promise<void> {
    try {
      await fetch('/api/logger', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      });
    } catch (error) {
      console.error('Failed to send log to server:', error);
    }
  }
}

export const logger = new Logger();
