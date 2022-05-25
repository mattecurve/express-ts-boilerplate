import { Router, Request, Response } from 'express';
import { asyncHandler, validateRequestBody, validateUserAuthentication } from '../middlewares';
import { Context } from '../context';
import { createTodoSchema } from '../controllers';
import { IAuthTokenService } from '../services/service.interface';
import loadAdminUserRouter from './adminUser';

function loadRouter(ctx: Context) {
    const router = Router();
    router.get('/', (req: Request, res: Response) => {
        res.send('Hello Boilerplate');
    });
    router.post(
        '/create-auth-token',
        asyncHandler((req: Request, res: Response) => ctx.controllers.authController?.createToken(req, res)),
    );
    router.post(
        '/validate-auth-token',
        asyncHandler((req: Request, res: Response) => ctx.controllers.authController?.validateToken(req, res)),
    );
    router.get(
        '/todo',
        asyncHandler((req: Request, res: Response) => ctx.controllers.todoController?.getAllTodo(req, res)),
    );
    router.get(
        '/todo-v2',
        asyncHandler((req: Request, res: Response) => ctx.controllers.todoController?.getAllTodoByService(req, res)),
    );
    router.post(
        '/todo',
        validateUserAuthentication(ctx.services.authTokenService as IAuthTokenService),
        validateRequestBody(createTodoSchema),
        asyncHandler((req: Request, res: Response) => ctx.controllers.todoController?.createTodo(req, res)),
    );
    router.get(
        '/todo/404',
        asyncHandler((req: Request, res: Response) => ctx.controllers.todoController?.notFoundError(req, res)),
    );
    router.get(
        '/todo/error',
        asyncHandler((req: Request, res: Response) => ctx.controllers.todoController?.internalServerError(req, res)),
    );

    router.use('/admin', loadAdminUserRouter(ctx));

    return router;
}

export default loadRouter;
