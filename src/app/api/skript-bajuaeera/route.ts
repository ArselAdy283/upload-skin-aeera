import { db } from "@/db";
import { skins, jenis_baju } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const nick = searchParams.get("nick");

  if (!nick) {
    return NextResponse.json({ error: "Nickname wajib" }, { status: 400 });
  }

  const data = await db
    .select({
      skin: skins.skin,
      lengan: skins.lengan,
      jenis_baju_nama: jenis_baju.jenis_baju,
    })
    .from(skins)
    .leftJoin(jenis_baju, eq(skins.jenis_baju_id, jenis_baju.id))
    .where(eq(skins.nickname, nick));

  const result: Record<string, { skin: string; lengan: string }> = {};

  for (const item of data) {
    if (!item.jenis_baju_nama || !item.skin || !item.lengan) continue;

    // 🔥 sekarang pakai nama, bukan ID
    result[item.jenis_baju_nama] = {
      skin: item.skin,
      lengan: item.lengan,
    };
  }

  return NextResponse.json(result);
}