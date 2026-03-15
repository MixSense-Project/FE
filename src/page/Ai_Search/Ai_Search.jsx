import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../../components/Header";
import Nav from "../../components/Nav";
import logo_img from "../../assets/img/logo.svg";
import chat_btn from "../../assets/img/AISearch/chat_btn.svg";
import { aiSearch } from "../../api/ai";
import Musiclist from "../../components/Ai_Search/Aisearch_musiclist";
import { useMusic } from "../../context/MusicContext";

const DEFAULT_K = 5;

const Ai_Search = () => {
  const location = useLocation();
  const { playQueue } = useMusic();

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  const bottomRef = useRef(null);

  useEffect(() => {
    setInput("");
    setLoading(false);
    setMessages([]);
  }, [location.key]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const pushMessage = (msg) => {
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), ...msg }]);
  };

  const handlePlayTrack = (tracks, index) => {
    if (!Array.isArray(tracks) || tracks.length === 0) return;
    playQueue(tracks, index);
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

      const mode = res?.mode;
      const list = Array.isArray(res?.results) ? res.results : [];

      if (mode === "clarify" && res?.clarification_question) {
        pushMessage({
          role: "ai",
          type: "text",
          text: res.clarification_question,
        });
        return;
      }

      if (mode === "external") {
        pushMessage({
          role: "ai",
          type: "text",
          text:
            "내 데이터에서 확실히 매칭되는 곡을 못 찾았어." +
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

      if (list.length > 0) {
        pushMessage({
          role: "ai",
          type: "text",
          text: `추천 곡 ${list.length}개를 찾았어!`,
        });
        pushMessage({
          role: "ai",
          type: "tracks",
          tracks: list,
        });
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

              if (m.type === "tracks") {
                return (
                  <div key={m.id} className="ai_track_list">
                    {m.tracks.map((t, idx) => (
                      <Musiclist
                        key={t.track_id || t.id || `${m.id}-${idx}`}
                        track={t}
                        trackId={t.track_id || t.id}
                        title={t.title}
                        artist={t.artist}
                        thumbnail={t.thumbnail_url || t.track_image_url}
                        onPlay={() => handlePlayTrack(m.tracks, idx)}
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