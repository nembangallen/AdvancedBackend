import bcrypt from "bcrypt";
import { User } from "../models/User";
import { Session } from "../models/Session";
import { sha256 } from "../utils/crypto";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/tokens";
import { ROLES } from "../constants/roles";
import { SECURITY } from "../constants/security";
import { generatePasswordResetToken } from "../utils/reset-token";

const BCRYPT_ROUNDS = 12;

function addDays(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

export class AuthService {
  static async register(email: string, password: string) {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      throw Object.assign(new Error("Email already in use"), { status: 409 });

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const user = await User.create({
      email,
      passwordHash,
      role: ROLES.USER,
      emailVerified: false,
    });
    return { userId: user._id.toString() };
  }

  static async login(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user)
      throw Object.assign(new Error("Invalid credentials"), { status: 401 });

    if (user.lockUntil && user.lockUntil.getTime() > Date.now()) {
      const remainingMs = user.lockUntil.getTime() - Date.now();
      const remainingMinutes = Math.ceil(remainingMs / 1000 / 60);

      throw Object.assign(
        new Error(
          `Account locked due to too many failed login attempts. Try again in ${remainingMinutes} minute(s).`,
        ),
        { status: 423 },
      );
    }
    const checkPassword = await bcrypt.compare(password, user.passwordHash);
    if (!checkPassword) {
      user.failedLoginAttempts += 1;

      if (user.failedLoginAttempts >= SECURITY.MAX_LOGIN_ATTEMPTS) {
        user.lockUntil = new Date(Date.now() + SECURITY.ACCOUNT_LOCK_TIME_MS);
        user.failedLoginAttempts = 0;
      }
      await user.save();

      throw Object.assign(new Error("Invalid credentials"), { status: 401 });
    }

    user.failedLoginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    const session = await Session.create({
      userId: user._id,
      refreshTokenHash: "temp",
      expiresAt: addDays(7),
    });
    const refreshToken = signRefreshToken(
      user._id.toString(),
      session._id.toString(),
    );
    session.refreshTokenHash = sha256(refreshToken);
    await session.save();

    const accessToken = signAccessToken(user._id.toString(), user.role);
    return { accessToken, refreshToken, user };
  }

  static async refresh(oldRefreshToken: string) {
    const payload = verifyRefreshToken(oldRefreshToken);

    const session = await Session.findById(payload.sid);
    if (!session)
      throw Object.assign(new Error("Invalid session"), { status: 401 });

    if (session.revokedAt)
      throw Object.assign(new Error("Session revoked"), { status: 401 });
    if (session.expiresAt.getTime() < Date.now())
      throw Object.assign(new Error("Session expired"), { status: 401 });

    const matches = session.refreshTokenHash === sha256(oldRefreshToken);
    if (!matches) {
      session.revokedAt = new Date();
      await session.save();
      throw Object.assign(
        new Error("Refresh token reuse detected. Please login again."),
        { status: 401 },
      );
    }

    const user = await User.findById(session.userId);
    if (!user)
      throw Object.assign(new Error("User not found"), { status: 401 });

    const newRefreshToken = signRefreshToken(
      user._id.toString(),
      session._id.toString(),
    );
    session.refreshTokenHash = sha256(newRefreshToken);
    await session.save();

    const newAccessToken = signAccessToken(user._id.toString(), user.role);
    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  static async logout(refreshToken: string) {
    if (!refreshToken) return;
    try {
      const payload = verifyRefreshToken(refreshToken);
      const session = await Session.findById(payload.sid);
      if (session) {
        session.revokedAt = new Date();
        await session.save();
      }
    } catch {}
  }

  static async forgotPassword(email: string) {
    const user = await User.findOne({ email });

    if (!user) {
      return {
        message:
          "If an account with that email exists, a password reset link has been generated.",
      };
    }

    const { rawToken, tokenHash } = generatePasswordResetToken();
    user.passwordResetTokenHash = tokenHash;
    user.passwordResetExpiresAt = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    return {
      message:
        "If an account with that email exists, a password reset link has been generated.",
      resetToken: rawToken,
    };
  }

  static async resetPassword(token: string, newPassword: string) {
    const tokenHash = sha256(token);
    const user = await User.findOne({
      passwordResetTokenHash: tokenHash,
      passwordResetExpiresAt: { $gt: new Date() },
    });
    if (!user) {
      throw Object.assign(
        new Error("Invalid or expired password reset token"),
        { status: 400 },
      );
    }

    const newPasswordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
    user.passwordHash = newPasswordHash;
    user.passwordResetTokenHash = null;
    user.passwordResetExpiresAt = null;
    user.failedLoginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    await Session.deleteMany({ userId: user._id });
    return {
      message:
        "Password reset successful. Please login with your new password.",
    };
  }
}
