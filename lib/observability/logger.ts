import "server-only";

export type LogLevel = "debug" | "info" | "warn" | "error";

export type LogContext = {
  requestId?: string;
  userId?: string;
  scope?: string; // e.g. "api", "admin", "auth", "db"
  route?: string;
  method?: string;
  ip?: string;
  userAgent?: string;
};

type LogPayload = Record<string, unknown>;

function nowISO() {
  return new Date().toISOString();
}

function safeJson(obj: unknown) {
  try {
    return JSON.stringify(obj);
  } catch {
    return JSON.stringify({ msg: "Unserializable log payload" });
  }
}

function emit(level: LogLevel, message: string, ctx?: LogContext, extra?: LogPayload) {
  const entry = {
    ts: nowISO(),
    level,
    message,
    ...ctx,
    ...(extra ?? {}),
  };

  // Vercel: stdout/stderr gets collected
  if (level === "error") {
    console.error(safeJson(entry));
  } else if (level === "warn") {
    console.warn(safeJson(entry));
  } else {
    console.log(safeJson(entry));
  }
}

export const logger = {
  debug: (message: string, ctx?: LogContext, extra?: LogPayload) =>
    emit("debug", message, ctx, extra),
  info: (message: string, ctx?: LogContext, extra?: LogPayload) =>
    emit("info", message, ctx, extra),
  warn: (message: string, ctx?: LogContext, extra?: LogPayload) =>
    emit("warn", message, ctx, extra),
  error: (message: string, ctx?: LogContext, extra?: LogPayload) =>
    emit("error", message, ctx, extra),
};
