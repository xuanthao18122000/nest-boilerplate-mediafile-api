import { ApiProperty } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsObject, IsString, Min } from 'class-validator';

export class BaseFilter {
  @ApiProperty({
    description: 'Skip one or many item ( Skip > 0 )',
    example: 1,
    required: false,
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  @Min(1, {
    message: 'min-{"ln":1,"count":1}'
  })
  page: number;

  @ApiProperty({
    description: 'Take number of item in a page',
    example: 10,
    required: false,
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  @Min(1, {
    message: 'min-{"ln":1,"count":1}'
  })
  perPage: number;

  @ApiProperty({
    description: 'Filter Fields',
    example: { name: '' },
    required: false,
  })
  @Transform(({ value }) => {
    try {
      return JSON.parse(value);
    } catch (err) {
      return false;
    }
  })
  @IsObject({
    message: 'Invalid filter',
  })
  @IsOptional()
  filter: Record<string, any> = {};
}
