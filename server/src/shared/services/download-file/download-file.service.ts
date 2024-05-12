import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import * as fs from "fs";
import * as path from "path";

@Injectable()
export class DownloadFileService {
  private readonly RESOURCES_PATH = "./resources";
  private readonly AVATAR_PATH = "./resources/avatars";
  private readonly SERVE_PATH = "public"

  constructor(
    private httpService: HttpService
  ) {}

  async downloadAvatar(imageUrl: string): Promise<string> {
    if (!fs.existsSync(this.AVATAR_PATH)) {
      fs.mkdirSync(this.AVATAR_PATH, { recursive: true });
    }

    const randomName = `${Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')}.png`;
    const filePath = `${this.AVATAR_PATH}/${randomName}`;
    const writer = fs.createWriteStream(filePath);
    const response = await this.httpService.axiosRef({
      url: imageUrl,
      method: "GET",
      responseType: "stream"
    });
    
    response.data.pipe(writer);

    return new Promise((resolve) => {
      writer.on('finish', () => {
        resolve(filePath.replace(this.AVATAR_PATH, `${this.SERVE_PATH}/avatars`));
      });
      writer.on('error', () => {
        resolve(null);
      });
    });
  }
}
