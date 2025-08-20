import { useState, useEffect } from "react";
import { createEntry } from "../api/guestbook";

type Props = { onCreated: () => void };

export default function EntryForm({ onCreated }: Props) {
    const [nickname, setNickname] = useState("");
    const [message, setMessage] = useState("");
    const [deleteCode, setDeleteCode] = useState("");
    const [pending, setPending] = useState(false);

    useEffect(() => {
        const n = localStorage.getItem("gb_nickname") || "";
        const c = localStorage.getItem("gb_code") || "";
        setNickname(n);
        setDeleteCode(c);
    }, []);

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        if (!nickname.trim() || !message.trim() || !deleteCode.trim()) {
            alert("닉네임, 내용, 비밀번호를 모두 입력해주세요.");
            return;
        }
        setPending(true);
        try {
            await createEntry(nickname.trim(), message.trim(), deleteCode.trim());
            localStorage.setItem("gb_nickname", nickname.trim());
            localStorage.setItem("gb_code", deleteCode.trim());
            setMessage("");
            onCreated();
        } catch (e) {
            alert(`글 등록에 실패했습니다: ${e}`);
        } finally {
            setPending(false);
        }
    }

    return (
        <form id="post-form" onSubmit={submit}>
            <div className="form-group">
                <input type="text" value={nickname} onChange={e => setNickname(e.target.value)} placeholder="닉네임 (제목으로 표시됩니다)" required disabled={pending} />
            </div>
            <div className="form-group">
                <input type="password" value={deleteCode} onChange={e => setDeleteCode(e.target.value)} placeholder="비밀번호 (삭제 시 필요)" required disabled={pending} />
            </div>
            <div className="form-group">
                <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="내용을 입력하세요..." required disabled={pending}></textarea>
            </div>
            <button type="submit" disabled={pending}>
                {pending ? "등록 중..." : "글쓰기"}
            </button>
        </form>
    );
}
