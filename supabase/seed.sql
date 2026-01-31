insert into public.bars (name, neighborhood, description)
values
  ('Bar High Five', 'Ginza', 'Classic Ginza bar with meticulous service and rare whisky.'),
  ('JBS', 'Shinjuku', 'Legendary vinyl listening bar with curated jazz collections.'),
  ('Benfiddich', 'Shinjuku', 'Intimate cocktail bar focused on seasonal Japanese botanicals.');

insert into public.posts (title, body, published_at)
values
  ('Welcome to The Nomikai Club', 'Discover Tokyo''s whisky salons and vinyl listening bars.', now()),
  ('Member Spotlight: Late-Night Jazz', 'A deep dive into Shinjuku''s vinyl culture.', now());
