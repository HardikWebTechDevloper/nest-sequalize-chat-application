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
import { GroupService } from 'src/services/group/group.service';

@Controller('group')
export class GroupController {
    constructor(private groupService: GroupService) { }

    @UseGuards(AuthGuard)
    @Post('create')
    @UseInterceptors(FileInterceptor('icon'))
    createGroup(@Req() req, @UploadedFile() file, @Res() res) {
        (async () => {
            try {
                let { group_name, group_users } = req.body;
                let groupIcon = (file) ? file.filename : null;

                group_users = [1, 2, 4];
                group_users = (group_users) ? Array.from(group_users) : [];

                let group = await this.groupService.createGroup({
                    name: group_name,
                    icon: groupIcon
                });
                if (group) {
                    let groupId = group.id;

                    if (group_users && group_users.length > 0) {
                        let userGroup = group_users.map((userId: any) => {
                            let element: any = {
                                groupId,
                                userId
                            };
                            return element;
                        });

                        let isCreated = await this.groupService.createGroupMember(userGroup);
                        console.log(isCreated);

                        if (isCreated && isCreated.length > 0) {
                            return res.json(apiResponse(HttpStatus.OK, 'Woohoo! Your group has been successfully created', {}, true));
                        } else {
                            return res.json(apiResponse(HttpStatus.OK, 'Oops, something went wrong while adding the members in group.', {}, false));
                        }
                    } else {
                        return res.json(apiResponse(HttpStatus.OK, 'Woohoo! Your group has been successfully created', {}, true));
                    }
                } else {
                    return res.json(apiResponse(HttpStatus.OK, 'Oops, something went wrong while creating the group.', {}, false));
                }
            } catch (error) {
                return res.json(apiResponse(HttpStatus.BAD_GATEWAY, error.message, {}, false));
            }
        })();
    }
}