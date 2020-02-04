import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import UserService from '../../services/user';
import IncomeService from '../../services/income';
// import { IUserInputDTO, IUpdateInputDTO } from '../../interfaces/IUser';
import { IIncomeInputDTO, IIncomeUpdateInputDTO, IIncomeIdInputDTO } from '../../interfaces/IIncome';
import middlewares from '../middlewares';
import { celebrate, Joi } from 'celebrate';
import { ILogger } from '../../interfaces/ILogger';
const route = Router();



export default (app: Router) => {
  app.use('/income', route);

  route.get('/me', middlewares.isAuth, middlewares.attachCurrentUserIncome, (req: Request, res: Response) => {
    return res.json({ userIncome: req.userIncome }).status(200);
  });

  route.get('/testId', //TODO: research how to request by id
  middlewares.isAuth,
  celebrate({
    params: Joi.object({
      incomeId: Joi.string().required()
    })
  }),
  async (req: Request, res: Response) => {

    const incomeServiceInstance = Container.get(IncomeService);
    console.log(req.params)
    const { income } = await incomeServiceInstance.FindOne(req.params as IIncomeIdInputDTO);

    return res.json({ income }).status(200);
  });

  route.post(
    '/me',
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    middlewares.attachCurrentUserIncome,
    celebrate({
      body: Joi.object({
        value: Joi.string().required(),
        title: Joi.string().required(),
        description: Joi.string(),
        type: Joi.string().required(),
        fixed: Joi.string().required()
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: ILogger = Container.get('logger');

      try {

        const incomeServiceInstance = Container.get(IncomeService);
        const { income } = await incomeServiceInstance.Create(req.body as IIncomeInputDTO, req.currentUser._id);

        return res.json({ income }).status(200)

      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    });
  
  route.put(
    '/me',
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    middlewares.attachCurrentUserIncome,
    celebrate({
      body: Joi.object({
        incomeId: Joi.string().required(),
        value: Joi.string(),
        title: Joi.string(),
        description: Joi.string(),
        type: Joi.string(),
        deleted: Joi.string(),
        fixed: Joi.string()
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: ILogger = Container.get('logger');

      try {

        const incomeServiceInstance = Container.get(IncomeService);
        const { income } = await incomeServiceInstance.Update(req.body as IIncomeUpdateInputDTO);

        return res.json({ income }).status(200)

      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    });

    route.delete(
      '/me',
      middlewares.isAuth,
      middlewares.attachCurrentUser,
      middlewares.attachCurrentUserIncome,
      celebrate({
        body: Joi.object({
          incomeId: Joi.string().required()
        })
      }),
      async (req: Request, res: Response, next: NextFunction) => {
        const logger: ILogger = Container.get('logger');
  
        try {
  
          const incomeServiceInstance = Container.get(IncomeService);

          await incomeServiceInstance.Delete(req.body as IIncomeIdInputDTO, req.currentUser._id);
  
          return res.json({ currentIncome: req.userIncome }).status(200)
  
        } catch (e) {
          logger.error('🔥 error: %o', e);
          return next(e);
        }
      });
  





};
