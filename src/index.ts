import { ApiApp } from './bin';

const app = new ApiApp({
    initRpcClient: true,
    initRpcServer: false,
});
app.bootstrap().then(() => {
    app.serve();
});
