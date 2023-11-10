import { model, Types } from "mongoose";
import { ProductSchema } from "../schemas/product-schema.js";

const Product = model('products', ProductSchema);

export class ProductModel {
    
    //상품 등록
    async create(productInfo) {
        return await Product.create(productInfo);
    }
    
    //상품 조회
    async findByName(name) {
        const productResult = await Product.aggregate([
            {
                $match: { name: name }
            }
        ]);
        return productResult[0];
    }

    async findById(productId) {
        // 1. `$match` 단계: MongoDB에서 `_id`가 `productId`와 일치하는 상품을 필터링
        const productResult = await Product.aggregate([
            {
                $match: { _id: new Types.ObjectId(productId) }
            },
            // 2. `$lookup` 단계: `category` 필드와 `categories` 컬렉션을 연결하여 카테고리 정보를 가져옴.
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            // 3. `$project` 단계: 결과 문서를 필요한 필드만 선택하여 반환.
            {
                $project: {
                    _id: 1,
                    name: 1,
		    price: 1,
		    stock: 1,
		    images: 1,
		    description: 1,
                    category: { _id:1, name: 1}
                }
            }
        ]);
        // 4. 반환: 조회된 결과가 배열로 반환되므로 첫 번째 항목을 반환.
        return productResult[0];
    }

    async findByCategoryId(categoryId) {
        const productResult = await Product.aggregate([
            {
                $match: { category: new Types.ObjectId(categoryId) }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
		    price: 1,
		    stock: 1,
		    images: 1,
		    description: 1,
                    category: { _id: 1, name: 1 }
                }
            }
        ]);
        return productResult;
    }

    async findAll() {
        const productResult = await Product.aggregate([
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
		    price: 1,
		    stock: 1,
		    images: 1,
		    description: 1,
                    category: { _id: 1, name: 1 }
                }
            }
        ]);
        return productResult;
    }

    //상품 수정
    async update({ productId, update }) {
        const filter = { _id: productId };
        const updateResult = await Product.updateOne(filter, update);
    
        if (updateResult.nModified === 0) {
            // 업데이트된 카테고리 수정이 없는 경우 nModified
            throw new Error('업데이트할 상품을 찾을 수 없습니다.');
        }

        return updateResult;
    }

    //상품 삭제
    async delete(productId) {
        return await Product.deleteOne({ _id: productId });
    }
}

const productModel = new ProductModel();

export { productModel };
