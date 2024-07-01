import { getAccessToken } from "../helpers/local-storage.helper";

export const JwtConfigOptions = {
  config: {
    tokenGetter: getAccessToken,
    allowedDomains: ["http://localhost:3000", "http://backend:3000"]
  }
}
