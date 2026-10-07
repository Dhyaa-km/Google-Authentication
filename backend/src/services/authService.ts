import User from "../models/user.js";
import {
  GoogleAccountConflictError,
  GoogleEmailMissingError,
  GoogleEmailNotVerifiedError,
  UserAlreadyExistsError,
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
  const googleEmail = googleUser.emails?.[0];

  if (!googleEmail?.value) {
    throw new GoogleEmailMissingError();
  }

  if (googleEmail.verified !== true) {
    throw new GoogleEmailNotVerifiedError();
  }

  const email = googleEmail.value.toLowerCase().trim();

  let user = await User.findOne({
    $or: [
      { googleId: googleUser.id },
      { email },
    ],
  });

  // New user
  if (!user) {
    try {
      user = await User.create({
        name: googleUser.displayName,
        email,
        googleId: googleUser.id,
        avatar: googleUser.photos?.[0]?.value,
      });
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === 11000
      ) {
        throw new UserAlreadyExistsError();
      }

      throw error;
    }

    return {
      user,
      isNewUser: true,
    };
  }

  // Existing account without Google linked
  if (!user.googleId) {
    try {
      user.googleId = googleUser.id;
      await user.save();
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === 11000
      ) {
        throw new UserAlreadyExistsError();
      }

      throw error;
    }

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