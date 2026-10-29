-- Freeze the reviewer's hours played when a review is written or edited,
-- so the game page can show "X h at review time" next to their current hours.
alter table public.game_reviews
  add column if not exists hours_at_review numeric;

create or replace function public.snapshot_review_hours()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'INSERT'
     or new.review is distinct from old.review
     or new.rating is distinct from old.rating then
    select ug.hours_played
      into new.hours_at_review
      from public.user_games ug
     where ug.user_id = new.user_id
       and ug.game_id = new.game_id;
  else
    -- Clients cannot overwrite the snapshot directly
    new.hours_at_review := old.hours_at_review;
  end if;
  return new;
end;
$$;

drop trigger if exists snapshot_review_hours on public.game_reviews;
create trigger snapshot_review_hours
  before insert or update on public.game_reviews
  for each row execute function public.snapshot_review_hours();
