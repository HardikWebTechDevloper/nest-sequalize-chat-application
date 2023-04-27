import { Column, Model, Table, HasMany } from 'sequelize-typescript';
import { GroupMember } from 'src/models/group-member/group-member.model';

@Table
export class Group extends Model<Group> {
    @Column
    name: string;

    @Column({ defaultValue: null })
    icon: string;

    // Define association
    @HasMany(() => GroupMember)
    groupMembers: GroupMember[];
}