import {
    Controller,
    Get,
    Req,
    Res,
    Post,
    UseInterceptors,
    UploadedFile,
    HttpStatus,
    UseGuards
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth/auth.guard';
import { UserService } from 'src/services/user/user.service';
import { apiResponse } from 'src/helpers/api-response.helper';
import { User } from 'src/models/user/user.model';
import { InjectModel } from '@nestjs/sequelize';

@Controller('user')
export class UserController {
    constructor(
        private userService: UserService,
        @InjectModel(User) private userModel: typeof User
    ) { }

    @UseGuards(AuthGuard)
    @Get('get/all')
    async getAllUsers(@Req() req, @Res() res) {
        try {
            let users = await this.userModel.findAll({
                attributes: ['id', 'firstName', 'lastName', 'email', 'profilePicture']
            });

            return res.json(apiResponse(HttpStatus.OK, 'Success', users, true));
        } catch (error) {
            return res.json(apiResponse(HttpStatus.BAD_GATEWAY, error.message, [], false));
        }
    }

}
