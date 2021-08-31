
INSERT INTO users(email, password_hash, first_name, last_name, avatar) VALUES
('ivanov@example.com', '5f4dcc3b5aa765d61d8327deb882cf99', 'Иван', 'Иванов', 'avatar1.jpg'),
('petrov@example.com', '5f4dcc3b5aa765d61d8327deb882cf99', 'Пётр', 'Петров', 'avatar2.jpg');

INSERT INTO categories(name) VALUES
('Деревья'),
('За жизнь'),
('Без рамки'),
('Разное'),
('IT'),
('Музыка'),
('Кино'),
('Программирование'),
('Железо');

ALTER TABLE articles DISABLE TRIGGER ALL;

INSERT INTO articles(title, created_date, announce, full_text, picture, user_id) VALUES
('Учим HTML и CSS', '04.01.2021', 'Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Золотое сечение — соотношение двух величин, гармоническая пропорция. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.', 'Первая большая ёлка была установлена только в 1938 году. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Ёлки — это не просто красивое дерево. Это прочная древесина. Это один из лучших рок-музыкантов.', 'item0NaN.jpg', 2);

ALTER TABLE articles ENABLE TRIGGER ALL;

ALTER TABLE article_categories DISABLE TRIGGER ALL;

INSERT INTO article_categories(article_id, category_id) VALUES
(1, 4);

ALTER TABLE article_categories ENABLE TRIGGER ALL;

ALTER TABLE comments DISABLE TRIGGER ALL;

INSERT INTO COMMENTS(text, user_id, article_id) VALUES
('Хочу такую же футболку :-) Планируете записать видосик на эту тему?', 1, 1),
('Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Хочу такую же футболку :-)', 2, 1);

ALTER TABLE comments ENABLE TRIGGER ALL;