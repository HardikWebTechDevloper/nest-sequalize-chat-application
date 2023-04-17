import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class User extends Model<User> {
    @Column
    firstName: string;

    @Column
    lastName: string;

    @Column
    email: string;

    @Column
    phone: string;

    @Column
    password: string;

    @Column({ defaultValue: null })
    profilePicture: string;

    @Column({ defaultValue: true })
    isActive: boolean;
}