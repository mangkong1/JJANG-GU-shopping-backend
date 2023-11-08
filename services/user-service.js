import { userModel } from '../db/models/user-model';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class UserService {
    constructor(userModel) {
      this.userModel = userModel;
    }

    async getUserToken(loginInfo) {
        const { email, password } = loginInfo;
    
        const user = await this.userModel.findByEmail(email);
        if (!user) {
          throw new Error('해당 이메일은 가입 내역이 없습니다. 다시 한 번 확인해 주세요.');
        }
    
        const correctPasswordHash = user.password;
        const isPasswordCorrect = await bcrypt.compare(
          password,
          correctPasswordHash
        );
    
        if (!isPasswordCorrect) {
          throw new Error(
            '비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요.'
          );
        }
    
        const secretKey = process.env.JWT_SECRET_KEY || 'secret-key';
        const token = jwt.sign({ userId: user._id, role: user.role }, secretKey);
        console.log(token);
        return { token };
    }

    async addUser(userInfo) {
        const { email, name, password, address, role, phone } = userInfo;
        const user = await this.userModel.findByEmail(email);
        if (user) {
          throw new Error(
            '이 이메일은 현재 사용중입니다. 다른 이메일을 입력해 주세요.'
          );
        }
    
        const hashedPassword = await bcrypt.hash(password, 10);
    
        const newUserInfo = {
          fullName,
          email,
          password: hashedPassword,
          address,
          role,
          phoneNumber,
        };
    
        const createdNewUser = await this.userModel.create(newUserInfo);
    
        return createdNewUser;
    }

    async getUser(userId) {
        return await this.userModel.findById(userId);
    }

    async getUsers() {
        return await this.userModel.findAll();
    }

    async updateUser(userInfoRequired, toUpdate) {
        const { userId, currentPassword } = userInfoRequired;
        let user = await this.userModel.findById(userId);
    
        if (!user) {
          throw new Error('가입 내역이 없습니다. 다시 한 번 확인해 주세요.');
        }
    
        const correctPasswordHash = user.password;
        const isPasswordCorrect = await bcrypt.compare(
          currentPassword,
          correctPasswordHash
        );
    
        if (!isPasswordCorrect) {
          throw new Error('현재 비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요.');
        }
    
        const { password } = toUpdate;
    
        if (password) {
          const newPasswordHash = await bcrypt.hash(password, 10);
          toUpdate.password = newPasswordHash;
        }
    
        user = await this.userModel.update({
          userId,
          update: toUpdate,
        });
    
        return user;
    }

    async removeUser(userId) {
        let User = await this.userModel.findById(userId);
        if (!User) {
          throw new Error('가입된 내역이 없습니다. 다시 한 번 확인해 주세요.');
        }
        User = await this.userModel.delete(userId);
        return User;
    }
}

const userService = new UserService(userModel);

export { userService };