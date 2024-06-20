import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";
import { environment } from "src/environments/environment";
import { getAccessToken } from "../helpers/local-storage.helper";

@Injectable()
export class NotificationSocket extends Socket {
  constructor() {
    super({
      url: `${environment.server}/notification`,
      options: {
        extraHeaders: {
          Authorization: "Bearer " + (getAccessToken() || "")
        }
      }
    })
  }
}
