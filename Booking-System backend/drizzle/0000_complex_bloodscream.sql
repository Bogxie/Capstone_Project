CREATE TABLE "bookings" (
	"booking_id" serial PRIMARY KEY NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone_num" varchar(20) NOT NULL,
	"service" varchar(100) NOT NULL,
	"service_type" varchar(100) NOT NULL,
	"package_name" varchar(100) NOT NULL,
	"rental_fee" numeric(10, 2) NOT NULL,
	"municipality" varchar(100) NOT NULL,
	"delivery_fee" numeric(10, 2) NOT NULL,
	"venue" text NOT NULL,
	"lat" numeric(10, 8) NOT NULL,
	"lng" numeric(11, 8) NOT NULL,
	"description" text,
	"status" varchar(50) DEFAULT 'Pending' NOT NULL,
	"payment_method" varchar(50) NOT NULL,
	"downpayment" numeric(10, 2) DEFAULT '1000' NOT NULL,
	"total" numeric(10, 2) NOT NULL,
	"subtotal" numeric(10, 2) NOT NULL,
	"tax" numeric(10, 2) NOT NULL,
	"time_start" varchar(20) NOT NULL,
	"time_end" varchar(20) NOT NULL,
	"booking_date" date NOT NULL,
	"month" varchar(20) NOT NULL,
	"day" integer NOT NULL,
	"year" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"user_id" integer
);
--> statement-breakpoint
CREATE TABLE "feedbacks" (
	"feedback_id" serial PRIMARY KEY NOT NULL,
	"booking_id" integer,
	"user_id" integer,
	"rating" integer NOT NULL,
	"comment" text,
	"is_anonymous" boolean DEFAULT false,
	"image_url" text[],
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "municipalities" (
	"municipality_id" serial PRIMARY KEY NOT NULL,
	"municipality" text NOT NULL,
	"fee" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" serial PRIMARY KEY NOT NULL,
	"brand" text NOT NULL,
	"label" text NOT NULL,
	"options" jsonb,
	"packages" jsonb,
	"is_disabled" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"user_id" serial PRIMARY KEY NOT NULL,
	"username" varchar(50) NOT NULL,
	"email" varchar(50) NOT NULL,
	"password_hash" text NOT NULL,
	"user_role" varchar(20) DEFAULT 'User',
	"profile_picture_url" varchar,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_booking_id_bookings_booking_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("booking_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_bookings_user_id" ON "bookings" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_bookings_booking_date" ON "bookings" USING btree ("booking_date");--> statement-breakpoint
CREATE INDEX "idx_bookings_status" ON "bookings" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_bookings_service" ON "bookings" USING btree ("service");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_bookings_active_unique" ON "bookings" USING btree ("booking_date","service") WHERE "bookings"."status" != 'Cancelled';--> statement-breakpoint
CREATE INDEX "idx_feedbacks_booking_id" ON "feedbacks" USING btree ("booking_id");--> statement-breakpoint
CREATE INDEX "idx_feedbacks_user_id" ON "feedbacks" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_feedbacks_rating" ON "feedbacks" USING btree ("rating");