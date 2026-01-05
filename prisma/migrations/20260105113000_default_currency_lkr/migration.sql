-- Change default currency for project expenses to LKR
ALTER TABLE `ProjectExpense`
  ALTER COLUMN `currency` SET DEFAULT 'LKR';

-- Optional: migrate existing rows to LKR if they were created as USD defaults
UPDATE `ProjectExpense`
  SET `currency` = 'LKR'
  WHERE `currency` = 'USD';

