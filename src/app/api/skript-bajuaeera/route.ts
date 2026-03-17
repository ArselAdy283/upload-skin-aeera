import { db } from "@/db";
import { skins } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const nick = searchParams.get("nick");

    if (!nick) {
        return Response.json({ error: "Nickname wajib" }, { status: 400 });
    }

    const data = await db
        .select()
        .from(skins)
        .where(eq(skins.nickname, nick));

    const result: any = {};

    for (const item of data) {
        if (!item.nickname || !item.jenis_skin || !item.skin) continue;
        result[item.jenis_skin] = item.skin;
    }

    return Response.json(result);
}