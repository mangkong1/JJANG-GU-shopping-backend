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
                    $match: { _id: Types.ObjectId(categoryId) } //해당 쿼리/조건에 일치하는 값만 반환
                },
                {
                    $lookup: {
                        from: 'products',  // join할 collection -> products
                        localField: '_id',  // 현재 collection에서 비교할 key값 -> 카테고리 아이디 '_id'
                        foreignField: 'category', // join할 collection에서 비교할 key값 -> products에 저장된 'category'
                        as: 'products', // join 후 새로 생성될 필드명
                    }
                }
            ]);
            return categoryResult[0];
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
                    }
                }
            ]);
            return categoryResult;
        } catch (error) {
            // 오류 처리 코드 추가
            throw new Error('카테고리 조회 중 오류 발생');
        }
    }

    // 카테고리 수정
    async update({ categoryId, update }) {
        const filter = { _id: categoryId };
        const updateResult = await Category.updateOne(filter, update);
    
        if (updateResult.nModified === 0) {
            // 업데이트된 카테고리 수정이 없는 경우 nModified
            throw new Error('업데이트할 카테고리를 찾을 수 없습니다.');
        }
    
        return { message: '카테고리 업데이트 완료' };
    }

    // 카테고리 삭제
    async delete(categoryId) {
        try {
            const categoryResult = await Category.deleteOne({ _id: categoryId });
            const message = categoryResult.deletedCount > 0 ? '카테고리 삭제 성공' : '삭제할 카테고리가 없습니다.';
            return { message };
        } catch (error) {
            // 오류 처리 코드 추가
            throw new Error('카테고리 삭제 중 오류 발생');
        }
    }
}

const categoryModel = new CategoryModel();

export { categoryModel };