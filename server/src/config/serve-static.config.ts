import { join } from "path";

export const ServeStaticConfigOptions = {
  rootPath: join(__dirname, "..", "..", "resources"),
  serveRoot: "/public"  
}