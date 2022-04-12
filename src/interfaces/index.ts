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
