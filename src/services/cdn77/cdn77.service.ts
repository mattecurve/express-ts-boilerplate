import axios from 'axios';
import { ICdn77Service, ICdn77ServiceParams } from './types';

export class Cdn77Service implements ICdn77Service {
    private cdnResourceId: string;
    // private cdnBaseUrl: string;
    private apiUrl: string;
    private token: string;

    constructor(params: ICdn77ServiceParams) {
        this.cdnResourceId = params.cdnResourceId;
        // this.cdnBaseUrl = params.cdnBaseUrl;
        this.apiUrl = params.apiUrl;
        this.token = params.token;
    }

    async purge(paths: string[], upstreamHost?: string): Promise<boolean> {
        const apiURL = `${this.apiUrl}/${this.cdnResourceId}/job/purge`;
        await this.makeRequest(apiURL, { paths, upstreamHost });
        return Promise.resolve(true);
    }

    async prefetch(paths: string[], upstreamHost?: string): Promise<boolean> {
        const apiURL = `${this.apiUrl}/${this.cdnResourceId}/job/prefetch`;
        await this.makeRequest(apiURL, { paths, upstreamHost });
        return Promise.resolve(true);
    }

    private makeRequest(apiURL: string, inputs: any): Promise<any> {
        const options = {
            headers: { authorization: `Bearer ${this.token}` },
        };
        return axios.post(apiURL, inputs, options);
    }
}
