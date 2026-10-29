-- Favorites are a five-game showcase. Block a sixth heart at the database so
-- every client keeps the cap. Rows hearted before the cap stay as they are.
create or replace function public.enforce_favorites_cap()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.is_favorite
     and (tg_op = 'INSERT' or not old.is_favorite) then
    if (select count(*)
          from public.user_games ug
         where ug.user_id = new.user_id
           and ug.is_favorite
           and ug.game_id <> new.game_id) >= 5 then
      raise exception 'You can have at most 5 favorite games'
        using errcode = 'check_violation';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists enforce_favorites_cap on public.user_games;
create trigger enforce_favorites_cap
  before insert or update of is_favorite on public.user_games
  for each row execute function public.enforce_favorites_cap();
