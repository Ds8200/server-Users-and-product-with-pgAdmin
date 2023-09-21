interface UserInterface {
  email: string;
  password: string;
}
export default UserInterface;

export type userPg = {
  user_id: number;
  email: string;
  password: string;
  date_create: number;
  T20: number;
  44: any;
  date_update: number;
  T11: number;
  50: any;
}

export type User = {
  id: number;
  email: string;
}