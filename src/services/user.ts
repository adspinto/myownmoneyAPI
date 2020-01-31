import { Service, Inject } from 'typedi';
import { IUser, IUpdateInputDTO } from '../interfaces/IUser';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';
import events from '../subscribers/events';
import { randomBytes } from 'crypto';
import argon2 from 'argon2';

@Service()
export default class UserService {
  constructor(
    @Inject('userModel') private userModel: Models.UserModel,
    @Inject('logger') private logger,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) { }

  public async Update(updateInputDTO: IUpdateInputDTO, userId: string): Promise<{ user: IUser; }> {
    try {

      this.logger.silly('Updating user data...');
      const salt = randomBytes(32);

      this.logger.silly('Hashing password');
      const { password, city, state, ocupation, name, email } = updateInputDTO
      if(password) var hashedPassword = await argon2.hash(password, { salt });
      console.log(updateInputDTO)

      var query = { _id: userId };
      var update = {};

      Object.values(updateInputDTO).forEach((item, index) => {
        if(item){
          var keys = Object.keys(updateInputDTO)
          update[keys[index]] = item;
        }
      })
      var options = { new: true }
      console.log("aaaaaathim",Object.entries(update).length === 0, update.constructor === Object, update)
      if(Object.entries(update).length === 0 && update.constructor === Object) throw  new Error('You must send, at least, one property to update');
      const userRecord = await this.userModel.findOneAndUpdate(
        query,
        update,
        options,
        (error, doc) => {
          if (error) throw new Error('User cannot be updated');
          return doc
        });


      if (!userRecord) {
        throw new Error('User cannot be created');
      }

      const user = userRecord.toObject();
      Reflect.deleteProperty(user, 'password');
      Reflect.deleteProperty(user, 'salt');


      return { user };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
