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
}) {
  const { data, error } = await supabase
    .from("user_games")
    .insert([{ user_id, status, hours_played, date_finished, game_id }])
    .select();
  return { data, error };
}
