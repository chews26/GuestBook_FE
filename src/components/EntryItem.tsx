import { type Entry, deleteEntry, likeEntry } from "../api/guestbook";
import { useState } from "react";

type Props = { item: Entry; onChanged: () => void };

export default function EntryItem({ item, onChanged }: Props) {
    const [pending, setPending] = useState(false);

    async function onDelete() {
        const saved = localStorage.getItem("gb_code") || "";
        const code = prompt("삭제하려면 비밀번호를 입력하세요.", saved || "") || "";
        if (!code.trim()) return;
        setPending(true);
        try {
            await deleteEntry(item.id, code.trim());
            onChanged();
        } catch (e) {
            alert(`삭제에 실패했습니다: ${e}`);
        } finally {
            setPending(false);
        }
    }

    async function onLike() {
        setPending(true);
        try {
            await likeEntry(item.id);
            onChanged();
        } catch (e) {
            alert(`좋아요 실패: ${e}`);
        } finally {
            setPending(false);
        }
    }

    return (
        <div className="post">
            <button onClick={onDelete} disabled={pending} className="delete-btn" title="삭제">&times;</button>
            <div className="post-header">
                <h2 className="post-title">{item.nickname}</h2>
                <span className="post-meta">{new Date(item.createdAt).toLocaleString('ko-KR')}</span>
            </div>
            <p className="post-content">{item.message}</p>
            <div className="post-actions">
                <button onClick={onLike} disabled={pending} className="like-btn">좋아요 {item.likeCount}</button>
            </div>
        </div>
    );
}
