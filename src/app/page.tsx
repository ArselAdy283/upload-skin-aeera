"use client";

import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import Link from "next/link";
import { FaInstagram, FaTiktok, FaYoutube, FaCloudUploadAlt, FaUser } from "react-icons/fa";
import KumpulanSkin from "@/components/KumpulanSkin";

export default function HomePage() {
  const [nickname, setNickname] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [jenis, setJenis] = useState("Baju Pribadi");
  const [lengan, setLengan] = useState("classic");
  const [preview, setPreview] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>("https://crafthead.net/avatar/steve");

  useEffect(() => {
    if (nickname.trim().length > 0) {

      setAvatarUrl(`https://crafthead.net/helm/${nickname}`);
    } else {
      setAvatarUrl("https://crafthead.net/helm/steve");
    }
  }, [nickname]);

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const fileInput = e.target.querySelector('input[type="file"]');
    const file = fileInput.files[0];

    if (!file) {
      alert("Pilih file dulu!");
      return;
    }

    if (!nickname) {
      alert("Isi nickname dulu!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("jenis", jenis);
    formData.append("nickname", nickname);
    formData.append("lengan", lengan)

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    let data;
    try {
      data = await res.json();
    } catch {
      alert("Server error (bukan JSON)");
      return;
    }

    if (!res.ok) {
      console.error(data);
      alert("Upload gagal: " + (data?.error || "unknown"));
      return;
    }

  // berhasil
    alert("Upload berhasil!");
    setPreview(data.path);

    // optional reset
    setNickname("");
    setRefreshKey(prev => prev + 1);
  };

  const handleDrop = (e: any) => {
    e.preventDefault();

    const file = e.dataTransfer.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));

      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      input.files = dataTransfer.files;
    }
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white font-sans">
      {/* Banner */}
      <section className="relative h-100 flex items-center justify-center bg-hero">
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-5">
          <Link href="https://www.instagram.com/aeera_studios" target="_blank" className="hover:text-pink-500 transition-colors"><FaInstagram size={30} /></Link>
          <Link href="https://www.tiktok.com/@aeera.studios" target="_blank" className="hover:text-cyan-400 transition-colors"><FaTiktok size={30} /></Link>
          <Link href="https://www.youtube.com/@aeerastudios" target="_blank" className="hover:text-red-500 transition-colors"><FaYoutube size={30} /></Link>
        </div>
      </section>

      {/* Input Skin Section */}
      <section className="max-w-xl mx-auto py-20 px-5">
        <div className="bg-slate-900 border border-white/10 p-8 rounded-2xl shadow-2xl">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
            <FaCloudUploadAlt className="text-blue-500" /> Upload Skin Aeera
          </h2>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Input Nickname dengan Kepala Skin */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Nickname In-Game</label>
              <div className="flex gap-3">
                {/* Avatar Preview */}
                <div className="shrink-0 w-12 h-12 overflow-hidden flex items-center justify-center shadow-inner">
                  <img
                    src={avatarUrl}
                    alt="Head Preview"
                    className="w-10 h-10 object-contain [image-rendering:pixelated]"
                    onError={() => setAvatarUrl("https://crafthead.net/helm/steve")}
                  />
                </div>

                <div className="relative grow">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Contoh: BLUEMC1288"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-blue-500 transition-all"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* jenis skin */}
            <label className="block text-sm font-medium text-slate-400 mb-1">jenis skin</label>
            <label className="block text-sm text-slate-500 mb-2">(kalo akun premium ga perlu baju pribadi)</label>
            <select
              onChange={(e) => setJenis(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 pl-4 pr-4"
            >
              <option>Baju Pribadi</option>
              <option>Baju Sekolah</option>
            </select>

            {/* lengan */}
            <label className="block text-sm font-medium text-slate-400 mb-2">jenis lengan</label>
            <select
              onChange={(e) => setJenis(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 pl-4 pr-4"
            >
              <option value="classic">Classic (Steve)</option>
              <option value="slim">Slim (Alex)</option>
            </select>

            {/* Input File */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">File Skin (.png)</label>
              <label
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:bg-white/5 hover:border-blue-500/50 transition-all"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FaCloudUploadAlt size={30} className="text-slate-500 mb-2" />
                  <p className="text-sm text-slate-400">Klik untuk upload atau drag & drop</p>
                </div>
                <input type="file" className="hidden" accept="image/png" onChange={handleFileChange} />
              </label>
            </div>

            {/* Preview Section */}
            {preview && (
              <div className="mt-4 p-4 bg-slate-950 rounded-xl border border-white/5 flex flex-col items-center">
                <p className="text-xs text-slate-500 mb-3 uppercase tracking-widest">Preview Skin</p>
                <img src={preview} alt="Preview" className="h-32 object-contain [image-rendering:pixelated]" />
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98]"
            >
              Simpan Skin ke Server
            </button>
          </form>
        </div>
      </section>
      <KumpulanSkin refreshKey={refreshKey} />

      <Footer />
    </main>
  );
}