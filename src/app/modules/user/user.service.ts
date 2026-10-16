import { Role, STATUS, User } from '../../../generated/prisma/client';
import { envVars } from '../../config/env';
import { prisma } from '../../lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface IRegisterUser {
  name: string;
  email: string;
  password: string;
  phone?: string;
  photoUrl?: string; // API level
  role?: Role;
  address?: string;
  city?: string;
  country?: string;
  provider?: string;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string | null;
  avatar: string | null;

  role: Role;
  status: STATUS;

  address: string | null;
  city: string | null;
  country: string | null;

  lastLogin: Date | null;
  emailVerified: boolean;
  provider: string | null;

  createdAt: Date;
  updatedAt: Date;
}

const registerUser = async (payload: IRegisterUser) => {
  const { photoUrl, ...rest } = payload;

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const user = await prisma.user.create({
    data: {
      ...rest,
      password: hashedPassword,
      avatar: photoUrl, //  photoUrl → avatar mapping
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      avatar: true, //  correct field
      role: true,
      status: true,
      address: true,
      city: true,
      country: true,
      lastLogin: true,
      emailVerified: true,
      provider: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};

interface ILoginUser {
  email: string;
  password: string;
}

const loginUser = async (payload: ILoginUser) => {
  const { email, password } = payload;

  // 1 Find user with password
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) {
    throw new Error('User not found');
  }
  // 2 Compare password
  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) {
    throw new Error('Invalid password');
  }
  // 3 Generate JWT
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      phone: user.phone,
      photoUrl: user.avatar,
      status: user.status,
    },
    envVars.JWT_SECRET,
    {
      expiresIn: '7d',
    },
  );
  // 4 Remove password before return
  const { password: _, ...userWithoutPassword } = user;
  return {
    accessToken: token,
    user: userWithoutPassword,
  };
};

const getAllUsers = async (): Promise<User[]> => {
  const users = await prisma.user.findMany();
  return users;
};
const getSingleUser = async (id: string): Promise<User | null> => {
  return await prisma.user.findUnique({
    where: { id },
  });
};
const getCurrentUser = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      avatar: true,
      role: true,
      status: true,
      address: true,
      city: true,
      country: true,
      emailVerified: true,
      provider: true,
      createdAt: true,
      updatedAt: true,
      lastLogin: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

const updateUser = async (
  id: string,
  payload: Partial<IRegisterUser>,
): Promise<Omit<User, 'password'>> => {
  if (payload.password) {
    payload.password = await bcrypt.hash(payload.password, 10);
  }

  const { photoUrl, ...rest } = payload;

  const user = await prisma.user.update({
    where: { id },
    data: {
      ...rest,
      avatar: photoUrl,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      avatar: true,
      role: true,
      status: true,
      address: true,
      city: true,
      country: true,
      emailVerified: true,
      provider: true,

      createdAt: true,
      updatedAt: true,
      lastLogin: true,
    },
  });

  return user;
};

const updatePassword = async (
  id: string,
  oldPassword: string,
  newPassword: string,
): Promise<Omit<User, 'password'>> => {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) throw new Error('User not found');

  // 1. old password check
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) throw new Error('Old password is incorrect');

  // 2. hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // 3. update user
  const updatedUser = await prisma.user.update({
    where: { id },
    data: { password: hashedPassword },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      avatar: true,
      role: true,
      status: true,
      address: true,
      city: true,
      country: true,
      emailVerified: true,
      provider: true,
      lastLogin: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};

const deleteUser = async (id: string): Promise<User> => {
  const user = await prisma.user.delete({
    where: { id },
  });
  return user;
};

export const UserService = {
  registerUser,
  deleteUser,
  getAllUsers,
  loginUser,
  getSingleUser,
  updateUser,
  updatePassword,
  getCurrentUser,
};
