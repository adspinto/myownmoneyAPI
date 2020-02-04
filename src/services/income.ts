import { Service, Inject } from 'typedi';
import { IUser, IUpdateInputDTO } from '../interfaces/IUser';
import { IIncome, IIncomeUpdateInputDTO, IIncomeInputDTO, IIncomeIdInputDTO } from '../interfaces/IIncome';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';
import events from '../subscribers/events';
import { randomBytes } from 'crypto';
import argon2 from 'argon2';

@Service()
export default class IncomeService {
    constructor(
        @Inject('incomeModel') private incomeModel: Models.IncomeModel,
        @Inject('logger') private logger,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    ) { }

    public async Create(incomeInputDTO: IIncomeInputDTO, userId: string): Promise<{ income: IIncome; }> {
        try {

            this.logger.silly('Creating income');

            var create = {};

            Object.values(incomeInputDTO).forEach((item, index) => {
                if (item) {
                    var keys = Object.keys(incomeInputDTO)
                    create[keys[index]] = item;
                }
            });

            this.logger.silly('Checking if income has null or empty values');
            if (Object.entries(create).length === 0 && create.constructor === Object) throw new Error('You must send, at least, one property to create user income');


            this.logger.silly('Actually creating income now');
            const incomeRecord = await this.incomeModel.create({
                ...incomeInputDTO,
                deleted: false,
                userId
            });

            this.logger.silly('Check if failed');
            if (!incomeRecord) {
                throw new Error('Income cannot be created');
            }

            const income = incomeRecord.toObject();
            return { income };

        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async Update(incomeUpdateInputDTO: IIncomeUpdateInputDTO): Promise<{ income: IIncome; }> {
        try {

            this.logger.silly('Updating income');

            var update = {};

            Object.values(incomeUpdateInputDTO).forEach((item, index) => {
                if (item) {
                    var keys = Object.keys(incomeUpdateInputDTO)
                    if (keys[index] !== "incomeId") {
                        update[keys[index]] = item
                    }
                }
            });

            this.logger.silly('Checking if income has null or empty values');
            if (Object.entries(update).length === 0 && update.constructor === Object) throw new Error('You must send, at least, one property to update user income');


            var query = { _id: incomeUpdateInputDTO.incomeId };
            var options = { new: true }


            this.logger.silly('Actually updating income now');
            const incomeRecord = await this.incomeModel.findByIdAndUpdate(
                query,
                update,
                options,
                (error, doc) => {
                    if (error) throw new Error('User cannot be updated');
                    return doc
                });

            this.logger.silly('Check if failed');
            if (!incomeRecord) {
                throw new Error('Income could not be updated');
            }

            const income = incomeRecord.toObject();
            return { income };

        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }


    public async FindOne(incomeIdInputDTO: IIncomeIdInputDTO): Promise<{ income: IIncome; }> {
        try {

            this.logger.silly('Finding income');
            console.log("what",incomeIdInputDTO)
            const incomeRecord = await this.incomeModel.findById(incomeIdInputDTO.incomeId);

            this.logger.silly('Check if failed');
            if (!incomeRecord) {
                throw new Error('Income could not be updated');
            }

            var income = incomeRecord.toObject();
            return { income };

        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async Delete(incomeDeleteInputDTO: IIncomeIdInputDTO, userId): Promise<{ deleted: Boolean; }> {
        try {

            this.logger.silly('Deleting income');
            this.logger.silly('Checking if income has null or empty values');

            var del = {
                deleted: true
            };

            var query = { _id: incomeDeleteInputDTO.incomeId };
            var options = { new: true }


            this.logger.silly('Actually updating income now');
            const incomeRecord = await this.incomeModel.findByIdAndUpdate(
                query,
                del,
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
