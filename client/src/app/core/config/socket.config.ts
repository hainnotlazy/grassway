import { SocketIoConfig } from "ngx-socket-io";
import { environment } from "src/environments/environment";
import { getAccessToken } from "../helpers/local-storage.helper";

export const SocketConfigOptions: SocketIoConfig = {
  url: environment.server,
  options: {
    extraHeaders: {
      Authorization: getAccessToken() || ""
    }
  }
}
