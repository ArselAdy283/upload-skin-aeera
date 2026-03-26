import { mysqlTable, varchar, int } from "drizzle-orm/mysql-core";

export const jenis_baju = mysqlTable("jenis_baju", {
  id: int("id").primaryKey().autoincrement(),
  jenis_baju: varchar("jenis_baju", { length: 100 }),
});

export const skins = mysqlTable("skins", {
  id: int("id").primaryKey().autoincrement(),
  nickname: varchar("nickname", { length: 100 }),

  jenis_baju_id: int("jenis_baju_id")
    .notNull()
    .references(() => jenis_baju.id),

  skin: varchar("skin", { length: 255 }),
  lengan: varchar("lengan", { length: 255 }),
});