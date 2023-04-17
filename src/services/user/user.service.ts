import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/models/user/user.model';
import { Op } from 'sequelize'

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User) private userModel: typeof User,
    ) { }

    async findAll(): Promise<User[]> {
        return this.userModel.findAll();
    }

    findOne(id: Number): Promise<User> {
        return this.userModel.findOne({
            where: {
                id,
            },
        });
    }

    findOneByEmail(email: string): Promise<User> {
        return this.userModel.findOne({
            where: {
                email,
            },
        });
    }

    findUniqueEmail(email: string) {
        let result = this.userModel.count({
            where: { email },
        });
        return result;

    }

    findUniquePhone(phone: string) {
        let result = this.userModel.count({
            where: { phone },
        });
        return result;

    }

    createUser(body: {}) {
        let result = this.userModel.create(body);
        return result;
    }
}
