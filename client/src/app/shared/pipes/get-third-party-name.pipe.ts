import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getThirdPartyName'
})
export class GetThirdPartyNamePipe implements PipeTransform {

  transform(value: string, provider: string = "github"): string {
    // Github
    const valueParameters = value.split("/");
    return valueParameters[valueParameters.length - 1];
  }

}
