import { HttpException, Injectable } from "@nestjs/common";
import { ProductRequest } from "./dto/product.dto";
import { ProductRepository } from "./product.repository";
import { ProductImageRepository } from "./product-image.repositroy";
import { S3Service } from "./s3.service";

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly productImageRepository: ProductImageRepository,
    private readonly s3Service: S3Service
  ) {}

  async findProducts() {
    return await this.productRepository.findProducts();
  }

  async findProductById(productId: number) {
    const product = await this.productRepository.findProductById(productId);
    if (!product) {
      throw new HttpException("없어요 없어 하하!", 404);
    }
    return product;
  }

  async createProduct(productBody: ProductRequest, image: Express.Multer.File) {
    const fileName = `${Date.now().toString()}-${image.originalname}`;
    const product = await this.productRepository.createProduct(productBody);
    this.s3Service.pubObject(fileName, image);
    this.productImageRepository.createImage(fileName, product);
  }
}