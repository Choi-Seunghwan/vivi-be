import { IsOptional, IsString } from 'class-validator';

export class StorageUploadDto {
  @IsOptional()
  @IsString()
  path?: string;
}
