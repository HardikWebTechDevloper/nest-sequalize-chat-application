import {
    Controller,
    Get,
    Req,
    Res,
    Put,
    Post,
    UseInterceptors,
    UploadedFile,
    HttpStatus,
    UseGuards
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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

    @UseGuards(AuthGuard)
    @Put('profile')
    @UseInterceptors(FileInterceptor('profile_picture'))
    getProfile(@Req() req, @UploadedFile() file, @Res() res) {
        (async () => {
            try {
                let body = req.body;
                let profilePicture = (file) ? file.filename : null;

                let userObject = {
                    firstName: body.first_name,
                    lastName: body.last_name,
                    phone: body.phone,
                    profilePicture: profilePicture
                };

                let user = await this.userService.updateUser(req.user.userId, userObject);

                if (user) {
                    let userProfile = await this.userService.findOne(req.user.userId);
                    return res.json(apiResponse(HttpStatus.OK, 'User profile has been updated successfully', { userProfile }, true));
                } else {
                    return res.json(apiResponse(HttpStatus.OK, 'Oops, something went wrong while updating user profile', {}, false));
                }
            } catch (error) {
                console.log(error);
                return res.json(apiResponse(HttpStatus.BAD_GATEWAY, error.message, {}, false));
            }
        })();
    }

}
