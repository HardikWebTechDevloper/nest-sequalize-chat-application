import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class GroupMember extends Model<GroupMember> {
    @Column
    groupId: number;

    @Column({ defaultValue: null })
    userId: number;
}