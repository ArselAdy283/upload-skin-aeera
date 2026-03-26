import { NextResponse } from "next/server";
import cloudinary from "@/app/lib/cloudinary";
import { db } from "@/db";
import { skins, jenis_baju } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const data = await req.formData();

    const file = data.get("file") as File;
    const jenis = data.get("jenis") as string;
    const nickname = data.get("nickname") as string;
    const lengan = data.get("lengan") as string;

    if (!file || !nickname || !jenis || !lengan) {
      return NextResponse.json(
        { error: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    const safeNickname = nickname.replace(/[^a-zA-Z0-9_-]/g, "");
    const safeJenis = jenis.replace(/[^a-zA-Z0-9_-]/g, "");

    // 🔥 ambil ID jenis baju
    const jenisData = await db
      .select()
      .from(jenis_baju)
      .where(eq(jenis_baju.jenis_baju, jenis));

    if (!jenisData.length) {
      return NextResponse.json(
        { error: "Jenis baju tidak ditemukan" },
        { status: 400 }
      );
    }

    const jenisId = jenisData[0].id;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadRes = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "skins",
            public_id: `${safeNickname}_${safeJenis}`,
            resource_type: "image",
            format: "png",
          },
          (error: any, result: any) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    const fileUrl = uploadRes.secure_url;

    await db.insert(skins).values({
      nickname: safeNickname,
      jenis_baju_id: jenisId,
      skin: fileUrl,
      lengan: lengan,
    });

    return NextResponse.json({
      success: true,
      path: fileUrl,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error", detail: String(err) },
      { status: 500 }
    );
  }
}