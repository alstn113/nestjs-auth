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
import { ProductAddRequest } from "./dto/product-add-request.dto";
import { ProductFindQuery } from "./dto/product-find-query.dto";
import { ProductService } from "./product.service";

@Public()
@Controller("products")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
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
