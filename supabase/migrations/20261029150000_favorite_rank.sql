-- The order of a player's favorites, 1 first. Set by dragging on the Account
-- page; a new favorite goes to the end and an unhearted game drops its rank.
alter table public.user_games
  add column if not exists favorite_rank smallint;

-- Existing favorites keep the order they showed in: most played first
update public.user_games ug
   set favorite_rank = ranked.rank
  from (
    select id,
           row_number() over (
             partition by user_id
             order by coalesce(hours_played, 0) desc
           ) as rank
      from public.user_games
     where is_favorite
  ) ranked
 where ug.id = ranked.id
   and ug.favorite_rank is null;

create or replace function public.enforce_favorites_cap()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if not new.is_favorite then
    new.favorite_rank := null;
  elsif tg_op = 'INSERT' or not old.is_favorite then
    if (select count(*)
          from public.user_games ug
         where ug.user_id = new.user_id
           and ug.is_favorite
           and ug.game_id <> new.game_id) >= 5 then
      raise exception 'You can have at most 5 favorite games'
        using errcode = 'check_violation';
    end if;
    if new.favorite_rank is null then
      select coalesce(max(ug.favorite_rank), 0) + 1
        into new.favorite_rank
        from public.user_games ug
       where ug.user_id = new.user_id
         and ug.is_favorite
         and ug.game_id <> new.game_id;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists enforce_favorites_cap on public.user_games;
create trigger enforce_favorites_cap
  before insert or update of is_favorite, favorite_rank on public.user_games
  for each row execute function public.enforce_favorites_cap();
