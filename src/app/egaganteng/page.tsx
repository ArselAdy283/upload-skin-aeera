"use client";

import { useEffect, useState } from "react";

type SkinItem = {
  id: number;
  nickname: string;
  jenis_baju_id: number;
  jenis_baju_nama: string;
  skin: string;
  lengan: string;
};

export default function SkinsCRUD() {
  const [skins, setSkins] = useState<SkinItem[]>([]);
  const [jenisList, setJenisList] = useState<{ id: number; jenis_baju: string }[]>([]);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [nicknameEdit, setNicknameEdit] = useState("");
  const [jenisEdit, setJenisEdit] = useState("");
  const [lenganEdit, setLenganEdit] = useState("");

  const [newJenis, setNewJenis] = useState("");

  // State edit & hapus jenis baju
  const [editingJenisId, setEditingJenisId] = useState<number | null>(null);
  const [jenisEditNama, setJenisEditNama] = useState("");

  const fetchData = async () => {
    const res = await fetch("/api/skins/crud");
    const data = await res.json();
    setSkins(data);
  };

  const fetchJenis = async () => {
    const res = await fetch("/api/skins/jenis_baju");
    const data = await res.json();
    setJenisList(data);
  };

  useEffect(() => {
    fetchData();
    fetchJenis();
  }, []);

  const tambahJenis = async () => {
    if (!newJenis.trim()) return;
    await fetch("/api/skins/jenis_baju", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jenis_baju: newJenis }),
    });
    setNewJenis("");
    fetchJenis();
  };

  const startEditJenis = (j: { id: number; jenis_baju: string }) => {
    setEditingJenisId(j.id);
    setJenisEditNama(j.jenis_baju);
  };

  const saveEditJenis = async () => {
    if (editingJenisId === null) return;
    await fetch("/api/skins/jenis_baju", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editingJenisId, jenis_baju: jenisEditNama }),
    });
    setEditingJenisId(null);
    setJenisEditNama("");
    fetchJenis();
  };

  const deleteJenis = async (id: number) => {
    if (!confirm("Yakin ingin menghapus jenis baju ini?")) return;
    await fetch(`/api/skins/jenis_baju?id=${id}`, { method: "DELETE" });
    fetchJenis();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus skin ini?")) return;
    await fetch(`/api/skins/crud?id=${id}`, { method: "DELETE" });
    fetchData();
  };

  const startEdit = (item: SkinItem) => {
    setEditingId(item.id);
    setNicknameEdit(item.nickname);
    setJenisEdit(String(item.jenis_baju_id));
    setLenganEdit(item.lengan);
  };

  const saveEdit = async () => {
    if (editingId === null) return;
    await fetch("/api/skins/crud", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editingId,
        nickname: nicknameEdit,
        jenis_baju_id: Number(jenisEdit),
        lengan: lenganEdit,
      }),
    });
    setEditingId(null);
    fetchData();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold text-white tracking-tight">Manajemen Skins</h1>
          <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400 bg-emerald-400/10 border border-emerald-400/25 px-2.5 py-1 rounded-full">
            Admin
          </span>
        </div>
        <p className="text-sm text-slate-500">Kelola data skin dan jenis baju karakter.</p>
      </div>

      {/* ── TABEL SKINS ── */}
      <div className="rounded-xl border border-slate-800 overflow-hidden mb-10">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/60">
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Daftar Skins
          </span>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-0.5 rounded-full">
            {skins.length} item
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/30">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 w-16">#</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Nickname</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Jenis Baju</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Lengan</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Preview</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {skins.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-slate-600 text-sm font-mono">
                    — Belum ada data skin —
                  </td>
                </tr>
              )}
              {skins.map((item) => {
                const isEditing = editingId === item.id;
                return (
                  <tr
                    key={item.id}
                    className={
                      isEditing
                        ? "bg-emerald-400/5 border-l-2 border-l-emerald-400"
                        : "hover:bg-slate-800/40 transition-colors"
                    }
                  >
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-500">#{item.id}</td>

                    <td className="px-5 py-3.5">
                      {isEditing ? (
                        <input
                          value={nicknameEdit}
                          onChange={(e) => setNicknameEdit(e.target.value)}
                          className="w-full bg-slate-800 border border-emerald-400/40 focus:border-emerald-400 rounded-lg px-3 py-1.5 text-sm text-white outline-none transition-colors"
                        />
                      ) : (
                        <span className="font-semibold text-slate-100">{item.nickname}</span>
                      )}
                    </td>

                    <td className="px-5 py-3.5">
                      {isEditing ? (
                        <select
                          value={jenisEdit}
                          onChange={(e) => setJenisEdit(e.target.value)}
                          className="bg-slate-800 border border-emerald-400/40 focus:border-emerald-400 rounded-lg px-3 py-1.5 text-sm text-white outline-none transition-colors"
                        >
                          {jenisList.map((j) => (
                            <option key={j.id} value={j.id}>
                              {j.jenis_baju}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-slate-700/60 text-slate-300 border border-slate-700">
                          {item.jenis_baju_nama}
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-3.5">
                      {isEditing ? (
                        <input
                          value={lenganEdit}
                          onChange={(e) => setLenganEdit(e.target.value)}
                          className="w-full bg-slate-800 border border-emerald-400/40 focus:border-emerald-400 rounded-lg px-3 py-1.5 text-sm text-white outline-none transition-colors"
                        />
                      ) : (
                        <span className="text-slate-400">{item.lengan}</span>
                      )}
                    </td>

                    <td className="px-5 py-3.5">
                      <img
                        src={item.skin}
                        alt={item.nickname}
                        className="w-12 h-12 object-cover rounded-lg border border-slate-700 bg-slate-800"
                      />
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        {isEditing ? (
                          <>
                            <button
                              onClick={saveEdit}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-400/10 hover:bg-emerald-400/20 border border-emerald-400/30 hover:border-emerald-400/60 text-emerald-400 transition-all"
                            >
                              ✓ Simpan
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 transition-all"
                            >
                              Batal
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEdit(item)}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-400/10 hover:bg-indigo-400/20 border border-indigo-400/25 hover:border-indigo-400/50 text-indigo-400 transition-all"
                            >
                              ✎ Edit
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-400/10 hover:bg-red-400/20 border border-red-400/20 hover:border-red-400/50 text-red-400 transition-all"
                            >
                              ✕ Hapus
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── TABEL JENIS BAJU ── */}
      <div className="rounded-xl border border-slate-800 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/60">
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Jenis Baju
          </span>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-0.5 rounded-full">
            {jenisList.length} jenis
          </span>
        </div>

        {/* Form tambah */}
        <div className="px-5 py-4 border-b border-slate-800 bg-slate-900/20 flex items-center gap-3">
          <input
            value={newJenis}
            onChange={(e) => setNewJenis(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && tambahJenis()}
            placeholder="Nama jenis baju baru..."
            className="flex-1 max-w-xs bg-slate-800 border border-slate-700 focus:border-emerald-400 rounded-lg px-4 py-2 text-sm text-white placeholder-slate-600 outline-none transition-colors"
          />
          <button
            onClick={tambahJenis}
            className="px-4 py-2 rounded-lg text-sm font-bold bg-emerald-400 hover:bg-emerald-300 text-slate-950 transition-colors"
          >
            + Tambah
          </button>
        </div>

        {/* Tabel jenis */}
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/30">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 w-20">#</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Nama Jenis Baju</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/70">
            {jenisList.length === 0 && (
              <tr>
                <td colSpan={3} className="px-5 py-8 text-center text-slate-600 text-sm font-mono">
                  — Belum ada jenis baju —
                </td>
              </tr>
            )}
            {jenisList.map((j) => {
              const isEditingJenis = editingJenisId === j.id;
              return (
                <tr
                  key={j.id}
                  className={
                    isEditingJenis
                      ? "bg-emerald-400/5 border-l-2 border-l-emerald-400"
                      : "hover:bg-slate-800/40 transition-colors"
                  }
                >
                  <td className="px-5 py-3.5 font-mono text-xs text-slate-500">#{j.id}</td>

                  <td className="px-5 py-3.5">
                    {isEditingJenis ? (
                      <input
                        value={jenisEditNama}
                        onChange={(e) => setJenisEditNama(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && saveEditJenis()}
                        className="w-full max-w-xs bg-slate-800 border border-emerald-400/40 focus:border-emerald-400 rounded-lg px-3 py-1.5 text-sm text-white outline-none transition-colors"
                      />
                    ) : (
                      <span className="font-medium text-slate-200">{j.jenis_baju}</span>
                    )}
                  </td>

                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      {isEditingJenis ? (
                        <>
                          <button
                            onClick={saveEditJenis}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-400/10 hover:bg-emerald-400/20 border border-emerald-400/30 hover:border-emerald-400/60 text-emerald-400 transition-all"
                          >
                            ✓ Simpan
                          </button>
                          <button
                            onClick={() => setEditingJenisId(null)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 transition-all"
                          >
                            Batal
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEditJenis(j)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-400/10 hover:bg-indigo-400/20 border border-indigo-400/25 hover:border-indigo-400/50 text-indigo-400 transition-all"
                          >
                            ✎ Edit
                          </button>
                          <button
                            onClick={() => deleteJenis(j.id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-400/10 hover:bg-red-400/20 border border-red-400/20 hover:border-red-400/50 text-red-400 transition-all"
                          >
                            ✕ Hapus
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}