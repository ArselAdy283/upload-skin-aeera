CREATE TABLE `jenis_baju` (
	`id` int AUTO_INCREMENT NOT NULL,
	`jenis_baju` varchar(100),
	CONSTRAINT `jenis_baju_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `skins` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nickname` varchar(100),
	`jenis_baju_id` int NOT NULL,
	`skin` varchar(255),
	`lengan` varchar(255),
	CONSTRAINT `skins_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `skins` ADD CONSTRAINT `skins_jenis_baju_id_jenis_baju_id_fk` FOREIGN KEY (`jenis_baju_id`) REFERENCES `jenis_baju`(`id`) ON DELETE no action ON UPDATE no action;