import { pgTable, serial, text, integer, jsonb, timestamp } from 'drizzle-orm/pg-core';

// Artworks table
export const artworks = pgTable('artworks', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  year: text('year').notNull(),
  medium: text('medium').notNull(),
  dimensions: text('dimensions').notNull(),
  description: text('description').notNull(),
  image_url: text('image_url').notNull(),
  display_order: integer('display_order').default(0),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

// Exhibitions table
export const exhibitions = pgTable('exhibitions', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  gallery_name: text('gallery_name').notNull(),
  location: text('location').notNull(),
  date: text('date').notNull(),
  description: text('description').notNull(),
  image_urls: jsonb('image_urls').default([]),
  display_order: integer('display_order').default(0),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

// Artist table
export const artist = pgTable('artist', {
  id: integer('id').primaryKey().default(1),
  name: text('name').notNull(),
  portrait_url: text('portrait_url').notNull(),
  bio: text('bio').notNull(),
  born: text('born'),
  education: text('education'),
  represented_by: text('represented_by'),
  cv: jsonb('cv'),
  updated_at: timestamp('updated_at').defaultNow(),
});

// Contact messages table
export const contactMessages = pgTable('contact_messages', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  message: text('message').notNull(),
  status: text('status').default('unread'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});
// Add this to your existing schema file
export const contactInfo = pgTable('contact_info', {
  id: integer('id').primaryKey().default(1),
  studio_address: text('studio_address'),
  studio_email: text('studio_email'),
  gallery_name: text('gallery_name'),
  gallery_email: text('gallery_email'),
  instagram_url: text('instagram_url'),
  artsy_url: text('artsy_url'),
  updated_at: timestamp('updated_at').defaultNow(),
});

export const adminUsers = pgTable('admin_users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  password_hash: text('password_hash').notNull(),
  created_at: timestamp('created_at').defaultNow(),
});

export const homepageSettings = pgTable('homepage_settings', {
  id: integer('id').primaryKey().default(1),
  hero_image_url: text('hero_image_url').notNull(),
  hero_title: text('hero_title').notNull(),
  hero_subtitle: text('hero_subtitle').notNull(),
  updated_at: timestamp('updated_at').defaultNow(),
});