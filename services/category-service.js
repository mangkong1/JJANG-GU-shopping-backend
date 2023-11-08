import { categoryModel } from "../db/models/category-model";

class CategoryService {
    constructor(categoryModel) {
        this.categoryModel = categoryModel;
    }

    // 카테고리 생성
    async addCategory(categoryInfo) {
        const { name } = categoryInfo;
        const category = await this.categoryModel.findByName(name);

        if (category) {
            throw new Error('해당 카테고리명은 현재 사용 중입니다. 다른 카테고리명을 입력해주세요.');
        }
        return await this.categoryModel.create(categoryInfo);
    }

    // 카테고리 조회
    async getCategories() {
        return await this.categoryModel.findAll();
    }

    async getCategory(categoryId) {
        return await this.categoryModel.findById(categoryId);
    }

    // 카테고리 업데이트
    async updateCategory(categoryInfoRequired, toUpdate) {
        const { categoryId } = categoryInfoRequired;
        let category = await this.categoryModel.findById(categoryId);
    
        if (!category) {
          throw new Error('등록된 카테고리가 없습니다. 다시 한 번 확인해 주세요.');
        }
    
        category = await this.categoryModel.update({
          categoryId,
          update: toUpdate,
        });
    
        return category;
    }

    // 카테고리 제거
    async remove(categoryId) {
        const category = await this.categoryModel.findById(categoryId);
    
        if (!category) {
          throw new Error('등록된 카테고리가 없습니다. 다시 한 번 확인해 주세요.');
        }
    
        category = await this.categoryModel.delete(categoryId);
        return category;
    }
}

const categoryService = new CategoryService(categoryModel);

export { categoryService };