import { Module } from "@nestjs/common";
import { ProductService } from "@/product/product.service";
import { ProductController } from "@/product/product.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductRepository } from "./product.repository";
import { S3Service } from "./s3.service";
import { ProductImageRepository } from "./product-image.repositroy";

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductRepository, ProductImageRepository]),
  ],
  controllers: [ProductController],
  providers: [ProductService, S3Service],
})
export class ProductModule {}
