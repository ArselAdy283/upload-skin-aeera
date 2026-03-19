import { db } from "@/db";
import { skins } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const nick = searchParams.get("nick");

  if (!nick) {
    return NextResponse.json({ error: "Nickname wajib" }, { status: 400 });
  }

  const data = await db.select().from(skins).where(eq(skins.nickname, nick));

  const result: Record<string, { skin: string; lengan: string }> = {};

  for (const item of data) {
    if (!item.nickname || !item.jenis_skin || !item.skin || !item.lengan) continue;

    result[item.jenis_skin] = {
      skin: item.skin,
      lengan: item.lengan,
    };
  }

  return NextResponse.json(result);
}