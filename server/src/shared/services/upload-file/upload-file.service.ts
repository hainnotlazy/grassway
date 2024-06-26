import { Injectable } from '@nestjs/common';
import * as path from "path";
import * as fs from "fs";

@Injectable()
export class UploadFileService {
  private readonly RESOURCES_PATH = "./resources";
  private readonly AVATAR_PATH = "./resources/avatars";
  private readonly LOGO_PATH = "./resources/logos";
  private readonly BRAND_PATH = "./resources/brands";
  private readonly SERVE_PATH = "public";

  /** 
   * Describe: Save avatar from form data
  */
  saveAvatar(avatar: Express.Multer.File) {
    if (!fs.existsSync(this.AVATAR_PATH)) {
      fs.mkdirSync(this.AVATAR_PATH, { recursive: true });
    }
    const randomName = `${Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')}${path.extname(avatar.originalname)}`;
    const filePath = `${this.AVATAR_PATH}/${randomName}`;

    fs.writeFileSync(filePath, avatar.buffer);
    return filePath.replace(this.AVATAR_PATH, `${this.SERVE_PATH}/avatars`);
  }

  /** 
   * Describe: Save logo from form data
  */
  saveLogo(logo: Express.Multer.File) {
    if (!fs.existsSync(this.LOGO_PATH)) {
      fs.mkdirSync(this.LOGO_PATH, { recursive: true });
    }

    const randomName = `${Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')}${path.extname(logo.originalname)}`;
    const filePath = `${this.LOGO_PATH}/${randomName}`;

    fs.writeFileSync(filePath, logo.buffer);
    return filePath.replace(this.LOGO_PATH, `${this.SERVE_PATH}/logos`);
  }

  /**
   * Describe: Save brand from form data
   */
  saveBrandLogo(brand: Express.Multer.File) {
    if (!fs.existsSync(this.BRAND_PATH)) {
      fs.mkdirSync(this.BRAND_PATH, { recursive: true });
    }

    const randomName = `${Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')}${path.extname(brand.originalname)}`;
    const filePath = `${this.BRAND_PATH}/${randomName}`;

    fs.writeFileSync(filePath, brand.buffer);
    return filePath.replace(this.BRAND_PATH, `${this.SERVE_PATH}/brands`);
  }

  /** 
   * Describe: Remove old file
  */
  removeOldFile(filePath: string) {
    const actualFilePath = filePath.replace(this.SERVE_PATH, this.RESOURCES_PATH);
    if (fs.existsSync(actualFilePath)) {
      fs.unlinkSync(actualFilePath);
    }
  }
}
