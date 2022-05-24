// define global enums or constants related to models here
export enum UserStatus {
    New = 'new',
    Active = 'active',
    Blocked = 'blocked',
}

export enum RoleTypes {
    User = 'user',
    Admin = 'admin',
}

export enum AmountType {
    Currency = 'currency',
    Bonus = 'bonus',
    Coin = 'coin',
}

export interface IAmount {
    value: number;
    type: AmountType;
    currency?: string;
}
