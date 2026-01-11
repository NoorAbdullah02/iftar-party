import { db } from '../db/index';
import { eq } from 'drizzle-orm';
import {
    users,
    type NewUser
} from "./schema"


//user queri

export const createUser = async (data: NewUser) => {

    const existingUser = await db.select()
        .from(users)
        .where(eq(users.email, data.email));

    if (existingUser.length > 0) {
        throw new Error('User with this email already exists');
    }
    const user = await db.insert(users).values
        ({ ...data }).returning();
    return user;

}

export const getUserByEmail = async (email: string) => {
    const user = await db.select()
        .from(users)
        .where(eq(users.email, email));

    return user[0];
}