import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Users Table
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  username: text('username').notNull().unique(),
  avatar: text('avatar'),
  bio: text('bio'),
  createdAt: integer('createdAt', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

// Characters Table
export const characters = sqliteTable('characters', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  creatorId: integer('creatorId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  avatar: text('avatar'),
  personality: text('personity'),
  attributes: text('attributes'),
  skills: text('skills'),
  isPublic: integer('isPublic', { mode: 'boolean' }).default(true),
  createdAt: integer('createdAt', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

// Character Images Table
export const characterImages = sqliteTable('character_images', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  characterId: integer('characterId').notNull().references(() => characters.id, { onDelete: 'cascade' }),
  imageUrl: text('imageUrl').notNull(),
  isPrimary: integer('isPrimary', { mode: 'boolean' }).default(false),
  createdAt: integer('createdAt', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

// Relationships Table
export const relationships = sqliteTable('relationships', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  characterId: integer('characterId').notNull().references(() => characters.id, { onDelete: 'cascade' }),
  relatedCharacterId: integer('relatedCharacterId').notNull().references(() => characters.id, { onDelete: 'cascade' }),
  relationshipType: text('relationshipType').notNull(),
  description: text('description'),
  createdAt: integer('createdAt', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

// Conversations Table
export const conversations = sqliteTable('conversations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  characterId: integer('characterId').notNull().references(() => characters.id, { onDelete: 'cascade' }),
  title: text('title'),
  isArchived: integer('isArchived', { mode: 'boolean' }).default(false),
  createdAt: integer('createdAt', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

// Messages Table
export const messages = sqliteTable('messages', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  conversationId: integer('conversationId').notNull().references(() => conversations.id, { onDelete: 'cascade' }),
  sender: text('sender').notNull(),
  content: text('content').notNull(),
  isVoice: integer('isVoice', { mode: 'boolean' }).default(false),
  voiceUrl: text('voiceUrl'),
  createdAt: integer('createdAt', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

// Subscriptions Table
export const subscriptions = sqliteTable('subscriptions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  plan: text('plan').notNull().default('free'),
  status: text('status').notNull().default('active'),
  startDate: integer('startDate', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  endDate: integer('endDate', { mode: 'timestamp' }),
  autoRenew: integer('autoRenew', { mode: 'boolean' }).default(false),
  createdAt: integer('createdAt', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

// Favorites Table
export const favorites = sqliteTable('favorites', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  characterId: integer('characterId').notNull().references(() => characters.id, { onDelete: 'cascade' }),
  conversationId: integer('conversationId').references(() => conversations.id, { onDelete: 'cascade' }),
  createdAt: integer('createdAt', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

// Generated Images Table
export const generatedImages = sqliteTable('generated_images', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  conversationId: integer('conversationId').notNull().references(() => conversations.id, { onDelete: 'cascade' }),
  imageUrl: text('imageUrl').notNull(),
  prompt: text('prompt'),
  createdAt: integer('createdAt', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});