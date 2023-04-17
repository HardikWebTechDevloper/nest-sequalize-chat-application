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
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/auth/auth.guard';
import { apiResponse } from 'src/helpers/api-response.helper';
import { encryptPassword } from 'src/helpers/password-encryption.helper';
import { AuthService } from 'src/services/auth/auth.service';
import { UserService } from 'src/services/user/user.service';

@Controller('auth')
export class AuthController {

    constructor(
        private userService: UserService,
        private authService: AuthService,
    ) { }

    @Post('register')
    @UseInterceptors(FileInterceptor('profile_picture'))
    register(@Req() request: Request, @UploadedFile() file, @Res() res) {
        (async () => {
            try {
                let body: any = request.body;
                let profilePicture = (file) ? file.filename : null;

                // Check Unique Email
                let uniqueEmail = await this.userService.findUniqueEmail(body.email);

                // Check Unique Phone
                let uniquePhone = await this.userService.findUniquePhone(body.phone);

                if (uniqueEmail && uniqueEmail > 0) {
                    return res.json(apiResponse(HttpStatus.OK, 'Email is already exists in our records', {}, false));
                } else if (uniquePhone && uniquePhone > 0) {
                    return res.json(apiResponse(HttpStatus.OK, 'Phone is already exists in our records', {}, false));
                } else {
                    let encryptedPsw = await encryptPassword(body.password);

                    let userObject = {
                        firstName: body.first_name,
                        lastName: body.last_name,
                        password: encryptedPsw,
                        email: body.email,
                        phone: body.phone,
                        profilePicture: profilePicture
                    };

                    let user = await this.userService.createUser(userObject);

                    if (user) {
                        return res.json(apiResponse(HttpStatus.OK, 'User has been created successfully', { user }, true));
                    } else {
                        return res.json(apiResponse(HttpStatus.OK, 'Oops, something went wrong while creating the user', {}, false));
                    }
                }
            } catch (error) {
                return res.json(apiResponse(HttpStatus.BAD_GATEWAY, error.message, {}, false));
            }
        })();
    }

    @Post('login')
    login(@Req() request: Request, @Res() res) {
        (async () => {
            try {
                let { email, password }: any = request.body;

                let user = await this.authService.signIn(email, password);
                return res.json(user);
            } catch (error) {
                return res.json(apiResponse(HttpStatus.BAD_GATEWAY, error.message, {}, false));
            }
        })();
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Req() req) {
        return req.user;
    }
}
