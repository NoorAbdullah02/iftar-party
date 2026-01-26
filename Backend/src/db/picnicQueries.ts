import { db } from './index';
import { eq, desc, sql } from 'drizzle-orm';
import { registrations, expenses } from './schema';
import type { newRegistration, newExpense } from './schema';
import { sendMail } from '../lib/send-email';
import { env } from '../config/env';

// ==================== REGISTRATION QUERIES ====================

export const createRegistration = async (data: newRegistration) => {
    const [registration] = await db.insert(registrations)
        .values({ ...data })
        .returning();

    // Send registration confirmation email
    await sendRegistrationEmail(registration);

    return registration;
};

export const getAllRegistrations = async () => {
    return db.select()
        .from(registrations)
        .orderBy(desc(registrations.createdAt));
};

export const getRegistrationById = async (id: number) => {
    const [registration] = await db.select()
        .from(registrations)
        .where(eq(registrations.id, id));
    return registration;
};

export const updatePaymentStatus = async (id: number, status: boolean) => {
    const [updated] = await db.update(registrations)
        .set({ paymentStatus: status, updatedAt: new Date() })
        .where(eq(registrations.id, id))
        .returning();

    // If payment is marked as done, send confirmation email
    if (status && updated) {
        await sendPaymentConfirmationEmail(updated);
    }

    return updated;
};

export const updateMultiplePaymentStatus = async (ids: number[], status: boolean) => {
    const updated = await db.transaction(async (tx) => {
        const results = [];
        for (const id of ids) {
            const [result] = await tx.update(registrations)
                .set({ paymentStatus: status, updatedAt: new Date() })
                .where(eq(registrations.id, id))
                .returning();

            if (status && result) {
                await sendPaymentConfirmationEmail(result);
            }
            results.push(result);
        }
        return results;
    });

    return updated;
};

export const updateRegistration = async (id: number, data: Partial<newRegistration>) => {
    // Prevent updating id or createdAt
    const { id: _, createdAt: __, ...updateData } = data as any;

    const [updated] = await db.update(registrations)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(registrations.id, id))
        .returning();
    return updated;
};

export const deleteRegistration = async (id: number) => {
    const [deleted] = await db.delete(registrations)
        .where(eq(registrations.id, id))
        .returning();
    return deleted;
};

export const getRegistrationsByBatch = async (batch: string) => {
    return db.select()
        .from(registrations)
        .where(eq(registrations.batch, batch))
        .orderBy(desc(registrations.createdAt));
};

export const getPaidRegistrationsCount = async () => {
    const result = await db.select({ count: sql<number>`count(*)` })
        .from(registrations)
        .where(eq(registrations.paymentStatus, true));
    return Number(result[0]?.count || 0);
};

export const getTotalCollectedAmount = async () => {
    const count = await getPaidRegistrationsCount();
    return count * 450; // Fixed fee per person
};

// ==================== EXPENSE QUERIES ====================

export const createExpense = async (data: newExpense) => {
    const [expense] = await db.insert(expenses)
        .values({ ...data })
        .returning();
    return expense;
};

export const getAllExpenses = async () => {
    return db.select()
        .from(expenses)
        .orderBy(desc(expenses.createdAt));
};

export const getExpenseById = async (id: number) => {
    const [expense] = await db.select()
        .from(expenses)
        .where(eq(expenses.id, id));
    return expense;
};

export const deleteExpense = async (id: number) => {
    const [deleted] = await db.delete(expenses)
        .where(eq(expenses.id, id))
        .returning();
    return deleted;
};

export const getTotalExpenses = async () => {
    const result = await db.select({ total: sql<number>`COALESCE(SUM(amount), 0)` })
        .from(expenses);
    return Number(result[0]?.total || 0);
};

export const getRemainingBalance = async () => {
    const collected = await getTotalCollectedAmount();
    const spent = await getTotalExpenses();
    return collected - spent;
};

// ==================== FINANCIAL SUMMARY ====================

export const getFinancialSummary = async () => {
    const paidUsers = await getPaidRegistrationsCount();
    const totalCollected = await getTotalCollectedAmount();
    const totalExpenses = await getTotalExpenses();
    const remainingBalance = totalCollected - totalExpenses;

    return {
        paidUsers,
        totalCollected,
        totalExpenses,
        remainingBalance
    };
};

// ==================== EMAIL TEMPLATES ====================

