import { ApiApp } from './bin';

const app = new ApiApp();
app.bootstrap().then(() => {
    app.serve();
});
