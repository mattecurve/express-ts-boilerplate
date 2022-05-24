import winston from 'winston';

export interface AuthToken {
    id: string;
    token: string;
    expires: Date;
    now: Date;
    scopes: string[];
}

export interface AuthTokenValidation {
    id: string;
    scopes: string[];
}

export interface ILogger extends winston.Logger {}

export interface IPagination {
    offset: number;
    total: number;
    count: number;
    limit: number;
}
