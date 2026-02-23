// Mypage.jsx (완성본: GET /profile/by_user -> display_name 세팅,
// PATCH /profile/edit_profile -> display_name 저장, ngrok 헤더 포함)

import React, { useEffect, useRef, useState } from "react";
import SubHeader from "../../components/SubHeader";
import edit_btn from "../../assets/img/home/edit_btn.svg";
import { api } from "../../api/client";

const NGROK_HEADERS = {
  "ngrok-skip-browser-warning": "true",
  Accept: "application/json",
};

const isHtmlString = (v) =>
  typeof v === "string" && (v.includes("<html") || v.includes("<!doctype html"));

const Mypage = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const fileRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [displayName, setDisplayName] = useState(""); // ✅ 닉네임(input)
  const [originalDisplayName, setOriginalDisplayName] = useState(""); // ✅ PATCH original_name 용
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const onPickImage = () => {
    fileRef.current?.click();
  };

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImagePreview(url);
  };

  // ✅ 1) 로그인 유저 프로필 불러오기
  useEffect(() => {
    let mounted = true;

    const fetchMyProfile = async () => {
      try {
        setLoading(true);

        const res = await api.get("/profile/by_user", {
          headers: NGROK_HEADERS,
        });

        if (isHtmlString(res.data)) {
          console.error("[Mypage] Expected JSON but got HTML. Head:", res.data.slice(0, 200));
          alert("프로필 조회 응답이 JSON이 아니라 HTML입니다. (ngrok 경고/랜딩 페이지)");
          return;
        }

        const data = res.data;

        // ✅ 너가 준 응답 형태: { profiles: [ { ... } ] }
        const picked =
          (Array.isArray(data?.profiles) && data.profiles[0]) ||
          (Array.isArray(data) && data[0]) ||
          data?.profile ||
          data;

        if (!mounted) return;

        setProfile(picked || null);

        // ✅ 닉네임: display_name
        const serverDisplayName = picked?.display_name ?? "";
        setDisplayName(serverDisplayName);
        setOriginalDisplayName(serverDisplayName);
      } catch (err) {
        console.error("[Mypage] GET /profile/by_user failed:", err);
        const status = err?.response?.status;

        if (status === 401) alert("로그인이 만료되었습니다. 다시 로그인해 주세요.");
        else alert("유저 정보를 불러오지 못했습니다.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchMyProfile();
    return () => {
      mounted = false;
    };
  }, []);

  // ✅ 2) 닉네임 저장
  const onSaveDisplayName = async () => {
    if (!profile) {
      alert("프로필 정보를 먼저 불러와야 합니다.");
      return;
    }

    const trimmed = displayName.trim();
    if (!trimmed) {
      alert("닉네임을 입력해 주세요.");
      return;
    }

    if (trimmed === originalDisplayName) return;

    const userId = profile?.user_id;
    if (!userId) {
      console.error("[Mypage] user_id missing:", profile);
      alert("user_id가 없습니다. 응답 필드를 확인해 주세요.");
      return;
    }

    try {
      setSaving(true);

      const body = {
        user_id: String(userId),
        original_name: String(originalDisplayName || ""),
        updated: {
          // ✅ display_name으로 저장
          display_name: trimmed,
        },
      };

      const res = await api.patch("/profile/edit_profile", body, {
        headers: NGROK_HEADERS,
      });

      if (isHtmlString(res.data)) {
        console.error("[Mypage] Expected JSON but got HTML. Head:", res.data.slice(0, 200));
        alert("닉네임 저장 응답이 JSON이 아니라 HTML입니다. (ngrok 경고/랜딩 페이지)");
        return;
      }

      // ✅ 성공 시 UI 반영
      setOriginalDisplayName(trimmed);
      setProfile((prev) => (prev ? { ...prev, display_name: trimmed } : prev));
      alert("닉네임이 저장되었습니다.");
    } catch (err) {
      console.error("[Mypage] PATCH /profile/edit_profile failed:", err);

      const status = err?.response?.status;
      const detail = err?.response?.data?.detail;

      if (status === 401) {
        alert("로그인이 만료되었습니다. 다시 로그인해 주세요.");
      } else if (status === 422) {
        alert("요청 형식이 잘못되었습니다. (422)\nNetwork 탭에서 요청 바디/응답을 확인해 주세요.");
      } else {
        alert(detail ? String(detail) : "닉네임 저장에 실패했습니다.");
      }
    } finally {
      setSaving(false);
    }
  };

  const onNameKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSaveDisplayName();
    }
  };

  return (
    <div className="mypage_wrap">
      <div className="container">
        <SubHeader title={"MyPage"} />

        <div className="profile" onClick={onPickImage} role="button" tabIndex={0}>
          {imagePreview ? (
            <img className="profile_img" src={imagePreview} alt="선택한 이미지 미리보기" />
          ) : (
            <div className="profile_img">
              <img className="profile_img_edit" src={edit_btn} alt="" />
            </div>
          )}

          <input
            type="file"
            style={{ display: "none" }}
            ref={fileRef}
            onChange={onFileChange}
            accept="image/*"
          />
        </div>

        <div className="name">
          <input
            type="text"
            value={displayName}
            placeholder={loading ? "불러오는 중..." : "닉네임 입력"}
            onChange={(e) => setDisplayName(e.target.value)}
            onKeyDown={onNameKeyDown}
            disabled={loading || saving}
          />

          <button
            type="button"
            onClick={onSaveDisplayName}
            disabled={
              loading || saving || !profile || displayName.trim() === originalDisplayName
            }
            style={{ marginLeft: 8 }}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>

        <div className="btn">
          <button className="logout">Logout</button>
          <button className="logout">Unsubscribe</button>
        </div>

        <div className="area" />
      </div>

      <div className="area" />
    </div>
  );
};

export default Mypage;