CREATE TABLE `apartments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`landlord_id` integer NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`address` text NOT NULL,
	`size` integer NOT NULL,
	`rent_price` real NOT NULL,
	`available_from` integer NOT NULL,
	`available_to` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`landlord_id`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `profiles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`role` text DEFAULT 'tenant' NOT NULL,
	`phone` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `requests` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tenant_id` integer NOT NULL,
	`apartment_id` integer NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`message` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`apartment_id`) REFERENCES `apartments`(`id`) ON UPDATE no action ON DELETE cascade
);
