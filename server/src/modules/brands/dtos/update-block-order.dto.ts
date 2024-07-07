import { IsArray } from "class-validator";

export class UpdateBlockOrderDto {
  @IsArray()
  ids: number[];
}