import { model } from 'mongoose';
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
            const userResult = await User.findOne({ email });
            return userResult;
        } catch (error) {
            // 오류 처리 코드 추가
            throw new Error('유저 조회 중 오류 발생');
        }
    }

    async findById(userId) {
        try {
            const userResult = await User.findOne({ _id: userId });
            return userResult;
        } catch (error) {
            // 오류 처리 코드 추가
            throw new Error('유저 조회 중 오류 발생');
        }
    }

    async findAll() {
        try {
            const userResult = await User.find({}, '-password');
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
            
            if (userResult.deletedCount > 0) {
                return { message: '유저 삭제 완료' };
            } else {
                return { message: '삭제할 유저 정보가 없습니다.'};
            }
        } catch (error) {
            // 오류 처리 코드 추가
            throw new Error('유저 정보 삭제 중 오류 발생');
        }
    }
}

const userModel = new UserModel();

export { userModel };