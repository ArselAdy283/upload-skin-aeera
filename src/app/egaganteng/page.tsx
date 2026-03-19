"use client";

import { useEffect, useState } from "react";

type SkinItem = {
  id: number;
  nickname: string;
  jenis_skin: string;
  skin: string;
  lengan: string;
};

export default function SkinsCRUD() {
  const [skins, setSkins] = useState<SkinItem[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [nicknameEdit, setNicknameEdit] = useState("");
  const [jenisEdit, setJenisEdit] = useState("");
  const [lenganEdit, setLenganEdit] = useState("");

  // fetch data
  const fetchData = async () => {
    const res = await fetch("/api/skins/crud");
    const data = await res.json();
    setSkins(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // hapus
  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus?")) return;
    await fetch(`/api/skins/crud?id=${id}`, { method: "DELETE" });
    fetchData();
  };

  // edit
  const startEdit = (item: SkinItem) => {
    setEditingId(item.id);
    setNicknameEdit(item.nickname);
    setJenisEdit(item.jenis_skin);
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
        jenis_skin: jenisEdit,
        lengan: lenganEdit,
      }),
    });
    setEditingId(null);
    fetchData();
  };

  return (
    <div className="p-10 bg-slate-950 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-8">CRUD Skins</h1>
      <table className="w-full text-left border border-white/10 rounded-xl overflow-hidden">
        <thead className="bg-slate-900">
          <tr>
            <th className="p-3 border-b border-white/10">ID</th>
            <th className="p-3 border-b border-white/10">Nickname</th>
            <th className="p-3 border-b border-white/10">Jenis Skin</th>
            <th className="p-3 border-b border-white/10">Lengan</th>
            <th className="p-3 border-b border-white/10">Preview</th>
            <th className="p-3 border-b border-white/10">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {skins.map((item) => (
            <tr key={item.id} className="bg-slate-900/50">
              <td className="p-3 border-b border-white/10">{item.id}</td>
              <td className="p-3 border-b border-white/10">
                {editingId === item.id ? (
                  <input
                    value={nicknameEdit}
                    onChange={(e) => setNicknameEdit(e.target.value)}
                    className="text-white p-1 rounded"
                  />
                ) : (
                  item.nickname
                )}
              </td>
              <td className="p-3 border-b border-white/10">
                {editingId === item.id ? (
                  <input
                    value={jenisEdit}
                    onChange={(e) => setJenisEdit(e.target.value)}
                    className="text-white p-1 rounded"
                  />
                ) : (
                  item.jenis_skin
                )}
              </td>
              <td className="p-3 border-b border-white/10">
                {editingId === item.id ? (
                  <input
                    value={lenganEdit}
                    onChange={(e) => setLenganEdit(e.target.value)}
                    className="text-white p-1 rounded"
                  />
                ) : (
                  item.lengan
                )}
              </td>
              <td className="p-3 border-b border-white/10">
                <img src={item.skin} className="w-16 h-16 object-contain" />
              </td>
              <td className="p-3 border-b border-white/10 flex gap-2">
                {editingId === item.id ? (
                  <>
                    <button
                      onClick={saveEdit}
                      className="bg-green-600 px-3 py-1 rounded"
                    >
                      Simpan
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-red-600 px-3 py-1 rounded"
                    >
                      Batal
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEdit(item)}
                      className="bg-blue-600 px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-600 px-3 py-1 rounded"
                    >
                      Hapus
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}