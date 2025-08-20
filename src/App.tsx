import { useState } from "react";
import EntryForm from "./components/EntryForm";
import EntryList from "./components/EntryList";
import "./App.css";

export default function App() {
    const [version, setVersion] = useState(0);
    const reload = () => setVersion(v => v + 1);

    return (
        <div className="container">
            <h1>익명 게시판</h1>
            <div className="main-layout">
                <div className="form-section">
                    <h2>새 글 작성</h2>
                    <EntryForm onCreated={reload} />
                </div>
                <div className="posts-section">
                    <h2>게시글 목록</h2>
                    <EntryList key={version} onDataChanged={reload} />
                </div>
            </div>
        </div>
    );
}
