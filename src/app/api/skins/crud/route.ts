import { NextResponse } from "next/server";
import { db } from "@/db";
import { skins, jenis_baju } from "@/db/schema";
import { eq } from "drizzle-orm";

// ================= GET (pakai JOIN) =================
export async function GET() {
  try {
    const data = await db
      .select({
        id: skins.id,
        nickname: skins.nickname,
        jenis_baju_id: skins.jenis_baju_id,
        jenis_baju_nama: jenis_baju.jenis_baju,
        skin: skins.skin,
        lengan: skins.lengan,
      })
      .from(skins)
      .leftJoin(jenis_baju, eq(skins.jenis_baju_id, jenis_baju.id));

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Gagal ambil data" }, { status: 500 });
  }
}

// ================= DELETE =================
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id)
      return NextResponse.json({ error: "ID wajib" }, { status: 400 });

    await db.delete(skins).where(eq(skins.id, Number(id)));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Gagal hapus" }, { status: 500 });
  }
}

// ================= UPDATE =================
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, nickname, jenis_baju_id, lengan } = body;

    if (!id || !nickname || !jenis_baju_id || !lengan)
      return NextResponse.json(
        { error: "Data tidak lengkap" },
        { status: 400 }
      );

    await db
      .update(skins)
      .set({
        nickname,
        jenis_baju_id,
        lengan,
      })
      .where(eq(skins.id, id));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Gagal update" }, { status: 500 });
  }
}