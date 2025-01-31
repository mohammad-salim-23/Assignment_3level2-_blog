import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TLoginUser, TRegisterUser } from './auth.interface';
import { createToken } from './auth.utils';
import config from '../../config';
import bcrypt from 'bcrypt';
const registerUser = async (payload: TRegisterUser) => {
  //hash the password before saving
  payload.password = await bcrypt.hash(payload.password, 10);
  const result = await User.create(payload);
  return result;
};
const loginUser = async (payload: TLoginUser) => {
  //checking if the user is exist
  const user = await User.isUserExistsByEmail(payload.email);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'This user is not found!');
  }
  //checking if the user is blocked
  const userStatus = user?.isBlocked;
  if (userStatus) {
    throw new AppError(StatusCodes.FORBIDDEN, 'This user is blocked!');
  }
  // checking if the password is correct
  if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
    throw new AppError(StatusCodes.FORBIDDEN, 'password is not matched!');
  }
  const jwtPayload = {
    userId: user.email,
    role: user.role,
  };
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );
  return { accessToken };
};
export const AuthServices = {
  loginUser,
  registerUser,
};
