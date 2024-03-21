import { DataSource } from "typeorm";
import { Product } from "../database/entities/collection";

export interface ListProductFilter {
    limit: number
    page: number
    priceMax?: number
}

export interface UpdateProductParams {
    price?: number
}

export class ProductUsecase {
    constructor(private readonly db: DataSource) { }

    async listProduct(listProductFilter: ListProductFilter): Promise<{ products: Product[]; totalCount: number; }> {
        console.log(listProductFilter)
        const query = this.db.createQueryBuilder(Product, 'product')
        if (listProductFilter.priceMax) {
            query.andWhere('product.price <= :priceMax', { priceMax: listProductFilter.priceMax })
        }
        query.skip((listProductFilter.page - 1) * listProductFilter.limit)
        query.take(listProductFilter.limit)

        const [products, totalCount] = await query.getManyAndCount()
        return {
            products,
            totalCount
        }
    }

    async updateProduct(id: number, { price }: UpdateProductParams): Promise<Product | null> {
        const repo = this.db.getRepository(Product)
        const productfound = await repo.findOneBy({ id })
        if (productfound === null) return null

        if (price) {
            productfound.price = price
        }

        const productUpdate = await repo.save(productfound)
        return productUpdate
    }
}