import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Group } from './group.model';

@Module({
    imports: [SequelizeModule.forFeature([Group])],
    exports: [SequelizeModule]
})
export class GroupModule { }
