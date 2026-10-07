import User from "../models/user.js";
import {
  GoogleAccountConflictError,
  GoogleEmailMissingError,
} from "../errors/authErrors.js";

interface GoogleUser {
  id: string;
  displayName: string;
  emails?: {
    value: string;
    verified?: boolean;
  }[];
  photos?: {
    value: string;
  }[];
}

export const findOrCreateGoogleUser = async (googleUser: GoogleUser) => {
  const email = googleUser.emails?.[0]?.value?.toLowerCase().trim();

  if (!email) {
    throw new GoogleEmailMissingError();
  }

  let user = await User.findOne({
    $or: [
      { googleId: googleUser.id },
      { email },
    ],
  });

  // New user
  if (!user) {
    user = await User.create({
      name: googleUser.displayName,
      email,
      googleId: googleUser.id,
      avatar: googleUser.photos?.[0]?.value,
    });

    return {
      user,
      isNewUser: true,
    };
  }

  // Existing account without Google linked
  if (!user.googleId) {
    user.googleId = googleUser.id;
    await user.save();

    return {
      user,
      isNewUser: false,
    };
  }

  // Email belongs to a different Google account
  if (user.googleId !== googleUser.id) {
    throw new GoogleAccountConflictError();
  }

  // Existing Google user — sync profile information
  user.name = googleUser.displayName;

  if (googleUser.photos?.[0]?.value) {
    user.avatar = googleUser.photos[0].value;
  }

  await user.save();

  return {
    user,
    isNewUser: false,
  };
};