type LogArgument = string | number | boolean | null | undefined | object;

function write(
  level: string,
  message: string,
  details: LogArgument[] = [],
): void {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

  if (details.length === 0) {
    console.log(prefix, message);
    return;
  }

  console.log(prefix, message, ...details);
}

export const logger = {
  info(message: string, ...details: LogArgument[]): void {
    write("info", message, details);
  },
  warn(message: string, ...details: LogArgument[]): void {
    write("warn", message, details);
  },
  error(message: string, ...details: LogArgument[]): void {
    write("error", message, details);
  },
};
