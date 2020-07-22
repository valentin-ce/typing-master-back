CREATE EXTENSION
IF NOT EXISTS pgcrypto;
CREATE EXTENSION
IF NOT EXISTS "uuid-ossp";

CREATE TABLE users
(
    userID UUID PRIMARY KEY,
    username varchar(25),
    email varchar(100) UNIQUE NOT NULL,
    emailVerified boolean,
    creationDate date,
    password varchar(64)
);

CREATE TABLE maps
(
    mapID UUID PRIMARY KEY,
    title varchar(25),
    coveredLetter varchar(100),
    gameMod varchar(25),
    difficulty varchar(25)
);

CREATE TABLE scores
(
    scoreID UUID PRIMARY KEY,
    userID UUID,
    mapID UUID,
    score int,
    wpm smallint,
    FOREIGN KEY (userID) REFERENCES users (userID),
    FOREIGN KEY (mapID) REFERENCES maps (mapID)
);

INSERT INTO users(
    userID, username, email, emailVerified, creationDate, PASSWORD
)
VALUES
(
    gen_random_uuid(), 'valence', 'valentin.cellier@gmail.com', false, '2020-01-01', crypt('password', gen_salt('md5'))
);