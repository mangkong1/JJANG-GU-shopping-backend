import { productModel } from "../db/models/product-model.js";

class ProductService {
    constructor(productModel) {
      this.productModel = productModel;
    }
    async addProduct({
        name,
        price,
        stock,
        description,
        images,
        category,
    }) {
        const product = await this.productModel.findByName(name);

        if (product) {
          throw new Error(
            '이 상품명은 현재 사용중입니다. 다른 상품명으로 입력해 주세요.'
          );
        }

        const createdNewProduct = await this.productModel.create({
            name,
            price,
            stock,
            description,
            images,
            category,
        });
        return createdNewProduct;
    }

    async getProducts(page, perPage) {
        let products;

        if ((page, perPage)) {
            products = await this.productModel
            .findAll()
            .skip(perPage * (page - 1))
            .limit(perPage);
        } else {
            products = await this.productModel.findAll();
        }

        return products;
    }

    async getProductsByCategoryId(categoryId) {
        return await this.productModel.findByCategoryId(categoryId);
    }

    async getProduct(productId) {
        const product = await this.productModel.findById(productId);
    
        if (!product) {
          throw new Error('등록된 상품이 없습니다. 다시 한 번 확인해 주세요.');
        }
    
        return product;
    }

    async updateProduct(productInfoRequired, toUpdate) {
        const { productId } = productInfoRequired;
        let product = await this.productModel.findById(productId);
    
        if (!product) {
          throw new Error('등록된 상품이 없습니다. 다시 한 번 확인해 주세요.');
        }
    
        product = await this.productModel.update({
          productId,
          update: toUpdate,
        });
    
        return product;
    }

    async removeProduct(productId) {
        let product = await this.productModel.findById(productId);
    
        if (!product) {
          throw new Error('등록된 상품이 없습니다. 다시 한 번 확인해 주세요.');
        }
    
        product = await this.productModel.delete(productId);
    
        return product;
    }
  }
  
  const productService = new ProductService(productModel);
  
  export { productService };