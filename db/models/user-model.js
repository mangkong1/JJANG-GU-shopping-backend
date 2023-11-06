import { model, Types } from 'mongoose';
import { UserSchema } from '../schemas/user-schema';

const User = model('users', UserSchema);

export class UserModel {
    
    // 유저 생성
    async create(userInfo) {
        try {
            const userResult = await User.create(userInfo);
            return userResult;
        } catch (error) {
            // 오류 처리 코드 추가
            throw new Error('유저 생성 중 오류 발생');
        }
    }
    
    // 유저 조회
    async findByEmail(email) {
        try {
            const userResult = await User.aggregate([
                {
                    $match: { email: email }
                }
            ]);
            return userResult[0]; // 결과는 배열로 반환되므로 첫 번째 항목을 반환
        } catch (error) {
            // 오류 처리 코드 추가
            throw new Error('유저 조회 중 오류 발생');
        }
    }

    async findById(userId) {
        try {
            const userResult = await User.aggregate([
                {
                    $match: { _id: Types.ObjectId(userId) }
                }
            ]);
            return userResult[0]; // 결과는 배열로 반환되므로 첫 번째 항목을 반환
        } catch (error) {
            // 오류 처리 코드 추가
            throw new Error('유저 조회 중 오류 발생');
        }
    }

    async findAll() {
        try {
            const userResult = await User.aggregate([
                {
                    $project: { password: 0 }
                }
            ]);
            return userResult;
        } catch (error) {
            // 오류 처리 코드 추가
            throw new Error('유저 조회 중 오류 발생');
        }
    }

    // 유저 정보 수정

    // 유저 정보 삭제
    async delete(userId) {
        try {
            const userResult = await Order.deleteOne({ _id: userId });
            const message = userResult.deletedCount > 0 ? '유저 삭제 완료' : '삭제할 유저 정보가 없습니다.';
            return { message };
        } catch (error) {
            // 오류 처리 코드 추가
            throw new Error('유저 정보 삭제 중 오류 발생');
        }
    }
}

const userModel = new UserModel();

export { userModel };