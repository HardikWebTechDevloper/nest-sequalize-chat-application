import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '@nestjs/config';
import { diskStorage } from 'multer';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService } from './services/user/user.service';
import { UserModule } from './models/user/user.module';
import { User } from './models/user/user.model';
import { AuthController } from './controllers/auth/auth.controller';
import { AuthService } from './services/auth/auth.service';
import { GroupService } from './services/group/group.service';
import { GroupController } from './controllers/group/group.controller';
import { GroupModule } from './models/group/group.module';
import { Group } from './models/group/group.model';
import { GroupMemberModule } from './models/group-member/group-member.module';
import { GroupMember } from './models/group-member/group-member.model';
import { UserController } from './controllers/user/user.controller';
import { AppGateway } from './app.gateway';

// File upload
const storage = diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    let fileFormat = file.mimetype.split('/');
    let extension = (fileFormat && fileFormat.length > 0 && fileFormat[1]) ? fileFormat[1] : '';
    const uniqueSuffix = Date.now() + '-' + (Math.round(Math.random() * 1e9));
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + extension);
  }
});

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: "127.0.0.1",
      port: 5432,
      username: "avcuser",
      password: "avcpass",
      database: "avcdb",
      models: [User, Group, GroupMember],
      // autoLoadModels: true,
      // synchronize: true,
    }),
    UserModule,
    MulterModule.register({ storage }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7200s' },
    }),
    GroupModule,
    GroupMemberModule,
  ],
  controllers: [AppController, AuthController, GroupController, UserController],
  providers: [AppService, UserService, AuthService, GroupService, AppGateway],
})
export class AppModule { }
