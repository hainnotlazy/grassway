export const SOCKET_ORIGIN = process.env.NODE_ENV === "production"
  ? ["http://client", "https://client"]
  : "*";