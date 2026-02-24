import { api } from "./client";

export const aiSearch = ({ query, k = 5, seed_track_id = null }) =>
  api.post("/api/ai/search", { query, k, seed_track_id }).then((res) => res.data);