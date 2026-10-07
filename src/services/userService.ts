import User, { IUser } from "../models/user.js";

export const getCurrentUser = async (userId: string) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const toPublicUser = (user: IUser & { _id: unknown }) => {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    avatar: user.avatar,
  };
};