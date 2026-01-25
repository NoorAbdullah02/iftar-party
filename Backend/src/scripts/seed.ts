import { db } from '../db';
import { users, registrations } from '../db/schema';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

const seed = async () => {
    console.log('Seeding data...');

    // 1. Create Admin User
    const email = 'admin@test.com';
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await db.select().from(users).where(eq(users.email, email));

    if (existingUser.length === 0) {
        await db.insert(users).values({
            name: 'Test Admin',
            email,
            password: hashedPassword,
            isEmailVerified: true, // Verified!
        });
        console.log('Admin user created: admin@test.com / password123');
    } else {
        console.log('Admin user already exists.');
    }

    // 2. Create Dummy Picnic Registrations
    const dummyRegs = [
        { name: 'Rahim Uddin', batch: '12th', mobile: '01711111111', email: 'rahim@example.com' },
        { name: 'Karim Ahmed', batch: '13th', mobile: '01822222222', email: 'karim@example.com', paymentStatus: true },
        { name: 'Jamal Hossain', batch: '11th', mobile: '01933333333', email: 'jamal@example.com' },
    ];

    for (const reg of dummyRegs) {
        // Check if exists to avoid duplicates on re-run (simplified check by email)
        const exists = await db.select().from(registrations).where(eq(registrations.email, reg.email));
        if (exists.length === 0) {
            await db.insert(registrations).values({
                ...reg,
                department: 'ICE'
            });
            console.log(`Created registration for ${reg.name}`);
        }
    }

    console.log('Seeding complete.');
    process.exit(0);
};

seed().catch(err => {
    console.error('Seeding failed:', err);
    process.exit(1);
});
