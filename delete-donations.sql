-- Delete $5000 donation from Youneed Toremoveme
DELETE FROM donations
WHERE id IN (
  SELECT d.id
  FROM donations d
  JOIN donors don ON d.donor_id = don.id
  WHERE (don.first_name ILIKE '%youneed%' OR don.last_name ILIKE '%toremoveme%')
  AND d.amount = 5000
);

-- Delete pending donations from Chris Boyd
DELETE FROM donations
WHERE id IN (
  SELECT d.id
  FROM donations d
  JOIN donors don ON d.donor_id = don.id
  WHERE don.email ILIKE '%chris@walkforhope.com%'
  AND d.status = 'pending'
);

-- Delete pending donations from Larisa Karikh
DELETE FROM donations
WHERE id IN (
  SELECT d.id
  FROM donations d
  JOIN donors don ON d.donor_id = don.id
  WHERE don.first_name ILIKE '%larisa%'
  AND d.status = 'pending'
);

-- Verify deletions
SELECT
  d.id,
  d.amount,
  d.status,
  don.first_name,
  don.last_name
FROM donations d
LEFT JOIN donors don ON d.donor_id = don.id
WHERE
  (don.first_name ILIKE '%youneed%' OR don.last_name ILIKE '%toremoveme%')
  OR (don.email ILIKE '%chris@walkforhope.com%' AND d.status = 'pending')
  OR (don.first_name ILIKE '%larisa%' AND d.status = 'pending');
