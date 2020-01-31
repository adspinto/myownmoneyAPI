export interface IUser {
  _id: string;
  name: string;
  email: string;
  city: string;
  state: string;
  ocupation: string;
  password: string;
  salt: string;
}

export interface IUserInputDTO {
  name: string;
  email: string;
  password: string;
}
export interface IUpdateInputDTO {
  name: string;
  email: string;
  password: string;
  city: string;
  state: string;
  ocupation: string;
}

