import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class Group extends Model<Group> {
    @Column
    name: string;

    @Column({ defaultValue: null })
    icon: string;
}