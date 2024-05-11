import { getAccessToken } from "../helpers/local-storage.helper";

export const JwtConfigOptions = {
  config: {
    tokenGetter: getAccessToken,
    allowedDomains: ["http://localhost:3000"]
  }
}
