import { Public } from "@/common/decorators";
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ProductRequest } from "./dto/product.dto";
import { ProductService } from "./product.service";

@Public()
@Controller("products")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  findProducts() {
    return this.productService.findProducts();
  }

  @Get("/:productId")
  findProductById(@Param("productId") productId: number) {
    return this.productService.findProductById(productId);
  }

  @Post()
  @UseInterceptors(FileInterceptor("image"))
  async createProduct(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: ProductRequest
  ) {
    return await this.productService.createProduct(body, file);
  }
}
