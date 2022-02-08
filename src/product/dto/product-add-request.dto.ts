import { ApiProperty } from "@nestjs/swagger";

export class ProductAddRequest {
  @ApiProperty()
  name: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  stock: number;

  @ApiProperty()
  deliveryFee: number;
}
