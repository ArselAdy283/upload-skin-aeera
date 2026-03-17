import { db } from "@/db";
import { skins } from "@/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await db.select().from(skins);

  // 🔥 Group berdasarkan nickname
  const grouped: any = {};

  data.forEach((item) => {
    if (!item.nickname || !item.jenis_skin) return;

    if (!grouped[item.nickname]) {
      grouped[item.nickname] = {
        nickname: item.nickname,
        skins: {},
      };
    }

    grouped[item.nickname].skins[item.jenis_skin] = item.skin;
  });

  return NextResponse.json(Object.values(grouped));
}