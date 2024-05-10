import { getAccessToken } from "../utils/local-storage.util";

export const JwtConfigOptions = {
  config: {
    tokenGetter: getAccessToken,
    allowedDomains: ["http://localhost:3000"]
  }
}
