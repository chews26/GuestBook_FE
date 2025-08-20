import { useEffect, useRef, useState } from "react";
import { type Entry, type Page, fetchEntries } from "../api/guestbook";
import EntryItem from "./EntryItem";

type Props = { onDataChanged: () => void };

export default function EntryList({ onDataChanged }: Props) {
    const [items, setItems] = useState<Entry[]>([]);
    const [cursor, setCursor] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const moreRef = useRef<HTMLDivElement | null>(null);

    async function load(reset = false) {
        if (loading) return;
        setLoading(true);
        try {
            const page: Page<Entry> = await fetchEntries(reset ? undefined : cursor || undefined, 20);
            setItems(reset ? page.items : [...items, ...page.items]);
            setCursor(page.nextCursor);
        } finally { setLoading(false); }
    }

    useEffect(() => { load(true); }, []);

    useEffect(() => {
        if (!moreRef.current) return;
        const io = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && cursor) load();
        });
        io.observe(moreRef.current);
        return () => io.disconnect();
    }, [cursor, items, loading]);

    return (
        <div id="posts-container">
            {items.map(it => <EntryItem key={it.id} item={it} onChanged={onDataChanged} />)}
            <div ref={moreRef} />
            {!cursor && items.length > 0 && <div style={{textAlign: 'center', padding: '16px', color: '#666'}}>더 이상 글이 없습니다.</div>}
        </div>
    );
}
