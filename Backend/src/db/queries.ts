import { db } from '../db/index';
import { eq, lt, sql, and } from 'drizzle-orm';
import { users, sessionTable, verifyEmailTable } from "./schema";
import type { newVerify, newSession, NewUser } from "./schema";
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

import { randomInt } from 'crypto';

import { sendMail } from '../lib/send-email';

import { verifyEmailTemplate } from '../emails/verifyEmailTemplate';

//import { sendMail } from '../lib/nodemailer';

//user queri

export const createUser = async (data: NewUser) => {

    const existingUser = await db.select()
        .from(users)
        .where(eq(users.email, data.email));

    if (existingUser.length > 0) {
        throw new Error('User with this email already exists');
    }
    const [user] = await db.insert(users).values
        ({ ...data }).returning();

    const emailResult = await sendNewVerificationEmail(user.id, user.email);


    return { user, emailResult };

}

export const getUserByEmail = async (email: string) => {
    const [user] = await db.select()
        .from(users)
        .where(eq(users.email, email));


    return user;
}


// session queries
export const createSession = async (data: newSession) => {
    const session = await db.insert(sessionTable)
        .values({ ...data }).returning({ id: sessionTable.id });
    return session;
}

// Create Access Token - accepts arbitrary payload (user info/session)
export const createAccessToken = (payload: Record<string, unknown>) => {
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '15m' });
}

// Create Refresh Token - accepts arbitrary payload
export const refressAccessToken = (payload: Record<string, unknown>) => {
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '15d' });
}

export const findSessionById = async (id: number) => {
    const [session] = await db.select()
        .from(sessionTable)
        .where(eq(sessionTable.id, id));
    return session;
}

//find user by id
export const findUserById = async (id: number) => {
    const [user] = await db.select()
        .from(users)
        .where(eq(users.id, id));
    return user;
}

// Refress Token
export const refressTokens = async (token: string) => {

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET);
        const currentSession = await findSessionById((decoded as any).sessionId);

        if (!currentSession || !currentSession.valid) {
            throw new Error('Invalid session');
        }

        const user = await findUserById((currentSession as any).userId);

        if (!user) {
            throw new Error('User not found');
        }
        const userInfo = {
            id: user.id,
            name: user.name,
            email: user.email,
            isEmailVerified: user.isEmailVerified,
            sessionId: currentSession.id
        }

        const newAccessToken = createAccessToken(userInfo);
        const newRefreshToken = refressAccessToken({ sessionId: currentSession.id });

        return {
            newAccessToken,
            newRefreshToken,
            user: userInfo
        }

    } catch (error) {
        console.error('Error in refressTokens:', error);
    }

}

//Clear session

export const clearUserSession = async (sessionId: number) => {
    return db.delete(sessionTable)
        .where(eq(sessionTable.id, sessionId));
}

//generate random token 
export const generateRandomToken = (digit: number) => {
    const min = 10 ** (digit - 1); // 10000000 7 digits
    const max = 10 ** digit;   // 100000000 8 digits

    return randomInt(min, max).toString();
}

//insert into verify email table
export const insertVerifyEmailToken = async (data: newVerify) => {

    return db.transaction(async (tx) => {
        try {
            await tx.delete(verifyEmailTable)
                .where(lt(verifyEmailTable.expiresAt, sql`CURRENT_TIMESTAMP`));

            await tx.delete(verifyEmailTable)
                .where(eq(verifyEmailTable.userId, data.userId));

            const [inserted] = await tx.insert(verifyEmailTable)
                .values({ ...data })
                .returning();
            return inserted;
        } catch (err) {
            console.error('Error inserting verify email token:', err);
            throw err;
        }
    })

}


export const getVerifyByEmailLink = async (
    { email, token }: { email: string; token: string }
) => {

    const url = new URL(`${env.FRONTEND_URL}/verify-email-token`);
    url.searchParams.append('token', token);
    url.searchParams.append('email', email);

    return url.toString();


};

// Find a verify token row by token and userId
export const findVerifyToken = async ({ token, userId }: { token: string; userId: number }) => {
    const [row] = await db.select()
        .from(verifyEmailTable)
        .where(and(eq(verifyEmailTable.token, token), eq(verifyEmailTable.userId, userId)));
    return row;
}

// Confirm email verification for a user: set flag and cleanup tokens
export const confirmEmailVerification = async (userId: number) => {
    // mark user as verified
    await db.update(users)
        .set({ isEmailVerified: true })
        .where(eq(users.id, userId));

    // remove any existing verification tokens for the user
    await db.delete(verifyEmailTable)
        .where(eq(verifyEmailTable.userId, userId));

    const updated = await db.select().from(users).where(eq(users.id, userId));
    return updated[0];
}

export const sendNewVerificationEmail = async (
    userId: number,
    email: string
) => {
    const randomToken = generateRandomToken(8);

    await insertVerifyEmailToken({
        userId,
        token: randomToken,
    });

    const verifyEmailLink = await getVerifyByEmailLink({
        email,
        token: randomToken,
    });


    try {
        const html = verifyEmailTemplate({ verifyEmailLink, token: randomToken });
        const result = await sendMail(email, 'Verify your email address', html);

        if (!result.success) {
            throw new Error('Email send failed');
        }

        return {
            success: true,
            message: 'Verification token created',
            previewUrl: result?.previewUrl,
        };
    } catch (err: any) {
        console.error('Error sending verification email:', err);

        // token already saved — surface failure details
        return {
            success: false,
            tokenCreated: true,
            emailSent: false,
            message: 'Verification token created (email send failed)',
            error: (err as any)?.response?.data ?? String(err),
        };
    }
};



