
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
    ('Рок — это протест', '03.01.2021', 'Программировать не настолько сложно, как об этом говорят. Как начать действовать? Для начала просто соберитесь. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Он написал больше 30 хитов.', 'Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Достичь успеха помогут ежедневные повторения. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.', 'item0NaN.jpg', 1);
    ALTER TABLE articles ENABLE TRIGGER ALL;
    ALTER TABLE article_categories DISABLE TRIGGER ALL;
    INSERT INTO article_categories(article_id, category_id) VALUES
    (1, 9);
    ALTER TABLE article_categories ENABLE TRIGGER ALL;
    ALTER TABLE comments DISABLE TRIGGER ALL;
    INSERT INTO COMMENTS(text, user_id, article_id) VALUES
    ('Согласен с автором! Мне кажется или я уже читал это где-то?', 1, 1),
('Хочу такую же футболку :-)', 1, 1);
    ALTER TABLE comments ENABLE TRIGGER ALL;