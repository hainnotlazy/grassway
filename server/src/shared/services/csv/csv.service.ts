import { Injectable } from '@nestjs/common';
import { createObjectCsvWriter } from 'csv-writer';
import { join } from 'path';
import * as fs from "fs";
import { Url } from 'src/entities/url.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CsvService {
  private readonly URL_HEADER = [
    { id: "id", title: "Id" },
    { id: "origin_url", title: "Origin Url" },
    { id: "back_half", title: "Shortened Url" },
    { id: "custom_back_half", title: "Custom Shortened Url" },
    { id: "title", title: "Title" },
    { id: "description", title: "Description" },
    { id: "password", title: "Password" },
    { id: "is_active", title: "Active" },
    { id: "created_at", title: "Created At" },
    { id: "updated_at", title: "Updated At" },
  ]

  constructor(
    private configService: ConfigService
  ) {}

  /** 
   * Describe: Generate csv file contains urls
  */
  async writeUrlsCsv(fileName: string, data: Url[]) {
    const filePath = join(__dirname, "..", "..", "..", "..", "..", "resources", fileName);

    // Handle add Client url to shortened url
    data = data.map(url => {
      url.back_half = `${this.configService.get<string>("CLIENT")}/l/${url.back_half}`;
      url.custom_back_half = url.custom_back_half ? `${this.configService.get<string>("CLIENT")}/l/${url.custom_back_half}` : "";
      return url;
    });

    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: this.URL_HEADER
    });

    await csvWriter.writeRecords(data);
    return filePath;
  }

  /** 
   * Describe: Remove unused file
  */
  removeUnusedFile(filePath: string) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}
