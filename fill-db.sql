
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

INSERT INTO articles(title, created_date, anounce, full_text, picture, user_id) VALUES
('Самый лучший музыкальный альбом этого года', '02.01.2021', 'Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Программировать не настолько сложно, как об этом говорят. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.', Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Ёлки — это не просто красивое дерево. Это прочная древесина. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Как начать действовать? Для начала просто соберитесь., 'item0NaN.jpg', 1);

ALTER TABLE articles ENABLE TRIGGER ALL;

ALTER TABLE article_categories DISABLE TRIGGER ALL;

INSERT INTO article_categories(article_id, category_id) VALUES
(1, -1);

ALTER TABLE article_categories ENABLE TRIGGER ALL;

ALTER TABLE comments DISABLE TRIGGER ALL;

INSERT INTO COMMENTS(text, user_id, article_id) VALUES
('Согласен с автором! Хочу такую же футболку :-) Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.', 1, 1);

ALTER TABLE comments ENABLE TRIGGER ALL;