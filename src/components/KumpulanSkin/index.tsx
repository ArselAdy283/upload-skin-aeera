"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SkinViewer } from "skinview3d";

type SkinData = {
    nickname: string;
    skins: {
        ["Baju Pribadi"]?: {
            skin: string;
            lengan: string;
        };
        ["Baju Sekolah"]?: {
            skin: string;
            lengan: string;
        };
    };
};

const KumpulanSkin = ({ refreshKey }: { refreshKey: number }) => {
    const [data, setData] = useState<SkinData[]>([]);
    useEffect(() => {
        fetch("/api/skins")
            .then((res) => res.json())
            .then((res) => setData(res));
    }, [refreshKey]);
    const [sekolahImages, setSekolahImages] = useState<any[]>([]);
    const [pribadiImages, setPribadiImages] = useState<any[]>([]);

    useEffect(() => {
        if (data.length === 0) return;

        async function generate() {
            const sekolah: any[] = [];
            const pribadi: any[] = [];

            const canvas = document.createElement("canvas");
            canvas.width = 300;
            canvas.height = 300;

            const viewer = new SkinViewer({
                canvas,
                width: 300,
                height: 300,
                renderPaused: true,
            });

            viewer.camera.rotation.x = -0.62;
            viewer.camera.rotation.y = 0.534;
            viewer.camera.rotation.z = 0.348;
            viewer.camera.position.set(30.5, 22, 42);

            for (const user of data) {

                if (user.skins["Baju Pribadi"]) {
                    const url = user.skins["Baju Pribadi"]?.skin;

                    try {
                        await viewer.loadSkin(url);

                        viewer.render();

                        pribadi.push({
                            nickname: user.nickname,
                            image: viewer.canvas.toDataURL("image/png"),
                            original: url,
                        });
                    } catch (e) {
                        console.error("ERROR SEKOLAH:", user.nickname, e);
                    }
                }

                if (user.skins["Baju Sekolah"]) {
                    const url = user.skins["Baju Sekolah"]?.skin;

                    try {
                       await viewer.loadSkin(url);

                        viewer.render();

                        sekolah.push({
                            nickname: user.nickname,
                            image: viewer.canvas.toDataURL("image/png"),
                            original: url,
                        });
                    } catch (e) {
                        console.error("ERROR SEKOLAH:", user.nickname, e);
                    }
                }
            }

            viewer.dispose();

            setSekolahImages(sekolah);
            setPribadiImages(pribadi);
        }

        generate();
    }, [data]);

    return (
        <div className="min-h-screen p-10 bg-slate-950 text-white">

            {/* ================= SEKOLAH ================= */}
            <h1 className="text-3xl font-bold mb-10 text-center">
                🏫 Baju Sekolah
            </h1>

            {sekolahImages.length === 0 ? (
                <div className="text-center text-slate-600 py-10">
                    Skin masih kosong
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {sekolahImages.map((item) => (
                        <Link
                            href={item.original}
                            key={item.nickname}
                            target="_blank"
                            className="bg-slate-900 border border-white/10 rounded-2xl p-5 text-center hover:scale-105 transition"
                        >
                            <img src={item.image} className="mx-auto rounded-lg" />

                            <div className="flex gap-2 md:gap-5 justify-center">
                                <Image
                                    src={`https://crafthead.net/helm/${item.nickname}`}
                                    alt={item.nickname}
                                    width={40}
                                    height={40}
                                    className="w-5 h-5 md:w-10 md:h-10"
                                />
                                <h1 className="md:mt-3 font-semibold text-sm md:text-xl">{item.nickname}</h1>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* ================= PRIBADI ================= */}
            <h1 className="text-3xl font-bold my-10 text-center">
                👕 Baju Pribadi
            </h1>

            {pribadiImages.length === 0 ? (
                <div className="text-center text-slate-600 py-10">
                    Skin masih kosong
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {pribadiImages.map((item) => (
                        <Link
                            href={item.original}
                            key={item.nickname}
                            target="_blank"
                            className="bg-slate-900 border border-white/10 rounded-2xl p-5 text-center hover:scale-105 transition"
                        >
                            <img src={item.image} className="mx-auto rounded-lg" />

                            <div className="flex gap-2 md:gap-5 justify-center">
                                <Image
                                    src={`https://crafthead.net/helm/${item.nickname}`}
                                    alt={item.nickname}
                                    width={40}
                                    height={40}
                                    className="w-5 h-5 md:w-10 md:h-10"
                                />
                                <h1 className="md:mt-3 font-semibold text-sm md:text-xl">{item.nickname}</h1>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default KumpulanSkin;