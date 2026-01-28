import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// --- USERS TABLE (Already exists) ---
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// --- EXPENSES TABLE (New!) ---
export const expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // This links the expense to the user
  title: text("title").notNull(),
  amount: integer("amount").notNull(),  // We will store money in cents (e.g. $10.00 = 1000)
  date: timestamp("date").notNull().defaultNow(),
});

export const insertExpenseSchema = createInsertSchema(expenses).pick({
  title: true,
  amount: true,
  date: true,
});

export type InsertExpense = z.infer<typeof insertExpenseSchema>;
export type Expense = typeof expenses.$inferSelect;