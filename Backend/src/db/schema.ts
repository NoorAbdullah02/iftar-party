import { serial } from "drizzle-orm/pg-core";
import { pgTable, varchar, integer, timestamp } from "drizzle-orm/pg-core";


// export const users = pgTable("users", {
//     id: uuid("id").primaryKey().defaultRandom(),
//     name: text("name").notNull(),
//     email: text("email").notNull().unique(),
//     password: text('password').notNull(),
//     imageUrl: text("image_url"),
//     createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
//     updatedAt: timestamp("updated_at",
//         { mode: "date" })
//         .defaultNow()
//         .notNull()
//         .$onUpdate(() => new Date()),
// });


export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull()
});


export type user = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;