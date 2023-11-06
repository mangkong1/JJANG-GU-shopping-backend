import { model, Types } from "mongoose";
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
            const productResult = await Product.aggregate([
                {
                    $match: { name: name }
                }
            ]);
            return productResult[0];
        } catch (error) {
            // 오류 처리 코드 추가
            throw new Error('상품 조회 중 오류 발생');
        }
    }

    async findById(productId) {
        try {
            // 1. `$match` 단계: MongoDB에서 `_id`가 `productId`와 일치하는 상품을 필터링
            const productResult = await Product.aggregate([
                {
                    $match: { _id: Types.ObjectId(productId) }
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
                        category: { _id:1, name: 1}
                    }
                }
            ]);
            // 4. 반환: 조회된 결과가 배열로 반환되므로 첫 번째 항목을 반환.
            return productResult[0];
        } catch (error) {
            // 오류 처리 코드 추가
            throw new Error('상품 조회 중 오류 발생');
        }
    }

    async findByCategoryId(categoryId) {
        try {
            const productResult = await Product.aggregate([
                {
                    $match: { category: Types.ObjectId(categoryId) }
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
                        category: { _id: 1, name: 1 }
                    }
                }
            ]);
            return productResult;
        } catch (error) {
            // 오류 처리 코드 추가
            throw new Error('상품 조회 중 오류 발생');
        }
    }

    async findAll() {
        try {
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
                        category: { _id: 1, name: 1 }
                    }
                }
            ]);
            return productResult;
        } catch (error) {
            // 오류 처리 코드 추가
            throw new Error('상품 조회 중 오류 발생');
        }
    }

    //상품 수정
    async update({ productId, update }) {
        const filter = { _id: productId };
        const updateResult = await Product.updateOne(filter, update);
    
        if (updateResult.nModified === 0) {
            // 업데이트된 카테고리 수정이 없는 경우 nModified
            throw new Error('업데이트할 상품을 찾을 수 없습니다.');
        }

        return { message: '상품 정보 업데이트 완료' };
    }

    //상품 삭제
    async delete(productId) {
        try {
            const productResult = await Product.deleteOne({ _id: productId });
            const message = productResult.deletedCount > 0 ? '상품 삭제 성공' : '삭제할 상품이 없습니다.';
            return { message };
        } catch (error) {
            // 오류 처리 코드 추가
            throw new Error('상품 삭제 중 오류 발생');
        }
    }
}

const productModel = new ProductModel();

export { productModel };