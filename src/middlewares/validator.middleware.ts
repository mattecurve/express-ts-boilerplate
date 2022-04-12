import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import { IAuthTokenService } from '../services/service.interface';

export const validateRequestBody = (schema: Joi.Schema) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body);
        if (error && error.details) {
            res.status(422).send({
                errors: error.details,
            });
        } else {
            next();
        }
    };
};

export const validateUserAuthentication = (authTokenService: IAuthTokenService) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return async (req: Request, res: Response, next: NextFunction) => {
        const bearerHeader = req.headers.authorization;
        if (!bearerHeader) {
            res.status(403).json({ error: 'No credentials sent!' });
        } else {
            const parts = bearerHeader.split(/\s+/);
            if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer' || parts[1].split('.').length !== 3) {
                res.status(403);
            } else {
                const bearerToken = parts[1];
                try {
                    const authTokenValidation = await authTokenService.validateToken(bearerToken);
                    req.user = {
                        id: authTokenValidation.id,
                    };
                    next();
                } catch (e) {
                    res.status(403);
                }
            }
        }
    };
};
