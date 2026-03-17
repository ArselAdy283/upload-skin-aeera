import { writeFile, mkdir } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";
import { db } from "@/db";
import { skins } from "@/db/schema";

export async function POST(req: Request) {
    const data = await req.formData();

    const file = data.get("file") as File;
    const jenis = data.get("jenis") as string;
    const nickname = data.get("nickname") as string;

    if (!file || !nickname) {
        return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    const safeNickname = nickname.replace(/[^a-zA-Z0-9_-]/g, "");
    const safeJenis = jenis.replace(/[^a-zA-Z0-9_-]/g, "");

    let folder = "bajupribadi";
    if (jenis === "Baju Sekolah") {
        folder = "bajusekolah";
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = `${safeNickname}_${safeJenis}.png`;

    const dirPath = path.join(process.cwd(), "public", "skin", folder);
    const filePath = path.join(dirPath, filename);

    await mkdir(dirPath, { recursive: true });
    await writeFile(filePath, buffer);

    const fileUrl = `/skin/${folder}/${filename}`;

    // 🔥 SIMPAN KE DATABASE
    await db.insert(skins).values({
        nickname: safeNickname,
        jenis_skin: jenis,
        skin: fileUrl,
    }).onDuplicateKeyUpdate({
        set: {
            skin: fileUrl,
        },
    });

    return NextResponse.json({
        success: true,
        path: fileUrl,
    });
}