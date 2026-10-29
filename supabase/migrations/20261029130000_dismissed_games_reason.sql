-- Why a player said "Not for me": 'old' teaches For You a soft cutoff year,
-- 'style' pushes down games with the same tags, and null (or 'this') only
-- hides the one game.
alter table public.dismissed_games
  add column if not exists reason text
  check (reason in ('old', 'style', 'this'));

drop policy if exists "Players explain dismissals" on public.dismissed_games;
create policy "Players explain dismissals"
  on public.dismissed_games for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
