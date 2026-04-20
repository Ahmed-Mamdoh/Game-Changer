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
  date_finished,
  game_id,
  game_name,
  game_cover,
  genres,
  themes,
  review,
  rating,
}) {
  await insertGame({
    game_id,
    genres,
    themes,
    name: game_name,
    cover: game_cover,
  });
  const { data, error } = await supabase
    .from("user_games")
    .insert([
      {
        user_id,
        status,
        hours_played,
        date_finished,
        game_id,
      },
    ])
    .select();
  if (error) return { data: null, error };
  console.log(data);
  await addReview({ user_id, game_id, review, rating });
  return { data, error };
}

export async function updateUserGame({ game_id, user_id, ...formData }) {
  const { data, error } = await supabase
    .from("user_games")
    .update({
      status: formData.status,
      hours_played: formData.hours_played,
      date_finished: formData.date_finished,
    })
    .eq("game_id", game_id)
    .eq("user_id", user_id)
    .select();
  if (error) return { data: null, error };
  await updateReview({
    user_id,
    game_id,
    review: formData.review,
    rating: formData.rating,
  });
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
    .select(`*,game:games(*)`)
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
  console.log({ user_id, game_id, review, rating });
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
  console.log({ user_id, game_id, review, rating });
  if (!user_id || !game_id || !rating) return { data: null, error: null };
  const { data, error } = await supabase
    .from("game_reviews")
    .update({ review, rating })
    .eq("user_id", user_id)
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
export async function insertGame({ game_id, genres, themes, name, cover }) {
  const { data, error } = await supabase
    .from("games")
    .insert([{ game_id, genres, themes, name, cover }])
    .select();
  return { data, error };
}
