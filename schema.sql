-- Tables for AdhyayX

-- 1. tests table
create table if not exists tests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  stream text,
  category text,
  duration_minutes integer not null default 60,
  total_questions integer not null default 0,
  created_at timestamp with time zone default now()
);

-- 2. questions table
create table if not exists questions (
  id uuid primary key default gen_random_uuid(),
  test_id uuid references tests(id) on delete cascade,
  question_text text,
  image text,
  options jsonb not null, -- Array of strings
  correct text not null,
  marks integer not null default 4,
  negative_marks integer not null default 1,
  subject text,
  explanation text,
  created_at timestamp with time zone default now()
);

-- 3. test_results table
create table if not exists test_results (
  id uuid primary key default gen_random_uuid(),
  test_id uuid references tests(id),
  user_id uuid references auth.users(id),
  score float not null,
  total_marks integer not null,
  answers jsonb not null, -- Array of user answers
  accuracy float,
  time_taken_seconds integer,
  completed_at timestamp with time zone default now()
);

-- Enable RLS
alter table tests enable row level security;
alter table questions enable row level security;
alter table test_results enable row level security;

-- Policies
create policy "Tests are viewable by everyone" on tests for select using (true);
create policy "Questions are viewable by everyone" on questions for select using (true);
create policy "Users can view their own results" on test_results for select using (auth.uid() = user_id);
create policy "Users can insert their own results" on test_results for insert with check (auth.uid() = user_id);
