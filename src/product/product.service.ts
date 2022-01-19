import { HttpException, Injectable } from "@nestjs/common";
import { ProductAddRequest } from "./dto/product-add-request.dto";
import { ProductRepository } from "./product.repository";
import { ProductImageRepository } from "./product-image.repositroy";
import { S3Service } from "./s3.service";
import { ProductFindQuery } from "./dto/product-find-query.dto";

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly productImageRepository: ProductImageRepository,
    private readonly s3Service: S3Service
  ) {}

  async getProducts(query: ProductFindQuery) {
    return await this.productRepository.findProductsByQueries(query);
  }

  async createProduct(
    productBody: ProductAddRequest,
    image: Express.Multer.File
  ) {
    const product = await this.productRepository.createProduct(productBody);
    const fileName = `${Date.now().toString()}-${image.originalname}`;
    //this.s3Service.pubObject(fileName, image);
    //this.productImageRepository.createImage(fileName, product);
  }
}
