import { createClient } from "@supabase/supabase-js";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

export async function signUp({ email, password, ...userData }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: userData },
  });
  return { data, error };
}

export async function logIn({ email, password }) {
  let { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
}

export async function addUserGame({
  user_id,
  status,
  hours_played,
  game_id,
  review,
  rating,
  is_favorite,
}) {
  await insertGame({
    game_id,
  });
  const { data, error } = await supabase
    .from("user_games")
    .insert([
      {
        user_id,
        status,
        hours_played,
        game_id,
        // The column is NOT NULL; quick status adds pass no favorite
        is_favorite: Boolean(is_favorite),
      },
    ])
    .select();
  if (error) return { data: null, error };
  await addReview({ user_id, game_id, review, rating });
  return { data, error };
}

export async function updateUserGame({ game_id, user_id, ...formData }) {
  const updateData = {};

  if (formData.status !== undefined) updateData.status = formData.status;
  if (formData.hours_played !== undefined)
    updateData.hours_played = formData.hours_played;
  if (formData.is_favorite !== undefined)
    updateData.is_favorite = formData.is_favorite;

  const { data, error } = await supabase
    .from("user_games")
    .update(updateData)
    .eq("game_id", game_id)
    .eq("user_id", user_id)
    .select();
  if (error) return { data: null, error };

  if (formData.review !== undefined || formData.rating !== undefined) {
    const { error: reviewError } = await updateReview({
      user_id,
      game_id,
      review: formData.review,
      rating: formData.rating,
    });
    if (reviewError) return { data: null, error: reviewError };
  }
  return { data, error };
}

// Returns what it deleted, so restoreUserGame can put it back for an Undo
export async function deleteUserGame({ game_id, user_id }) {
  const [{ data: userGames }, { data: reviews }] = await Promise.all([
    supabase
      .from("user_games")
      .select("*")
      .eq("game_id", game_id)
      .eq("user_id", user_id),
    supabase
      .from("game_reviews")
      .select("*")
      .eq("game_id", game_id)
      .eq("user_id", user_id),
  ]);
  const { error } = await supabase
    .from("user_games")
    .delete()
    .eq("game_id", game_id)
    .eq("user_id", user_id);
  if (error) return { error };
  await deleteReview({ user_id, game_id });
  return {
    error: null,
    removed: { userGame: userGames?.[0], review: reviews?.[0] },
  };
}

// Inserts the rows deleteUserGame returned; their ids are generated again
export async function restoreUserGame({ userGame, review }) {
  if (!userGame) return { error: new Error("Nothing to restore") };
  const { id: _id, ...row } = userGame;
  const { error } = await supabase.from("user_games").insert([row]);
  if (error || !review) return { error };
  const { id: _reviewId, ...reviewRow } = review;
  const { error: reviewError } = await supabase
    .from("game_reviews")
    .insert([reviewRow]);
  return { error: reviewError };
}

export async function getUserGame(user_id, game_id) {
  if (!user_id || !game_id) return { data: null, error: null };

  let { data, error } = await supabase
    .from("user_games")
    .select("*")
    .eq("user_id", user_id)
    .eq("game_id", game_id);
  return { data, error };
}

export async function getUserGames(user_id) {
  let { data: user_games, error } = await supabase
    .from("user_games")
    .select(
      `
  *,
  game:games(
    game_id,
    reviews:game_reviews(
      rating,
      review,
      user_id
    )
  )
`,
    )
    .eq("user_id", user_id)
    .eq("games.game_reviews.user_id", user_id)
    .eq("user_id", user_id);

  if (error) return { user_games: [], error };

  return { user_games, error };
}

export async function updateUser({ email, password, username }) {
  let dataToUpdate = {};
  if (email) dataToUpdate.email = email;
  if (password) dataToUpdate.password = password;
  if (username) dataToUpdate.username = username;

  const { data, error } = await supabase.auth.updateUser({
    email: dataToUpdate.email,
    password: dataToUpdate.password,
    data: { username: dataToUpdate.username },
  });

  return { data, error };
}

export async function logoutUser() {
  let { error } = await supabase.auth.signOut();
  return { error };
}

// Reviews
export async function addReview({ user_id, game_id, review, rating }) {
  if (!user_id || !game_id || !rating) return { data: null, error: null };
  const { data, error } = await supabase
    .from("game_reviews")
    .insert([
      {
        user_id,
        game_id,
        review,
        rating,
      },
    ])
    .select();
  return { data, error };
}

export async function deleteReview({ user_id, game_id }) {
  if (!user_id || !game_id) return { data: null, error: null };
  const { error } = await supabase
    .from("game_reviews")
    .delete()
    .eq("user_id", user_id)
    .eq("game_id", game_id);
  return { error };
}

export async function updateReview({ user_id, game_id, review, rating }) {
  if (!user_id || !game_id) return { data: null, error: null };
  // A review only exists with a rating, so clearing the rating removes it
  if (!rating) return deleteReview({ user_id, game_id });
  const { data, error } = await supabase
    .from("game_reviews")
    .update({ review, rating })
    .eq("user_id", user_id)
    .eq("game_id", game_id)
    .select();
  if (error || data?.length) return { data, error };
  // Games added from a quick status have no review row yet
  return addReview({ user_id, game_id, review, rating });
}

export async function getGameReviews({ game_id }) {
  if (!game_id) return { data: null, error: null };
  let { data, error } = await supabase
    .from("game_reviews")
    .select("*,user:profiles(*),stats:user_stats(games_count, reviews_count)")
    .eq("game_id", game_id);
  if (error || !data?.length) return { data, error };

  // Each reviewer's current hours and status for this game, shown beside the
  // hours they had when they wrote the review
  const { data: players } = await supabase
    .from("user_games")
    .select("user_id,hours_played,status")
    .eq("game_id", game_id)
    .in(
      "user_id",
      data.map((review) => review.user_id),
    );
  data = data.map((review) => ({
    ...review,
    play: players?.find((p) => p.user_id === review.user_id) ?? null,
  }));
  return { data, error };
}

export async function getUserGameReview({ user_id, game_id }) {
  if (!user_id || !game_id) return { data: null, error: null };

  let { data, error } = await supabase
    .from("game_reviews")
    .select("*")
    .eq("user_id", user_id)
    .eq("game_id", game_id);
  return { data, error };
}

// games
export async function insertGame({ game_id }) {
  const { data, error } = await supabase
    .from("games")
    .insert([
      {
        game_id,
      },
    ])
    .select();
  return { data, error };
}

// dismissed games ("Not for me" on For You)
export async function getDismissedGames(user_id) {
  const select = (columns) =>
    supabase
      .from("dismissed_games")
      .select(columns)
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });
  const result = await select("game_id, reason");
  // 42703: the reason column isn't migrated yet, so read the games alone
  if (result.error?.code === "42703") return select("game_id");
  return { data: result.data, error: result.error };
}

