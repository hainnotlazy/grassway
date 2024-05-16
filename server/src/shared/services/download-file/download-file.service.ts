import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import * as fs from "fs";
import * as path from "path";
import * as sharp from 'sharp';

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
    const tempFilePath = `${this.AVATAR_PATH}/temp-${randomName}`;
    const filePath = `${this.AVATAR_PATH}/${randomName}`;
    const writer = fs.createWriteStream(tempFilePath);
    const response = await this.httpService.axiosRef({
      url: imageUrl,
      method: "GET",
      responseType: "stream"
    });
    
    response.data.pipe(writer);

    return new Promise((resolve) => {
      writer.on('finish', async () => {
        try {
          // Handle to resize image if its dimensions is less than 250x250
          const image = sharp(tempFilePath);
          const metadata = await image.metadata();

          if (metadata.width < 250 || metadata.height < 250) {
            await image.resize(250, 250, {
              fit: 'contain',  
              withoutEnlargement: false,
            }).toFile(filePath);
          } else {
            await image.toFile(filePath);
          }

          fs.unlinkSync(tempFilePath);
          resolve(filePath.replace(this.AVATAR_PATH, `${this.SERVE_PATH}/avatars`));
        } catch (error) {} 
      });
      writer.on('error', () => {
        resolve(null);
      });
    });
  }
}
