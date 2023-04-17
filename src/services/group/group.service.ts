import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { GroupMember } from 'src/models/group-member/group-member.model';
import { Group } from 'src/models/group/group.model';

@Injectable()
export class GroupService {
    constructor(
        @InjectModel(Group) private groupModel: typeof Group,
        @InjectModel(GroupMember) private groupMemberModel: typeof GroupMember,
    ) { }

    async findUniqueGroupName(name: string) {
        let result = await this.groupModel.count({
            where: { name },
        });
        return result;

    }

    async createGroup(body: {}) {
        let result = await this.groupModel.create(body);
        return result;
    }

    async createGroupMember(body: []) {
        const result = await this.groupMemberModel.bulkCreate(body);
        return result;
    }
}
