import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import UserService from '../../services/user';
import { IUserInputDTO, IUpdateInputDTO } from '../../interfaces/IUser';
import middlewares from '../middlewares';
import { celebrate, Joi } from 'celebrate';
import { ILogger } from '../../interfaces/ILogger';
const route = Router();



export default (app: Router) => {
  app.use('/income', route);

  route.get('/me', middlewares.isAuth, middlewares.attachCurrentUserIncome,  (req: Request, res: Response) => {
    return res.json({ totalIncome: req.userIncome }).status(200);
  });


  
  route.post(
    '/create',
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    middlewares.attachCurrentUserIncome,
    celebrate({
      body: Joi.object({
        value:Joi.string(),
        title: Joi.string(),
        description: Joi.string(),
        fixed: Joi.string(),
        state: Joi.string(),
        ocupation: Joi.string(),
        
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: ILogger = Container.get('logger');
      logger.debug('Calling Sign-In endpoint with body: %o', req.body)
      try {
      
        const userServiceInstance = Container.get(UserService); 
        
        const { user } = await userServiceInstance.Update(req.body as IUpdateInputDTO, req.currentUser._id);

        return res.json({ user}).status(200);
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );

  
};
