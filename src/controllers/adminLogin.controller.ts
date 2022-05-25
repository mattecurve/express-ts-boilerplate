import { Request, Response } from 'express';
import { Model } from 'mongoose';
import bcrypt from 'bcrypt';
import Joi from 'joi';
import { IUser } from '../db/interfaces';
import { ILogger } from '../interfaces';
import { IAdminLoginController } from './controller.interface';
import { IAuthTokenService } from '../services/service.interface';
import { HttpException } from '../error';
import { RoleTypes } from '../db';

interface AdminLoginControllerParams {
    userRepository: Model<IUser>;
    authTokenService: IAuthTokenService;
    logger: ILogger;
}

export const AdminLoginApiSchema = {
    login: Joi.object({
        username: Joi.string().trim().normalize().required(),
        password: Joi.string().trim().normalize().required(),
    }).required(),
};

export class AdminLoginController implements IAdminLoginController {
    userRepository: Model<IUser>;
    authTokenService: IAuthTokenService;
    logger: ILogger;

    constructor(params: AdminLoginControllerParams) {
        this.userRepository = params.userRepository;
        this.authTokenService = params.authTokenService;
        this.logger = params.logger;
    }

    async login(req: Request, res: Response): Promise<Response> {
        const adminUser = await this.userRepository.findOne({
            username: req.body.username,
            role: RoleTypes.Admin,
        });
        if (!adminUser) {
            throw new HttpException(404, 'Not found');
        }

        const isPasswordSame = await bcrypt.compare(req.body.password, adminUser.password || '');
        if (!isPasswordSame) {
            throw new HttpException(404, 'Not found');
        }

        const tokenResponse = await this.authTokenService.createToken(adminUser._id.toString());
        return res.json(tokenResponse);
    }
}