const sendRegistrationEmail = async (registration: any) => {
    const html = `<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>রেজিস্ট্রেশন নিশ্চিতকরণ</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #10b981 0%, #047857 100%); padding: 40px 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
        <div style="background: linear-gradient(135deg, #10b981 0%, #047857 100%); padding: 40px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 32px;">🌸 চড়ুইভাতি – ২০২৬ 🌸</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">ICE Department | Information & Communication Engineering</p>
        </div>
        
        <div style="padding: 40px;">
            <h2 style="color: #2d3748; margin: 0 0 20px;">🎉 রেজিস্ট্রেশন সফল হয়েছে!</h2>
            <p style="color: #4a5568; line-height: 1.6; margin-bottom: 30px;">
                প্রিয় <strong>${registration.name}</strong>,<br><br>
                আপনার চড়ুইভাতি – ২০২৬ রেজিস্ট্রেশন সফলভাবে গ্রহণ করা হয়েছে। আপনার তথ্য নিচে দেওয়া হলো:
            </p>
            
            <div style="background: #f7fafc; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 10px 0; color: #718096; font-weight: 600;">নাম:</td>
                        <td style="padding: 10px 0; color: #2d3748; font-weight: 700;">${registration.name}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; color: #718096; font-weight: 600;">ডিপার্টমেন্ট:</td>
                        <td style="padding: 10px 0; color: #2d3748; font-weight: 700;">${registration.department}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; color: #718096; font-weight: 600;">ব্যাচ:</td>
                        <td style="padding: 10px 0; color: #2d3748; font-weight: 700;">${registration.batch}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; color: #718096; font-weight: 600;">মোবাইল:</td>
                        <td style="padding: 10px 0; color: #2d3748; font-weight: 700;">${registration.mobile}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; color: #718096; font-weight: 600;">ইমেইল:</td>
                        <td style="padding: 10px 0; color: #2d3748; font-weight: 700;">${registration.email}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; color: #718096; font-weight: 600;">ফি:</td>
                        <td style="padding: 10px 0; color: #2d3748; font-weight: 700; font-size: 18px;">৪৫০ টাকা</td>
                    </tr>
                </table>
            </div>
            
            <div style="background: linear-gradient(135deg, #10b981 0%, #047857 100%); border-radius: 12px; padding: 20px; text-align: center; color: white;">
                <p style="margin: 0; font-size: 16px; line-height: 1.6;">
                    খুব শীঘ্রই পেমেন্ট সংক্রান্ত আপডেট<br>ইমেইলে জানানো হবে 📧
                </p>
            </div>
            
            <p style="color: #718096; font-size: 14px; margin-top: 30px; text-align: center;">
                ধন্যবাদ 🌿<br>
                <strong>ICE Department Team</strong>
            </p>
        </div>
    </div>
</body>
</html>`;

    try {
        await sendMail(registration.email, '🌸 চড়ুইভাতি – ২০২৬ | রেজিস্ট্রেশন নিশ্চিতকরণ', html);
    } catch (error) {
        console.error('Error sending registration email:', error);
    }
};

const sendPaymentConfirmationEmail = async (registration: any) => {
    const html = `<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>পেমেন্ট নিশ্চিতকরণ</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px; text-align: center;">
            <div style="font-size: 60px; margin-bottom: 10px;">✅</div>
            <h1 style="color: white; margin: 0; font-size: 32px;">পেমেন্ট সম্পন্ন হয়েছে!</h1>
        </div>
        
        <div style="padding: 40px; text-align: center;">
            <h2 style="color: #2d3748; margin: 0 0 20px;">প্রিয় ${registration.name},</h2>
            <p style="color: #4a5568; line-height: 1.8; font-size: 16px; margin-bottom: 30px;">
                আপনার পেমেন্ট সফলভাবে সম্পন্ন হয়েছে।<br>
                <strong style="color: #10b981; font-size: 20px;">আমরা চড়ুইভাতি – ২০২৬ এ আপনাকে স্বাগতম জানাচ্ছি! 🌿</strong>
            </p>
            
            <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-radius: 12px; padding: 30px; margin-bottom: 30px;">
                <p style="color: #166534; font-size: 18px; margin: 0; font-weight: 600;">
                    🎟️ আপনার রেজিস্ট্রেশন সম্পূর্ণ হয়েছে
                </p>
            </div>
            
            <p style="color: #718096; font-size: 14px; margin-top: 30px;">
                আরও তথ্যের জন্য আমাদের সাথে যোগাযোগ করুন।<br><br>
                ধন্যবাদ 🌸<br>
                <strong>ICE Department Team</strong>
            </p>
        </div>
    </div>
</body>
</html>`;

    try {
        await sendMail(registration.email, '✅ চড়ুইভাতি – ২০২৬ | পেমেন্ট নিশ্চিতকরণ', html);
    } catch (error) {
        console.error('Error sending payment confirmation email:', error);
    }
};
