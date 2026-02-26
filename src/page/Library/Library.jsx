import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/Header";
import Nav from "../../components/Nav";
import plus_btn from "../../assets/img/library/plus_btn.svg";
import camera_icon from "../../assets/img/library/camera_icon.svg";
import Library_myplaylist from "../../components/Library/Library_myplaylist";
import Musicplay from "../../components/Home/Musicplay";
import {
  createPlaylist,
  fetchMyPlaylists,
  getPlaylistCoverUploadUrl,
  uploadFileToSignedUrl,
  setPlaylistCoverPath,
  pickPlaylistId,
  deletePlaylist,
  updatePlaylistTitle,
} from "../../api/playlists";

const ALLOWED_EXT = ["jpg", "jpeg", "png", "webp"];
const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp"];
const mimeToExt = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const genId = () => {
  try {
    return crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;
  } catch {
    return `${Date.now()}-${Math.random()}`;
  }
};

// 업로드용 안전 파일명 생성(공백/특수문자 제거)
const makeSafeCoverName = (playlistId, file) => {
  const ext = mimeToExt[file?.type] || "png";
  return `cover_${String(playlistId).replace(/[^a-zA-Z0-9_-]/g, "")}.${ext}`;
};

const Library = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isLikedPage = location.pathname === "/library/liked";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const fileRef = useRef(null);

  const [playlists, setPlaylists] = useState([]);
  const handleDeletePlaylist = async (playlistId) => {
    const prevPlaylists = playlists;

    setPlaylists((prev) => prev.filter((p) => p.id !== playlistId));

    try {
      await deletePlaylist(playlistId);
      console.log("[Playlists] delete success:", playlistId);

    } catch (err) {
      console.error("[Playlists] delete failed:", err);

      setPlaylists(prevPlaylists);
      alert(err?.message || "플레이리스트 삭제에 실패했어.");
    }
  };
  const [modalMode, setModalMode] = useState("create"); // "create" | "edit"
  const [editingId, setEditingId] = useState(null);
  const loadPlaylists = async () => {
    try {
      console.log("[Playlists] loadPlaylists: GET /api/playlists");
      const data = await fetchMyPlaylists();
      const items = Array.isArray(data)
        ? data
        : data?.playlists || data?.items || [];

      console.log("[Playlists] loadPlaylists response:", data);

      setPlaylists(
        items.map((p) => ({
          id: p.id ?? p.playlist_id ?? p.playlistId ?? genId(),
          title: p.title ?? p.name ?? "Untitled",
          coverUrl: p.cover_url ?? p.coverUrl ?? p.imageUrl ?? null,
        }))
      );
    } catch (err) {
      console.error("[Playlists] fetchMyPlaylists failed:", err);
    }
  };
  const openCreateModal = () => {
    if (isLikedPage) return;
    setModalMode("create");
    setEditingId(null);
    setIsModalOpen(true);
    setPlaylistName("");
    setImagePreview("");
    if (fileRef.current) fileRef.current.value = "";
  };
  const openEditModal = (pl) => {
    if (isLikedPage) return;
    setModalMode("edit");
    setEditingId(pl.id);
    setIsModalOpen(true);

    setPlaylistName(pl.title || "");

    setImagePreview("");
    if (fileRef.current) fileRef.current.value = "";
  };

  useEffect(() => {
    if (isLikedPage) return;
    loadPlaylists();
  }, [isLikedPage]);

  const openModal = () => {
    if (isLikedPage) return;
    setIsModalOpen(true);
    setPlaylistName("");
    setImagePreview("");
    if (fileRef.current) fileRef.current.value = "";
    console.log("[Playlists] openModal");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    console.log("[Playlists] closeModal");
  };

  const onPickImage = () => {
    console.log("[Playlists] onPickImage click");
    fileRef.current?.click();
  };

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const name = (file.name || "").toLowerCase();
    const ext = name.includes(".") ? name.split(".").pop() : "";
    const ok =
      (ext && ALLOWED_EXT.includes(ext)) ||
      ALLOWED_MIME.includes(file.type);

    console.log("[Playlists] selected file:", {
      name: file.name,
      type: file.type,
      size: file.size,
      ext,
      ok,
    });

    if (!ok) {
      alert("이미지는 jpg/jpeg/png/webp만 가능해. (heic 등은 안 돼)");
      e.target.value = "";
      setImagePreview("");
      return;
    }

    const url = URL.createObjectURL(file);
    setImagePreview(url);
  };

  const onSave = async () => {
    if (!playlistName.trim()) {
      alert("플레이리스트 이름을 입력해줘.");
      return;
    }

    const title = playlistName.trim();

    try {
      if (modalMode === "edit") {
        if (!editingId) throw new Error("editingId가 없어. 수정할 플레이리스트를 찾지 못했어.");

        await updatePlaylistTitle({ playlistId: editingId, title });
        console.log("[Playlists] update title success:", { editingId, title });

        setPlaylists((prev) =>
          prev.map((p) => (p.id === editingId ? { ...p, title } : p))
        );

        closeModal();
        return;
      }

      const created = await createPlaylist({ title });
      console.log("[Playlists] createPlaylist response:", created);

      const playlistId = pickPlaylistId(created);
      console.log("[Playlists] extracted playlistId:", playlistId);

      if (!playlistId) {
        throw new Error(
          "createPlaylist 응답에서 playlistId를 찾지 못했어. (created.playlist.id / playlist_id / playlistId 중 하나가 필요해)"
        );
      }

      const file = fileRef.current?.files?.[0];
      if (file) {
        const safeName = makeSafeCoverName(playlistId, file);

        const { signed_url, storage_path } = await getPlaylistCoverUploadUrl({
          playlistId,
          filename: safeName,
          contentType: file.type,
        });

        await uploadFileToSignedUrl({ signedUrl: signed_url, file });
        await setPlaylistCoverPath({ playlistId, coverPath: storage_path });
      }

      await loadPlaylists();
      closeModal();
    } catch (err) {
      console.error("[Playlists] onSave failed ❌", err);
      alert(err?.message || "플레이리스트 저장에 실패했어.");
    }
  };

  return (
    <div className="library_wrap">
      <div className="container">
        <Header />

        <div className="scroll_container">
          <div className="category">
            <div className="lb_left_btns">
              <button
                className="playlist"
                type="button"
                onClick={() => navigate("/library")}
              >
                <p>Playlist</p>
              </button>

              <button
                className="liked"
                type="button"
                onClick={() => navigate("/library/liked")}
              >
                <p>Liked Songs</p>
              </button>
            </div>

            {!isLikedPage && (
              <div className="lb_right_btn">
                <button className="plus_btn" type="button" onClick={openCreateModal}
                  aria-label="플레이리스트 추가"
                >
                  <img src={plus_btn} alt="" />
                </button>
              </div>
            )}
          </div>

          {!isLikedPage &&
            playlists.map((pl) => (
              <Library_myplaylist
                key={pl.id}
                id={pl.id}
                title={pl.title}
                coverUrl={pl.coverUrl}
                onClick={() =>
                  navigate(`/library/playlist?id=${pl.id}`, {
                    state: { id: pl.id, title: pl.title, coverUrl: pl.coverUrl },
                  })
                }
                onEdit={() => openEditModal(pl)}
                onDelete={() => handleDeletePlaylist(pl.id)}
              />
            ))}

        </div>
      </div>

      <Nav />

      {!isLikedPage && isModalOpen && (
        <div
          className="pl_modal_overlay"
          onClick={closeModal}
          role="presentation"
        >
          <div
            className="pl_modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="플레이리스트 추가"
          >
            <div className="pl_modal_top">
              <button
                type="button"
                className="pl_modal_btn cancel"
                onClick={closeModal}
              >
                취소
              </button>
              <button
                type="button"
                className="pl_modal_btn save"
                onClick={onSave}
              >
                저장
              </button>
            </div>

            <div className="pl_modal_body">
              <div
                className="pl_cover"
                onClick={onPickImage}
                role="button"
                tabIndex={0}
              >
                {imagePreview ? (
                  <img
                    className="pl_cover_preview"
                    src={imagePreview}
                    alt="선택한 이미지 미리보기"
                  />
                ) : (
                  <div className="pl_cover_inner">
                    <img className="pl_camera_icon" src={camera_icon} alt="" />
                  </div>
                )}
              </div>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={onFileChange}
                className="pl_file_input"
              />

              <div className="pl_name">
                <input
                  value={playlistName}
                  onChange={(e) => setPlaylistName(e.target.value)}
                  placeholder="Myplaylist"
                  className="pl_name_input"
                />
                <div className="pl_name_underline" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Library;