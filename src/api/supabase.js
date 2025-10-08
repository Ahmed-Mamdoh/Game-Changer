import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://kapovyqqncfsoangqppi.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

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

export async function addGame({
  user_id,
  status,
  hours_played,
  date_finished,
  game_id,
  game_name,
  game_cover,
  genres,
  themes,
}) {
  const { data, error } = await supabase
    .from("user_games")
    .insert([
      {
        user_id,
        status,
        hours_played,
        date_finished,
        game_id,
        game_name,
        game_cover,
        genres,
        themes,
      },
    ])
    .select();
  return { data, error };
}

export async function updateUserGame({ game_id, user_id, ...formData }) {
  console.log(formData);
  const { data, error } = await supabase
    .from("user_games")
    .update(formData)
    .eq("game_id", game_id)
    .eq("user_id", user_id)
    .select();
  return { data, error };
}

export async function getUserGame(user_id, game_id) {
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
    .select("*")
    .eq("user_id", user_id);
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
