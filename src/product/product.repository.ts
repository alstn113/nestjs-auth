import { EntityRepository, Repository } from "typeorm";
import { ProductAddRequest } from "./dto/product-add-request.dto";
import { ProductFindQuery } from "./dto/product-find-query.dto";
import { Product } from "./entities/product.entity";

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
  async findProductsByQueries(query: ProductFindQuery) {
    const START_PAGE = 1;
    const PRODUCT_PER_PAGE = [5, 10, 15];
    const ORDER_TYPE = {
      default: { "product.id": "DESC" },
      priceAsc: { "product.price": "ASC" },
      priceDesc: { "product.price": "DESC" },
    };

    const size =
      query.size && PRODUCT_PER_PAGE.includes(query.size)
        ? query.size
        : PRODUCT_PER_PAGE[0];

    const totalCount = await this.count();
    const totalPage = Math.ceil(totalCount / size);
    const page =
      query.page && Number.isInteger(+query.page) && query.page > 0
        ? query.page > totalPage
          ? totalPage
          : query.page
        : START_PAGE;

    const order =
      query.order && query.order in ORDER_TYPE
        ? ORDER_TYPE[query.order]
        : ORDER_TYPE["default"];

    const take = size;
    const skip = (page - 1) * size;

    const queryBuilder = this.createQueryBuilder("product")
      .leftJoinAndSelect("product.image", "image")
      .take(take)
      .skip(skip)
      .orderBy(order)
      .getMany();
    return queryBuilder;
  }

  createProduct(product: ProductAddRequest) {
    const result = this.create(product);
    return this.save(result);
  }
}
