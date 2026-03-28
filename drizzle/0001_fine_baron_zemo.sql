CREATE TABLE "homepage_settings" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"hero_image_url" text NOT NULL,
	"hero_title" text NOT NULL,
	"hero_subtitle" text NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
