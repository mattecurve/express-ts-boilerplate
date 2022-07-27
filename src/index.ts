import { ApiApp } from './bin';

const app = new ApiApp({
    initRpcClient: true,
    initRpcServer: true,
});
app.bootstrap().then(() => {
    app.serve();
});
