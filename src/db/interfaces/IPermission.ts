import { IBaseModel } from './IBase';

export interface IPermission extends IBaseModel {
    name: string;
    code: string;
    description: string;
}
