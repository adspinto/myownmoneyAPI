import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import ExpenseService from '../../services/expense';

// import { IIncomeInputDTO, IIncomeUpdateInputDTO, IIncomeIdInputDTO } from '../../interfaces/IIncome';
import { IExpense, IExpenseIdInputDTO, IExpenseInputDTO, IExpenseUpdateInputDTO } from '../../interfaces/IExpense';
import middlewares from '../middlewares';
import { celebrate, Joi } from 'celebrate';
import { ILogger } from '../../interfaces/ILogger';
const route = Router();



export default (app: Router) => {
  app.use('/expense', route);

  route.get('/me', middlewares.isAuth, middlewares.attachCurrentUserExpense, (req: Request, res: Response) => {
    return res.json({ userExpense: req.userExpense }).status(200);
  });

  route.post(
    '/me',
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    middlewares.attachCurrentUserExpense,
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

        const expenseServiceInstance = Container.get(ExpenseService);
        const { expense } = await expenseServiceInstance.Create(req.body as IExpenseInputDTO, req.currentUser._id);

        return res.json({ expense }).status(200)

      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    });
  
  route.put(
    '/me',
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    middlewares.attachCurrentUserExpense,
    celebrate({
      body: Joi.object({
        expenseId: Joi.string().required(),
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

        const expenseServiceInstance = Container.get(ExpenseService);
        const { expense } = await expenseServiceInstance.Update(req.body as IExpenseUpdateInputDTO);

        return res.json({ expense }).status(200)

      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    });

    route.delete(
      '/me',
      middlewares.isAuth,
      middlewares.attachCurrentUserExpense,
      celebrate({
        body: Joi.object({
          expenseId: Joi.string().required()
        })
      }),
      async (req: Request, res: Response, next: NextFunction) => {
        const logger: ILogger = Container.get('logger');
  
        try {
  
          const expenseServiceInstance = Container.get(ExpenseService);

          await expenseServiceInstance.Delete(req.body as IExpenseIdInputDTO);
  
          return res.json({ currentExpense: req.userExpense }).status(200)
  
        } catch (e) {
          logger.error('🔥 error: %o', e);
          return next(e);
        }
      });

};
