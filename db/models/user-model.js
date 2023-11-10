import { model, Types } from 'mongoose';
import { UserSchema } from '../schemas/user-schema.js';

const User = model('users', UserSchema);

export class UserModel {
    
    // 유저 생성
    async create(userInfo) {
        return await User.create(userInfo);
    }
    
    // 유저 조회
    async findByEmail(email) {
        const userResult = await User.aggregate([
            {
                $match: { email: email }
            }
        ]);
        return userResult[0]; // 결과는 배열로 반환되므로 첫 번째 항목을 반환
    }

    async findById(userId) {
        const userResult = await User.aggregate([
            {
                $match: { _id: new Types.ObjectId(userId) }
            }
        ]);
        return userResult[0]; // 결과는 배열로 반환되므로 첫 번째 항목을 반환
    }

    async findAll() {
        const userResult = await User.aggregate([
            {
                $project: { password: 0 }
            }
        ]);
        return userResult;
    }

    // 유저 정보 수정
    async update({ userId, update }) {
        const filter = { _id: userId };
        const updateResult = await User.updateOne(filter, update);
    
        if (updateResult.nModified === 0) {
            // 업데이트된 카테고리 수정이 없는 경우 nModified
            throw new Error('업데이트할 유저 정보를 찾을 수 없습니다.');
        }

        return updateResult;
    }

    // 유저 정보 삭제
    async delete(userId) {
        return await User.deleteOne({ _id: userId });
    }
}

const userModel = new UserModel();

export { userModel };
