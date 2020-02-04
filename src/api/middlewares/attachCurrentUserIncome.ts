import { Container } from 'typedi';
import mongoose from 'mongoose';
// import { IUser } from '../../interfaces/IUser';
import { IIncome } from '../../interfaces/IIncome';
import { ILogger } from '../../interfaces/ILogger';

/**
 * Attach user to req.user
 * @param {*} req Express req Object
 * @param {*} res  Express res Object
 * @param {*} next  Express next Function
 */
const attachCurrentUserIncome = async (req, res, next) => {
  const Logger: ILogger = Container.get('logger');
  try {

    const IncomeModel = Container.get('incomeModel') as mongoose.Model<IIncome & mongoose.Document>;

    const userIncomeRecord = await IncomeModel.find({ userId: req.token._id, deleted: false }, null, { new: true }, (err, docs) => {
      if (err) throw { error: err }

      return docs
    });
    if (!userIncomeRecord) {
      return res.sendStatus(401);
    }

    const userIncome = userIncomeRecord; //to object?

    req.userIncome = userIncome;
    return next();
  } catch (e) {
    Logger.error('🔥 Error attaching user to req: %o', e);
    return next(e);
  }
};

export default attachCurrentUserIncome;
