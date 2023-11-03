import { model, Types } from 'mongoose';
import { CategorySchema } from '../schemas/category-schema';

const Category = model('categories', CategorySchema);

export class CategoryModel {
    
    // 카테고리 생성
    async create({ name }) {
        try{
            const categoryResult = await Category.create({ name });
            return categoryResult;
        } catch (error) {
            // 오류 처리 코드 추가
            throw new Error('카테고리 생성 중 오류 발생');
        }
    }
    
    // 카테고리 조회
    async findByName(name) {
        try {
            const categoryResult = await Category.findOne({ name });
            return categoryResult;
        } catch (error) {
            throw new Error('카테고리 조회 중 오류 발생');
        }
    }
    async findById(categoryId) {
        try{
            const categoryResult = await Category.aggregate([
                {
                    $lookup: {
                        from: 'products',  // join할 collection -> products
                        localField: '_id',  // 현재 collection에서 비교할 key값 -> 카테고리 아이디 '_id'
                        foreignField: 'category', // join할 collection에서 비교할 key값 -> products에 저장된 'category'
                        as: 'products', // join 후 새로 생성될 필드명
                    },
                },
                {
                    $match: {
                        _id: Types.ObjectId(categoryId), //해당 쿼리/조건에 일치하는 값만 반환
                    },
                },
            ]).exec();

            if(categoryResult.length > 0) {
                return categoryResult[0];
            } else {
                return null; // 해당 카테고리를 찾지 못한 경우
            }
        } catch (error) {
            // 오류 처리 코드 추가
            throw new Error('카테고리 조회 중 오류 발생');
        }
    }

    //카테고리 전체 조회
    async findAll() {
        try{
            const categoryResult = await Category.aggregate([
                {
                    $lookup: {
                        from: 'products',  // join할 collection -> products
                        localField: '_id',  // 현재 collection에서 비교할 key값 -> 카테고리 아이디 '_id'
                        foreignField: 'category', // join할 collection에서 비교할 key값 -> products에 저장된 'category'
                        as: 'products', // join 후 새로 생성될 필드명
                    },
                },
            ]).exec();

            return categoryResult;
        } catch (error) {
            // 오류 처리 코드 추가
            throw new Error('카테고리 조회 중 오류 발생');
        }
    }

    // 카테고리 수정

    // 카테고리 삭제
    async delete(categoryId) {
        try {
            const categoryResult = await Category.deleteOne({ _id: categoryId });

            if (categoryResult.deletedCount > 0) {
                return {message: '카테고리 삭제 성공'};
            } else {
                return {message: '삭제할 카테고리가 없습니다.'};
            }
        } catch (error) {
            // 오류 처리 코드 추가
            throw new Error('카테고리 삭제 중 오류 발생');
        }
    }
}

const categoryModel = new CategoryModel();

export { categoryModel };