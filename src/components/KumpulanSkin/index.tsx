"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SkinViewer } from "skinview3d";

type SkinData = {
    nickname: string;
    skins: {
        [key: string]: {
            skin: string;
            lengan: string; // "classic" | "slim"
        };
    };
};

const KumpulanSkin = ({ refreshKey }: { refreshKey: number }) => {
    const [data, setData] = useState<SkinData[]>([]);
    const [images, setImages] = useState<Record<string, any[]>>({});

    // fetch data
    useEffect(() => {
        fetch("/api/skins")
            .then((res) => res.json())
            .then((res) => setData(res));
    }, [refreshKey]);

    // generate preview 3D
    useEffect(() => {
        if (data.length === 0) return;

        async function generate() {
            const groupedImages: Record<string, any[]> = {};

            for (const user of data) {
                for (const [jenis, skinData] of Object.entries(user.skins)) {
                    const url = skinData.skin;

                    try {
                        // canvas baru tiap render
                        const canvas = document.createElement("canvas");
                        canvas.width = 300;
                        canvas.height = 300;

                        const viewer = new SkinViewer({
                            canvas,
                            width: 300,
                            height: 300,
                        });

                        // posisi kamera biar bagus
                        viewer.camera.rotation.x = -0.62;
                        viewer.camera.rotation.y = 0.534;
                        viewer.camera.rotation.z = 0.348;
                        viewer.camera.position.set(30.5, 22, 42);
                        
                        await viewer.loadSkin(
                            url,
                            {
                                model: skinData.lengan === "slim" ? "slim" : "default",
                            }
                        );

                        viewer.render();

                        // delay biar stabil (anti blank)
                        await new Promise((r) => setTimeout(r, 50));

                        if (!groupedImages[jenis]) {
                            groupedImages[jenis] = [];
                        }

                        groupedImages[jenis].push({
                            nickname: user.nickname,
                            image: viewer.canvas.toDataURL("image/png"),
                            original: url,
                        });

                        viewer.dispose();
                    } catch (e) {
                        console.error("ERROR:", user.nickname, e);
                    }
                }
            }

            setImages(groupedImages);
        }

        generate();
    }, [data]);

    // optional: sort kategori biar rapi
    const sortedImages = Object.entries(images).sort(([a], [b]) =>
        a.localeCompare(b)
    );

    return (
        <div className="min-h-screen p-10 bg-slate-950 text-white">
            {sortedImages.map(([jenis, items]) => (
                <div key={jenis}>
                    {/* Judul kategori */}
                    <h1 className="text-3xl font-bold my-10 text-center mt-30">
                        {jenis}
                    </h1>

                    {/* kosong */}
                    {items.length === 0 ? (
                        <div className="text-center text-slate-600 py-10">
                            Skin masih kosong
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {items.map((item, index) => (
                                <Link
                                    href={item.original}
                                    key={item.nickname + index}
                                    target="_blank"
                                    className="bg-slate-900 border border-white/10 rounded-2xl p-5 text-center hover:scale-105 transition"
                                >
                                    {/* Preview 3D */}
                                    <img
                                        src={item.image}
                                        className="mx-auto rounded-lg"
                                    />

                                    {/* Nickname + Head */}
                                    <div className="flex gap-5 justify-center items-center mt-3">
                                        <Image
                                            src={`https://crafthead.net/helm/${item.nickname}`}
                                            alt={item.nickname}
                                            width={40}
                                            height={40}
                                            className="w-10 h-10"
                                        />
                                        <h1 className="font-bold">{item.nickname}</h1>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default KumpulanSkin;