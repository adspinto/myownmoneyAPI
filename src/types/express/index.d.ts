import { Document, Model } from 'mongoose';
import { IUser } from '../../interfaces/IUser';
import { IIncome } from '../../interfaces/IIncome';

declare global {
  namespace Express {
    export interface Request {
      currentUser: IUser & Document;
      userIncome: IIncome & Document;
    }    
  }

  namespace Models {
    export type UserModel = Model<IUser & Document>;
    export type IncomeModel = Model<IIncome & Document>;
    
  }
}
