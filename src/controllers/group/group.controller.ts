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
import { Group } from 'src/models/group/group.model';
import { GroupMember } from 'src/models/group-member/group-member.model';
import { User } from 'src/models/user/user.model';
import { InjectModel } from '@nestjs/sequelize';
import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Model } from 'sequelize';

@Controller('group')
export class GroupController {
    constructor(private groupService: GroupService,
        @InjectModel(Group) private groupModel: typeof Group,
        @InjectModel(GroupMember) private groupMemberModel: typeof GroupMember,
        @InjectModel(User) private userModel: typeof User
    ) { }

    /**
     * @description Create group and add member inside group
     * @param {*} req
     * @param {*} file
     * @param {*} res
     * @memberof GroupController
     */
    @UseGuards(AuthGuard)
    @Post('create')
    @UseInterceptors(FileInterceptor('icon'))
    createGroup(@Req() req, @UploadedFile() file, @Res() res) {
        (async () => {
            try {
                let { group_name, group_users } = req.body;
                let groupIcon = (file) ? file.filename : null;

                //group_users = (group_users) ? Array.from(group_users) : [];

                let group = await this.groupService.createGroup({
                    name: group_name,
                    icon: groupIcon
                });
                if (group) {
                    let groupId = group.id;

                    if (group_users && group_users.split(",").length > 0) {
                        let userGroup = group_users.split(",").map((userId: any) => {
                            let element: any = {
                                groupId,
                                userId
                            };
                            return element;
                        });

                        let isCreated = await this.groupService.createGroupMember(userGroup);

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

    @UseGuards(AuthGuard)
    @Get('allgroups')
    async getAllGroup(@Req() req, @Res() res) {
        try {
            let groups = await this.groupModel.findAll({
                attributes: ['id', 'name', 'icon'],
                include: [{
                    model: this.groupMemberModel, // Use 'model' instead of 'Model'
                    as: 'groupMembers',
                    attributes: ['userId'],
                    include: [{
                        model: this.userModel, // Use 'model' instead of 'Model'
                        as: 'user',
                        attributes: ['id','firstName', 'lastName', 'email', 'profilePicture']
                    }]
                }],
            });

            return res.json(apiResponse(HttpStatus.OK, 'Success', groups, true));
        } catch (error) {
            return res.json(apiResponse(HttpStatus.BAD_GATEWAY, error.message, [], false));
        }
    }
}