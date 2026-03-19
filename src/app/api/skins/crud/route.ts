import { NextResponse } from "next/server";
import { db } from "@/db";
import { skins } from "@/db/schema";
import { eq } from "drizzle-orm";

//GET
export async function GET() {
  try {
    const data = await db.select().from(skins);
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Gagal ambil data" }, { status: 500 });
  }
}

//DELETE
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID wajib" }, { status: 400 });

    await db.delete(skins).where(eq(skins.id, Number(id)));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Gagal hapus" }, { status: 500 });
  }
}

//UPDATE
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, nickname, jenis_skin, lengan } = body;

    if (!id || (!nickname || !jenis_skin || !lengan))
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });

    await db
      .update(skins)
      .set({
        nickname: nickname ?? undefined,
        jenis_skin: jenis_skin ?? undefined,
        lengan: lengan ?? undefined
      })
      .where(eq(skins.id, id));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Gagal update" }, { status: 500 });
  }
}