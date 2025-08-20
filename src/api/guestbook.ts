import axios from "axios";
const API = axios.create({ baseURL: "/api/guestbook" });

export type Entry = { id: number; nickname: string; message: string; createdAt: string; likeCount: number };
export type Page<T> = { items: T[]; nextCursor: number | null };

export async function fetchEntries(cursor?: number, size = 20): Promise<Page<Entry>> {
    const res = await API.get("", { params: { cursor, size } });
    return res.data;
}
export async function createEntry(nickname: string, message: string, deleteCode: string): Promise<Entry> {
    const res = await API.post("", { nickname, message, deleteCode });
    return res.data;
}
export async function deleteEntry(id: number, code: string): Promise<void> {
    await API.delete(`/${id}`, { params: { code } });
}
export async function likeEntry(id: number): Promise<Entry> {
    const res = await API.post(`/${id}/like`);
    return res.data;
}