CREATE TABLE "admin_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "admin_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "artist" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"name" text NOT NULL,
	"portrait_url" text NOT NULL,
	"bio" text NOT NULL,
	"born" text,
	"education" text,
	"represented_by" text,
	"cv" jsonb,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "artworks" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"year" text NOT NULL,
	"medium" text NOT NULL,
	"dimensions" text NOT NULL,
	"description" text NOT NULL,
	"image_url" text NOT NULL,
	"display_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "contact_info" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"studio_address" text,
	"studio_email" text,
	"gallery_name" text,
	"gallery_email" text,
	"instagram_url" text,
	"artsy_url" text,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "contact_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"message" text NOT NULL,
	"status" text DEFAULT 'unread',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "exhibitions" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"gallery_name" text NOT NULL,
	"location" text NOT NULL,
	"date" text NOT NULL,
	"description" text NOT NULL,
	"image_urls" jsonb DEFAULT '[]'::jsonb,
	"display_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
