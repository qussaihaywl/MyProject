SELECT TABLE_NAME, TABLE_ROWS 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = DATABASE()
ORDER BY TABLE_NAME;

-- Check users count
SELECT COUNT(*) as users_count FROM users;

-- Check categories count
SELECT COUNT(*) as categories_count FROM categories;

-- Check warehouses count
SELECT COUNT(*) as warehouses_count FROM warehouses;

-- Check products count
SELECT COUNT(*) as products_count FROM products;
