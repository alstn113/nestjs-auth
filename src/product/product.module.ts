import { Module } from "@nestjs/common";
import { ProductService } from "@/product/product.service";
import { ProductController } from "@/product/product.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductRepository } from "./product.repository";
import { S3Service } from "./s3.service";

@Module({
  imports: [TypeOrmModule.forFeature([ProductRepository])],
  controllers: [ProductController],
  providers: [ProductService, S3Service],
})
export class ProductModule {}
