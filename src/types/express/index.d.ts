import { Document, Model } from 'mongoose';
import { IUser } from '../../interfaces/IUser';
import { IIncome } from '../../interfaces/IIncome';
import { IExpense } from '../../interfaces/IExpense';

declare global {
  namespace Express {
    export interface Request {
      currentUser: IUser & Document;
      userIncome: IIncome & Document;
      userExpense: IExpense & Document;
    }    
  }

  namespace Models {
    export type UserModel = Model<IUser & Document>;
    export type IncomeModel = Model<IIncome & Document>;
    export type ExpenseModel = Model<IExpense & Document>;
    
  }
}
