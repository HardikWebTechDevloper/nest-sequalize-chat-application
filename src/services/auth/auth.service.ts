import { Injectable, HttpStatus } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { apiResponse } from 'src/helpers/api-response.helper';
import { validatePassword } from 'src/helpers/password-encryption.helper';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private userService: UserService, private jwtService: JwtService) { }

    async signIn(email: string, password: string): Promise<any> {
        const user = await this.userService.findOneByEmail(email);

        if (user && user != null) {
            let hashPassword = user.password;
            let isPasswordCorrect = await validatePassword(password, hashPassword);

            if (isPasswordCorrect) {
                const userDetails: any = { userId: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email };
                userDetails.accessToken = await this.jwtService.signAsync(userDetails);

                return apiResponse(HttpStatus.OK, 'Hooray! Your login attempt was successful', userDetails, true);
            } else {
                return apiResponse(HttpStatus.NOT_FOUND, 'We could not verify your password. Please ensure that you have entered the correct password', {}, false);
            }
        } else {
            return apiResponse(HttpStatus.NOT_FOUND, 'We are unable to find the requested user. Please check if you have entered the correct information', {}, false);
        }
    }
}
