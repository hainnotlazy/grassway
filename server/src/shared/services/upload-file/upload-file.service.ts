import { Injectable } from '@nestjs/common';
import * as path from "path";
import * as fs from "fs";
import * as sharp from 'sharp';

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

    const filePath = this.generateRandomName(avatar, this.AVATAR_PATH);
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

    const filePath = this.generateRandomName(logo, this.LOGO_PATH);
    fs.writeFileSync(filePath, logo.buffer);

    return filePath.replace(this.LOGO_PATH, `${this.SERVE_PATH}/logos`);
  }

  /**
   * Describe: Save brand logo from form data
   */
  async saveBrandLogo(brandLogo: Express.Multer.File) {
    if (!fs.existsSync(this.BRAND_PATH)) {
      fs.mkdirSync(this.BRAND_PATH, { recursive: true });
    }

    const filePath = this.generateRandomName(brandLogo, this.BRAND_PATH);

    try {
      const image = sharp(brandLogo.buffer);
      const metadata = await image.metadata();

      if (metadata.width < 200 && metadata.height < 200) {
        await image.resize(200, 200).toFile(filePath);
      } else if (metadata.width < 200) {
        await image.resize(200, metadata.height).toFile(filePath);
      } else if (metadata.height < 200) {
        await image.resize(metadata.width, 200).toFile(filePath);
      } else {
        await image.toFile(filePath);
      }
    } catch (error) {
      throw new Error('Error saving brand logo');
    }

    return filePath.replace(this.BRAND_PATH, `${this.SERVE_PATH}/brands`);
  }

  /**
   * Describe: Save brand block image from form data
  */
  saveBlockImage(blockImage: Express.Multer.File) {
    if (!fs.existsSync(this.BRAND_PATH)) {
      fs.mkdirSync(this.BRAND_PATH, { recursive: true });
    }

    const filePath = this.generateRandomName(blockImage, this.BRAND_PATH);
    fs.writeFileSync(filePath, blockImage.buffer);

    return filePath.replace(this.BRAND_PATH, `${this.SERVE_PATH}/brands`);
  }

  /** 
   * Describe: Remove old file
  */
  removeOldFile(filePath: string) {
    if (!filePath) return;

    const actualFilePath = filePath.replace(this.SERVE_PATH, this.RESOURCES_PATH);
    if (fs.existsSync(actualFilePath)) {
      fs.unlinkSync(actualFilePath);
    }
  }

  /**
   * Describe: Generate random file name
  */
  private generateRandomName(file: Express.Multer.File, prefixPath: string): string {
    const randomName = `${Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')}${path.extname(file.originalname)}`;
    return `${prefixPath}/${randomName}`;
  }
}
