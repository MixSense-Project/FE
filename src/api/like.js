import { api } from "./client";

export const getMyLikedSongs = (profileId) =>
  api
    .get(`/user/mylist/${profileId}`, {
      headers: { "ngrok-skip-browser-warning": "true" },
    })
    .then((res) => res.data);

export const toggleLike = ({ profileId, contentId }) =>
  api
    .post(
      "/user/toggle_like",
      { profile_id: profileId, content_id: contentId },
      { headers: { "ngrok-skip-browser-warning": "true" } }
    )
    .then((res) => res.data);
