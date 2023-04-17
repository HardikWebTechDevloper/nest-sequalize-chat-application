import { Module } from '@nestjs/common';
import { GroupMember } from './group-member.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
    imports: [SequelizeModule.forFeature([GroupMember])],
    exports: [SequelizeModule]
})
export class GroupMemberModule {}
