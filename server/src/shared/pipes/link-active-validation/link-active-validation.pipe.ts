import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { LinkActiveOptions } from 'src/common/models/get-urls-options.model';

@Injectable()
export class LinkActiveValidationPipe implements PipeTransform {
  private readonly allowedValues = [
    LinkActiveOptions.ALL,
    LinkActiveOptions.ACTIVE,
    LinkActiveOptions.INACTIVE
  ];

  transform(value: any) {
    if (!this.isValid(value)) {
      throw new BadRequestException(`Invalid parameter link active`);
    }
    return value;
  }

  private isValid(value: any) {
    return this.allowedValues.includes(value);
  }
}
