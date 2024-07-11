import { Transform, TransformFnParams } from "class-transformer";
import { IsArray, IsNotEmpty, isNumberString } from "class-validator";

export class SendInvitationDto {
  @IsArray()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => {
    
    return value.filter(
      (id: unknown) => typeof id === "number" || isNumberString(id)
    ).map(
      (id: string | number) => isNumberString(id) ? parseInt(id as string) : id
    );
  })
  ids: number[];
}