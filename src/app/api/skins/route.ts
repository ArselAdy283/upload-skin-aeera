import { db } from "@/db";
import { skins } from "@/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await db.select().from(skins);

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

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Gagal ambil data" },
      { status: 500 }
    );
  }
}