import { Container } from 'typedi';
import mongoose from 'mongoose';
// import { IUser } from '../../interfaces/IUser';
import { IExpense } from '../../interfaces/IExpense';
import { ILogger } from '../../interfaces/ILogger';

/**
 * Attach user to req.user
 * @param {*} req Express req Object
 * @param {*} res  Express res Object
 * @param {*} next  Express next Function
 */

const attachCurrentUserExpense = async (req, res, next) => {
  const Logger: ILogger = Container.get('logger');
  try {

    const ExpenseModel = Container.get('expenseModel') as mongoose.Model<IExpense & mongoose.Document>;

    const userExpenseRecord = await ExpenseModel.find({ userId: req.token._id, deleted: false }, null, { new: true }, (err, docs) => {
      if (err) throw { error: err }

      return docs
    });
    if (!userExpenseRecord) {
      return res.sendStatus(401);
    }

    const userExpense = userExpenseRecord; //to object?

    req.userExpense = userExpense;
    return next();
  } catch (e) {
    Logger.error('🔥 Error attaching user to req: %o', e);
    return next(e);
  }
};

export default attachCurrentUserExpense;
