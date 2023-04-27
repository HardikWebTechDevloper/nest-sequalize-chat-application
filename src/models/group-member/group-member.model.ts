import { Column, Model, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Group } from 'src/models/group/group.model';
import { User } from 'src/models/user/user.model';

@Table
export class GroupMember extends Model<GroupMember> {
    @Column
    @ForeignKey(() => Group)
    groupId: number;

    @Column({ defaultValue: null })
    @ForeignKey(() => User)
    userId: number;

    // Define association
    @BelongsTo(() => Group)
    group: Group;
    @BelongsTo(() => User)
    user: User;
}