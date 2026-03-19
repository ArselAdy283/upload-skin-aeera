import { mysqlTable, varchar, int } from "drizzle-orm/mysql-core";

export const skins = mysqlTable("skins", {
  id: int("id").primaryKey().autoincrement(),
  nickname: varchar("nickname", { length: 100 }),
  jenis_skin: varchar("jenis_skin", { length: 50 }),
  skin: varchar("skin", { length: 255 }),
  lengan: varchar("lengan", { length: 255 })
});