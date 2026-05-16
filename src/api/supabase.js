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
  is_favorite = false,
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
        is_favorite,
      },
    ])
    .select();
  if (error) return { data: null, error };
  await addReview({ user_id, game_id, review, rating });
  return { data, error };
}

export async function updateUserGame({
  game_id,
  user_id,
  genres,
  themes,
  ...formData
}) {
  const updateData = {
    genres,
    themes,
  };

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
    await updateReview({
      user_id,
      game_id,
      review: formData.review,
      rating: formData.rating,
    });
  }
  return { data, error };
}

export async function deleteUserGame({ game_id, user_id }) {
  const { error } = await supabase
    .from("user_games")
    .delete()
    .eq("game_id", game_id)
    .eq("user_id", user_id);
  await deleteReview({ user_id, game_id });
  return { error };
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
  if (!user_id || !game_id || !rating) return { data: null, error: null };
  const { data, error } = await supabase
    .from("game_reviews")
    .update({ review, rating })
    .eq("user_id", user_id)
    .eq("game_id", game_id)
    .select();
  return { data, error };
}

export async function getGameReviews({ game_id }) {
  if (!game_id) return { data: null, error: null };
  let { data, error } = await supabase
    .from("game_reviews")
    .select("*,user:profiles(*),stats:user_stats(games_count, reviews_count)")
    .eq("game_id", game_id);

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
export async function insertGame({ game_id, name, cover, genres, themes }) {
  const { data, error } = await supabase
    .from("games")
    .insert([
      {
        game_id,
        name,
        cover,
        genres,
        themes,
      },
    ])
    .select();
  if (error) {
    const { data2, error2 } = await supabase
      .from("games")
      .update({
        name,
        cover,
        genres,
        themes,
      })
      .eq("game_id", game_id);
    if (error2) return { data: null, error2 };
    return { data2, error2 };
  }
  return { data, error };
}
