import { EntityRepository, Repository } from "typeorm";
import { ProductRequest } from "./dto/product.dto";
import { Product } from "./entities/product.entity";

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
  findProducts() {
    return this.find({ relations: ["image"] });
  }

  findProductById(productId: number) {
    return this.findOne(productId, { relations: ["image"] });
  }

  createProduct(dto: ProductRequest) {
    const product = this.create(dto);
    return this.save(product);
  }
}
