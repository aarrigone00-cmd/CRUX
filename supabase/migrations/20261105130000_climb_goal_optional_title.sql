-- Goal titles are optional: when empty, the app shows "Send <grade>" in the user's current grade system.
alter table public.climb_goals drop constraint climb_goals_title_check;
alter table public.climb_goals alter column title set default '';
alter table public.climb_goals add constraint climb_goals_title_check check (char_length(title) <= 80);
