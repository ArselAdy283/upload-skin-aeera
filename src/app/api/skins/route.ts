import { db } from "@/db";
import { skins, jenis_baju } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const data = await db
      .select({
        nickname: skins.nickname,
        skin: skins.skin,
        lengan: skins.lengan,
        jenis_baju_nama: jenis_baju.jenis_baju,
      })
      .from(skins)
      .leftJoin(jenis_baju, eq(skins.jenis_baju_id, jenis_baju.id));

    const grouped: any = {};

    data.forEach((item) => {
      if (!item.nickname || !item.jenis_baju_nama || !item.lengan) return;

      if (!grouped[item.nickname]) {
        grouped[item.nickname] = {
          nickname: item.nickname,
          skins: {},
        };
      }

      // 🔥 pakai nama dari JOIN
      grouped[item.nickname].skins[item.jenis_baju_nama] = {
        skin: item.skin,
        lengan: item.lengan,
      };
    });

    return NextResponse.json(Object.values(grouped));

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Gagal ambil data" },
      { status: 500 }
    );
  }
}