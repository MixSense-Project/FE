import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../../components/Header";
import Nav from "../../components/Nav";
import logo_img from "../../assets/img/logo.svg";
import chat_btn from "../../assets/img/AISearch/chat_btn.svg";
import { aiSearch } from "../../api/ai";
import Musiclist from "../../components/Ai_Search/Aisearch_musiclist";

const DEFAULT_K = 5;

const Ai_Search = () => {
  const location = useLocation();

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ 메시지: text 또는 tracks 를 담을 수 있게 확장
  // { id, type: "text"|"xtracks", text?, tracks? }
  const [messages, setMessages] = useState([]);

  const bottomRef = useRef(null);

  // ✅ 재진입(다시 들어올 때)만 리셋
  useEffect(() => {
    setInput("");
    setLoading(false);
    setMessages([]);
  }, [location.key]);

  // 아래로 자동 스크롤
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const pushMessage = (msg) => {
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), ...msg }]);
  };

  const send = async () => {
    const q = input.trim();
    if (!q || loading) return;

    pushMessage({ role: "user", type: "text", text: q });
    setInput("");
    setLoading(true);

    try {
      const res = await aiSearch({
        query: q,
        k: DEFAULT_K,
        seed_track_id: null,
      });

      // 여기부터는 res만 쓰기 (data 같은 이름 충돌 방지)
      const mode = res?.mode;
      const list = Array.isArray(res?.results) ? res.results : [];

      // 1) clarify
      if (mode === "clarify" && res?.clarification_question) {
        pushMessage({ role: "ai", type: "text", text: res.clarification_question });
        return;
      }

      // 2) external
      if (mode === "external") {
        pushMessage({
          role: "ai",
          type: "text",
          text:
            "내 데이터에서 확실히 매칭되는 곡을 못 찾았어."+
            "아래 링크로 바로 검색해볼래?",
        });

        if (res?.external_search_url) {
          pushMessage({
            role: "ai",
            type: "link",
            url: res.external_search_url,
            label: "YouTube에서 검색하기",
          });
        }
        return;
      }

      // 3) base (또는 그 외)
      if (list.length > 0) {
        pushMessage({
          role: "ai",
          type: "text",
          text: `추천 곡 ${list.length}개를 찾았어!`,
        });
        pushMessage({ role: "ai", type: "tracks", tracks: list });
      } else {
        pushMessage({
          role: "ai",
          type: "text",
          text: "추천 결과가 비어있어. 키워드를 조금 바꿔서 다시 말해줘!",
        });
      }
    } catch (e) {
      console.log("AI search error:", e, e?.response);
      pushMessage({
        role: "ai",
        type: "text",
        text:
          "에러가 발생했어요: " +
          (e?.response?.data?.detail || e?.message || "unknown"),
      });
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") send();
  };

  return (
    <div className="Ai_Search_Wrap">
      <div className="container">
        <Header />

        <header>
          <img src={logo_img} alt="" />
          <p>MixSense AI</p>
        </header>

        <div className="ai_chat_area">
          <div className="ai_messages">
            {messages.map((m) => {
              // ✅ 텍스트 말풍선 (유저/AI 질문/답변)
              if (m.type === "text") {
                return (
                  <div
                    key={m.id}
                    className={`ai_bubble ${m.role === "user" ? "user" : "ai"}`}
                  >
                    {m.text}
                  </div>
                );
              }

              // 링크
              if (m.type === "link") {
                return (
                  <a
                    key={m.id}
                    className="ai_link"
                    href={m.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {m.label || "Open link"}
                  </a>
                );
              }

              // 트랙 리스트
              if (m.type === "tracks") {
                return (
                  <div key={m.id} className="ai_track_list">
                    {m.tracks.map((t) => (
                      <Musiclist
                        key={t.track_id}
                        title={t.title}
                        artist={t.artist}
                        thumbnail={t.thumbnail_url || t.track_image_url}
                        onAdd={() => console.log("추가된 트랙:", t.track_id)}
                      />
                    ))}
                  </div>
                );
              }

              return null;
            })}

            {loading && <div className="ai_bubble ai">Searching...</div>}

            <div ref={bottomRef} />
          </div>
        </div>

        <div className="chat">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ask MixSense AI..."
            disabled={loading}
          />
          <button
            className="chat_btn"
            onClick={send}
            disabled={loading || !input.trim()}
            type="button"
            aria-label="send"
          >
            <img src={chat_btn} alt="" />
          </button>
        </div>
      </div>

      <Nav />
    </div>
  );
};

export default Ai_Search;