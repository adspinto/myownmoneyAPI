import { Service, Inject } from 'typedi';
import { IUser, IUpdateInputDTO } from '../interfaces/IUser';
// import { IExpense, IExpenseUpdateInputDTO, IExpenseInputDTO, IExpenseIdInputDTO } from '../interfaces/IExpense';
import { IExpense, IExpenseIdInputDTO, IExpenseInputDTO, IExpenseUpdateInputDTO } from '../interfaces/IExpense';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';
import events from '../subscribers/events';
import { randomBytes } from 'crypto';
import argon2 from 'argon2';

@Service()
export default class IncomeService {
    constructor(
        @Inject('expenseModel') private expenseModel: Models.ExpenseModel,
        @Inject('logger') private logger,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    ) { }

    public async Create(expenseInputDTO: IExpenseInputDTO, userId: string): Promise<{ expense: IExpense; }> {
        try {

            this.logger.silly('Creating expense');

            var create = {};

            Object.values(expenseInputDTO).forEach((item, index) => {
                if (item) {
                    var keys = Object.keys(expenseInputDTO)
                    create[keys[index]] = item;
                }
            });

            this.logger.silly('Checking if expense has null or empty values');
            if (Object.entries(create).length === 0 && create.constructor === Object) throw new Error('You must send, at least, one property to create user expense');


            this.logger.silly('Actually creating expense now');
            const expenseRecord = await this.expenseModel.create({
                ...expenseInputDTO,
                deleted: false,
                userId
            });

            this.logger.silly('Check if failed');
            if (!expenseRecord) {
                throw new Error('Income cannot be created');
            }

            const expense = expenseRecord.toObject();
            return { expense };

        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async Update(expenseUpdateInputDTO: IExpenseUpdateInputDTO): Promise<{ expense: IExpense; }> {
        try {

            this.logger.silly('Updating expense');

            var update = {};

            Object.values(expenseUpdateInputDTO).forEach((item, index) => {
                if (item) {
                    var keys = Object.keys(expenseUpdateInputDTO)
                    if (keys[index] !== "incomeId") {
                        update[keys[index]] = item
                    }
                }
            });

            this.logger.silly('Checking if expense has null or empty values');
            if (Object.entries(update).length === 0 && update.constructor === Object) throw new Error('You must send, at least, one property to update user expense');


            var query = { _id: expenseUpdateInputDTO.expenseId };
            var options = { new: true }


            this.logger.silly('Actually updating expense now');
            const expenseRecord = await this.expenseModel.findByIdAndUpdate(
                query,
                update,
                options,
                (error, doc) => {
                    if (error) throw new Error('Expense could not be updated');
                    return doc
                });

            this.logger.silly('Check if failed');
            if (!expenseRecord) {
                throw new Error('Income could not be updated');
            }

            const expense = expenseRecord.toObject();
            return { expense };

        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }


    public async FindOne(expenseIdInputDTO: IExpenseIdInputDTO): Promise<{ expense: IExpense; }> {
        try {

            this.logger.silly('Finding expense');
            console.log("what", expenseIdInputDTO)
            const incomeRecord = await this.expenseModel.findById(expenseIdInputDTO.expenseId);

            this.logger.silly('Check if failed');
            if (!incomeRecord) {
                throw new Error('Income could not be updated');
            }

            var expense = incomeRecord.toObject();
            return { expense };

        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async Delete(expenseDeleteInputDTO: IExpenseIdInputDTO): Promise<{ deleted: Boolean; }> {
        try {

            this.logger.silly('Deleting expense');
            this.logger.silly('Checking if expense has null or empty values');

            var query = { _id: expenseDeleteInputDTO.expenseId };
            var options = { new: true }


            this.logger.silly('Actually updating expense now');
            const incomeRecord = await this.expenseModel.findByIdAndUpdate(
                query,
                { deleted: true },
                options,
                (error, doc) => {
                    if (error) throw new Error('User cannot be updated');
                    return doc
                });


            this.logger.silly('Check if failed');
            if (!incomeRecord) {
                throw new Error('Income could not be updated');
            }


            return { deleted: true };

        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }


}
