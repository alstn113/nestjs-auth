import { EntityRepository, Repository } from "typeorm";
import { ProductRequest } from "./dto/product.dto";
import { Product } from "./entities/product.entity";

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
  findProducts() {
    return this.find();
  }

  findProductById(productId: number) {
    return this.findOne(productId);
  }

  createProduct(product: ProductRequest) {
    return this.insert(product);
  }
}
