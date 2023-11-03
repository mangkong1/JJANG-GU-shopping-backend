import { model } from "mongoose";
import { ProductSchema } from "../schemas/product-schema";

const Product = model('products', ProductSchema);

export class ProductModel {
    
    //상품 등록
    async create(productInfo) {
        try {
            const productResult = await Product.create(productInfo);
            return productResult;
        } catch (error) {
            // 오류 처리 코드 추가
            throw new Error('상품 등록 중 오류 발생');
        }
    }
    
    //상품 조회
    async findByName(name) {
        try {
            const productResult = await Product.findOne({ name });
            return productResult;
        } catch (error) {
            // 오류 처리 코드 추가
            throw new Error('상품 조회 중 오류 발생');
        }
    }

    async findById(productId) {
        try {
            const productResult = await Product.findOne({ _id: productId }).populate(
                'category',
                '_id, name'
            );
            return productResult;
        } catch (error) {
            // 오류 처리 코드 추가
            throw new Error('상품 조회 중 오류 발생');
        }
    }

    async findByCategoryId(categoryId) {
        try {
            const productResult = await Product.find({ category: categoryId }).populate(
                'category',
                '_id, name'
            );
        } catch (error) {
            // 오류 처리 코드 추가
            throw new Error('상품 조회 중 오류 발생');
        }
    }

    async findAll() {
        try {
            const productModel = await Product.find({}).populate(
                'category',
                '_id, name'
            );
        } catch (error) {
            // 오류 처리 코드 추가
            throw new Error('상품 조회 중 오류 발생');
        }
    }

    //상품 수정

    //상품 삭제
    async delete(productId) {
        try {
            const productResult = await Product.deleteOne({ _id: productId });
            if (productResult.deletedCount > 0) {
                return { message: '상품 삭제 성공' };
            } else {
                return { message: '삭제할 상품이 없습니다.'};
            }
        } catch (error) {
            // 오류 처리 코드 추가
            throw new Error('상품 삭제 중 오류 발생');
        }
    }
}

const productModel = new ProductModel();

export { productModel };