import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Url } from 'src/entities/url.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { v4 as uuidiv4 } from "uuid";

@Injectable()
export class UrlsService {
  constructor(
    @InjectRepository(Url)
    private urlRepository: Repository<Url>,
  ) {}

  async shortenUrl(url: Partial<Url>) {
    const { origin_url } = url;

    // Check if origin_url is a real link
    if (!this.isValidUrl(origin_url)) {
      throw new BadRequestException("Invalid URL");
    }

    const backHalf = await this.generateBackHalf();

    const shortenedUrl = this.urlRepository.create({ 
      origin_url, 
      back_half: backHalf 
    });

    return this.urlRepository.save(shortenedUrl);
  }

  private isValidUrl(url: string) {
    const regexPattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator

    return regexPattern.test(url);
  }

  private checkBackHalf(backHalf: string) {
    return this.urlRepository.findOneBy({ back_half: backHalf });
  }

  private async generateBackHalf() {
    let backHalf = uuidiv4().split("-")[0];
    while (true) {
      // Check if backHalf is existed
      if (!await this.checkBackHalf(backHalf)) {
        return backHalf;
      }
    }
  }
}
