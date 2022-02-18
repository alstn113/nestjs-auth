import { Public } from "@/common/decorators";
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { ProductAddRequest } from "./dto/product-add-request.dto";
import { ProductFindQuery } from "./dto/product-find-query.dto";
import { ProductService } from "./product.service";

@Public()
@Controller("products")
@ApiTags("products")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOperation({
    summary: "제품 검색",
    description: "제품의 정보들을 검색한다",
  })
  @ApiQuery({ name: "page", example: 1, required: false })
  @ApiQuery({
    name: "size",
    example: 10,
    required: false,
    enum: ["10", "5", "15"],
  })
  @ApiQuery({ name: "order", example: "asc", required: false })
  async getProducts(@Query() query: ProductFindQuery) {
    return await this.productService.getProducts(query);
  }

  @Post()
  @UseInterceptors(FileInterceptor("image"))
  async addProduct(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: ProductAddRequest
  ) {
    return await this.productService.createProduct(body, file);
  }
}
