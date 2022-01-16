import { EntityRepository, Repository } from "typeorm";
import { ProductImage } from "./entities/product-image.entity";

@EntityRepository(ProductImage)
export class ProductImageRepository extends Repository<ProductImage> {
  createImage(fileName: string, product) {
    const image = this.create({ id: fileName, product });
    return this.save(image);
  }
}
