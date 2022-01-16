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
  createProduct(@Body() body: ProductRequest) {
    return this.productService.createProduct(body);
  }

  @Post("image")
  @UseInterceptors(FileInterceptor("image"))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    try {
      const data = await this.productService.uploadImage(file);
      return { message: `Image ${file.originalname} upload to S3`, data };
    } catch (error) {
      return { message: `Failed to upload image to S3: ${error.message}` };
    }
  }
}
