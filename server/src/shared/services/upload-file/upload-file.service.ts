import { Injectable } from '@nestjs/common';
import * as path from "path";
import * as fs from "fs";

@Injectable()
export class UploadFileService {
  private readonly RESOURCES_PATH = "./resources";
  private readonly AVATAR_PATH = "./resources/avatars"
  private readonly SERVE_PATH = "public"

  saveAvatar(avatar: Express.Multer.File) {
    if (!fs.existsSync(this.AVATAR_PATH)) {
      fs.mkdirSync(this.AVATAR_PATH, { recursive: true });
    }
    const randomName = `${Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')}${path.extname(avatar.originalname)}`;
    const filePath = `${this.AVATAR_PATH}/${randomName}`;

    fs.writeFileSync(filePath, avatar.buffer);
    return filePath.replace(this.AVATAR_PATH, `${this.SERVE_PATH}/avatars`);
  }

  removeOldAvatar(avatarPath: string) {
    const actualAvatarPath = avatarPath.replace(this.SERVE_PATH, this.RESOURCES_PATH);
    if (fs.existsSync(actualAvatarPath)) {
      fs.unlinkSync(actualAvatarPath);
    }
  }
}
