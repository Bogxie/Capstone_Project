CREATE TABLE "blackout_dates" (
	"blackout_id" serial PRIMARY KEY NOT NULL,
	"date" date NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "blackout_dates_date_unique" UNIQUE("date")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "idx_feedbacks_booking_unique" ON "feedbacks" USING btree ("booking_id");