INSERT INTO expenses (amount, category, date, description)
SELECT
    (random() * 500)::numeric(10,2),
    (ARRAY['food', 'travel', 'shopping', 'bills', 'entertainment'])[floor(random()*5 + 1)],
    DATE '2025-01-01' + (random() * 365)::int,
    'sample expense'
FROM generate_series(1, 50000);