import { db } from "@/db";
import { jenis_baju, skins } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET
export async function GET() {
  const data = await db.select().from(jenis_baju);
  return Response.json(data);
}

// POST
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.jenis_baju?.trim()) {
      return Response.json({ error: "Jenis baju kosong" }, { status: 400 });
    }

    await db.insert(jenis_baju).values({
      jenis_baju: body.jenis_baju,
    });

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: "Gagal tambah" }, { status: 500 });
  }
}

// PUT
export async function PUT(req: Request) {
  try {
    const body = await req.json();

    if (!body.id || !body.jenis_baju) {
      return Response.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    await db
      .update(jenis_baju)
      .set({ jenis_baju: body.jenis_baju })
      .where(eq(jenis_baju.id, body.id));

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: "Gagal update" }, { status: 500 });
  }
}

// DELETE
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));

    if (!id) {
      return Response.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const used = await db
      .select()
      .from(skins)
      .where(eq(skins.jenis_baju_id, id));

    if (used.length > 0) {
      return Response.json(
        { error: "Jenis baju masih dipakai di skins" },
        { status: 400 }
      );
    }

    await db.delete(jenis_baju).where(eq(jenis_baju.id, id));

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: "Gagal hapus" }, { status: 500 });
  }
}