-- Games a player marked "Not for me" on the For You page. They never come up
-- in that player's picks again, on any device.
create table if not exists public.dismissed_games (
  user_id uuid not null references auth.users (id) on delete cascade,
  game_id bigint not null,
  created_at timestamptz not null default now(),
  primary key (user_id, game_id)
);

alter table public.dismissed_games enable row level security;

drop policy if exists "Players read their dismissed games" on public.dismissed_games;
create policy "Players read their dismissed games"
  on public.dismissed_games for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Players dismiss games" on public.dismissed_games;
create policy "Players dismiss games"
  on public.dismissed_games for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Players undo dismissals" on public.dismissed_games;
create policy "Players undo dismissals"
  on public.dismissed_games for delete
  to authenticated
  using ((select auth.uid()) = user_id);
