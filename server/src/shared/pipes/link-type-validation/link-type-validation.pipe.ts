import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { LinkTypeOptions } from 'src/common/models/get-urls-options.model';

@Injectable()
export class LinkTypeValidationPipe implements PipeTransform {
  private readonly allowedValues = [
    LinkTypeOptions.ALL,
    LinkTypeOptions.WITH_CUSTOM_BACK_HALVES,
    LinkTypeOptions.WITHOUT_CUSTOM_BACK_HALVES
  ];

  transform(value: any) {
    if (!this.isValid(value)) {
      throw new BadRequestException(`Invalid parameter link type`);
    }
    return value;
  }

  private isValid(value: any) {
    return this.allowedValues.includes(value);
  }
}
