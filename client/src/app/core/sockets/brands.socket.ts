import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";
import { environment } from "src/environments/environment";
import { getAccessToken } from "../helpers/local-storage.helper";

@Injectable()
export class BrandsSocket extends Socket {
  constructor() {
    super({
      url: `${environment.server}/brands`,
      options: {
        extraHeaders: {
          Authorization: "Bearer " + (getAccessToken() || "")
        }
      }
    })
  }
}