// "old", "style" or "this": why the player said "Not for me"
export async function setDismissReason({ user_id, game_id, reason }) {
  const { error } = await supabase
    .from("dismissed_games")
    .upsert({ user_id, game_id, reason }, { onConflict: "user_id,game_id" });
  return { error };
}

export async function addDismissedGames({ user_id, game_ids }) {
  const { error } = await supabase.from("dismissed_games").upsert(
    game_ids.map((game_id) => ({ user_id, game_id })),
    { onConflict: "user_id,game_id", ignoreDuplicates: true },
  );
  return { error };
}

export async function deleteDismissedGame({ user_id, game_id }) {
  const { error } = await supabase
    .from("dismissed_games")
    .delete()
    .eq("user_id", user_id)
    .eq("game_id", game_id);
  return { error };
}

// Reset For You: every dismissed game and what it taught
export async function deleteAllDismissedGames(user_id) {
  const { error } = await supabase
    .from("dismissed_games")
    .delete()
    .eq("user_id", user_id);
  return { error };
}

// Platforms the player owns (For You), kept on the account so they follow
// the player across devices
export async function saveMyPlatforms(platforms) {
  const { error } = await supabase.auth.updateUser({ data: { platforms } });
  return { error };
}

export async function getMyPlatforms() {
  const { data, error } = await supabase.auth.getUser();
  return { data: data?.user?.user_metadata?.platforms ?? null, error };
}
