import { ApiApp } from './bin';

const app = new ApiApp(true);
app.bootstrap().then(() => {
    app.serve();
});
