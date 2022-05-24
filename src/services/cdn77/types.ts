export interface ICdn77ServiceParams {
    cdnResourceId: string;
    cdnBaseUrl: string;
    apiUrl: string;
    token: string;
}

export interface ICdn77Service {
    purge(paths: string[], upstreamHost: string): Promise<boolean>;
    prefetch(paths: string[], upstreamHost: string): Promise<boolean>;
}
