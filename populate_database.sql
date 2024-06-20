-- Drop existing tables
DROP TABLE IF EXISTS cursuri;
DROP TABLE IF EXISTS note;
DROP TABLE IF EXISTS note;
DROP TABLE IF EXISTS profesori;
DROP TABLE IF EXISTS didactic;
DROP TABLE IF EXISTS prieteni;

-- Create new tables
CREATE TABLE studenti (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nr_matricol VARCHAR(6) NOT NULL,
  nume VARCHAR(15) NOT NULL,
  prenume VARCHAR(30) NOT NULL,
  an INT,
  grupa CHAR(2),
  bursa DECIMAL(6,2),
  data_nastere DATE,
  email VARCHAR(40),
  created_at DATETIME,
  updated_at DATETIME
);

CREATE TABLE cursuri (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  titlu_curs VARCHAR(52) NOT NULL,
  an INT,
  semestru INT,
  credite INT,
  created_at DATETIME,
  updated_at DATETIME
);

CREATE TABLE note (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  id_student INT NOT NULL,
  id_curs INT NOT NULL,
  valoare INT,
  data_notare DATE,
  created_at DATETIME,
  updated_at DATETIME,
  FOREIGN KEY (id_student) REFERENCES studenti(id),
  FOREIGN KEY (id_curs) REFERENCES cursuri(id)
);

CREATE TABLE profesori (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nume VARCHAR(15) NOT NULL,
  prenume VARCHAR(30) NOT NULL,
  grad_didactic VARCHAR(20),
  created_at DATETIME,
  updated_at DATETIME
);

CREATE TABLE didactic (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  id_profesor INT NOT NULL,
  id_curs INT NOT NULL,
  created_at DATETIME,
  updated_at DATETIME,
  FOREIGN KEY (id_profesor) REFERENCES profesori(id),
  FOREIGN KEY (id_curs) REFERENCES cursuri(id)
);

CREATE TABLE prieteni (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  id_student1 INT NOT NULL, 
  id_student2 INT NOT NULL, 
  created_at DATETIME,
  updated_at DATETIME,  
  FOREIGN KEY (id_student1) REFERENCES studenti(id),
  FOREIGN KEY (id_student2) REFERENCES studenti(id),
  UNIQUE (id_student1, id_student2)
);

-- Temporary tables for lists
DROP TEMPORARY TABLE IF EXISTS TempNume;
CREATE TEMPORARY TABLE TempNume (nume VARCHAR(255));
INSERT INTO TempNume (nume) VALUES ('Ababei'),('Acasandrei'),('Adascalitei');

DROP TEMPORARY TABLE IF EXISTS TempPrenumeFete;
CREATE TEMPORARY TABLE TempPrenumeFete (prenume VARCHAR(255));
INSERT INTO TempPrenumeFete (prenume) VALUES ('Adina'),('Alexandra'),('Alina');

DROP TEMPORARY TABLE IF EXISTS TempPrenumeBaieti;
CREATE TEMPORARY TABLE TempPrenumeBaieti (prenume VARCHAR(255));
INSERT INTO TempPrenumeBaieti (prenume) VALUES ('Adrian'),('Alex'),('Alexandru');

DROP TEMPORARY TABLE IF EXISTS TempMateriiAn1;
CREATE TEMPORARY TABLE TempMateriiAn1 (materie VARCHAR(255));
INSERT INTO TempMateriiAn1 (materie) VALUES ('Logica'),('Matematica'),('Introducere în programare');

DROP TEMPORARY TABLE IF EXISTS TempMateriiAn2;
CREATE TEMPORARY TABLE TempMateriiAn2 (materie VARCHAR(255));
INSERT INTO TempMateriiAn2 (materie) VALUES ('Rețele de calculatoare'),('Baze de date'),('Limbaje formale, automate și compilatoare');

DROP TEMPORARY TABLE IF EXISTS TempMateriiAn3;
CREATE TEMPORARY TABLE TempMateriiAn3 (materie VARCHAR(255));
INSERT INTO TempMateriiAn3 (materie) VALUES ('Învățare automată'),('Securitatea informației'),('Inteligență artificială');

DROP TEMPORARY TABLE IF EXISTS TempGradeDidactice;
CREATE TEMPORARY TABLE TempGradeDidactice (grad_didactic VARCHAR(255));
INSERT INTO TempGradeDidactice (grad_didactic) VALUES ('Colaborator'),('Asistent'),('Lector'),('Conferentiar'),('Profesor');

-- Procedures to populate tables
DELIMITER $$

CREATE PROCEDURE PopulateStudenti()
BEGIN
    DECLARE i INT DEFAULT 0;
    DECLARE v_nume VARCHAR(255);
    DECLARE v_prenume VARCHAR(255);
    DECLARE v_matr VARCHAR(6);
    DECLARE v_email VARCHAR(40);

    DECLARE curs CURSOR FOR SELECT nume FROM TempNume;
    DECLARE prenume_cur CURSOR FOR SELECT prenume FROM TempPrenumeFete UNION SELECT prenume FROM TempPrenumeBaieti;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET i = i + 1;

    OPEN curs;
    OPEN prenume_cur;

    read_loop: LOOP
        FETCH curs INTO v_nume;
        FETCH prenume_cur INTO v_prenume;
        IF i >= 100 THEN
            LEAVE read_loop;
        END IF;
        
        SET v_matr = CONCAT(LPAD(FLOOR(RAND() * 100000), 5, '0'), CHAR(65 + FLOOR(RAND() * 26)));
        SET v_email = CONCAT(v_prenume, '.', v_nume, '@example.com');

        INSERT INTO studenti (nr_matricol, nume, prenume, an, grupa, bursa, data_nastere, email, created_at, updated_at)
        VALUES (v_matr, v_nume, v_prenume, FLOOR(RAND() * 4 + 1), CONCAT(CHAR(65 + FLOOR(RAND() * 26)), FLOOR(RAND() * 10)), ROUND(RAND() * 1000, 2), DATE_ADD('1990-01-01', INTERVAL FLOOR(RAND() * 3653) DAY), v_email, NOW(), NOW());
    END LOOP;

    CLOSE curs;
    CLOSE prenume_cur;
    SELECT 'Inserarea studentilor... GATA!' AS Message;
END$$

CREATE PROCEDURE PopulateCursuri()
BEGIN
    DECLARE j INT DEFAULT 0;
    DECLARE v_materie VARCHAR(255);

    DECLARE curs CURSOR FOR SELECT materie FROM TempMateriiAn1 UNION SELECT materie FROM TempMateriiAn2 UNION SELECT materie FROM TempMateriiAn3;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET j = j + 1;

    OPEN curs;

    read_loop: LOOP
        FETCH curs INTO v_materie;
        IF j >= 30 THEN
            LEAVE read_loop;
        END IF;

        INSERT INTO cursuri (titlu_curs, an, semestru, credite, created_at, updated_at)
        VALUES (v_materie, FLOOR(RAND() * 4 + 1), FLOOR(RAND() * 2 + 1), FLOOR(RAND() * 5 + 1), NOW(), NOW());
    END LOOP;

    CLOSE curs;
    SELECT 'Inserarea materiilor... GATA!' AS Message;
END$$

CREATE PROCEDURE PopulateProfesori()
BEGIN
    DECLARE k INT DEFAULT 0;
    DECLARE v_nume VARCHAR(255);
    DECLARE v_prenume VARCHAR(255);
    DECLARE v_grad VARCHAR(255);

    DECLARE curs CURSOR FOR SELECT nume FROM TempNume;
    DECLARE prenume_cur CURSOR FOR SELECT prenume FROM TempPrenumeFete UNION SELECT prenume FROM TempPrenumeBaieti;
    DECLARE grade_cur CURSOR FOR SELECT grad_didactic FROM TempGradeDidactice;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET k = k + 1;

    OPEN curs;
    OPEN prenume_cur;
    OPEN grade_cur;

    read_loop: LOOP
        FETCH curs INTO v_nume;
        FETCH prenume_cur INTO v_prenume;
        FETCH grade_cur INTO v_grad;
        IF k >= 20 THEN
            LEAVE read_loop;
        END IF;

        INSERT INTO profesori (nume, prenume, grad_didactic, created_at, updated_at)
        VALUES (v_nume, v_prenume, v_grad, NOW(), NOW());
    END LOOP;

    CLOSE curs;
    CLOSE prenume_cur;
    CLOSE grade_cur;
    SELECT 'Inserare profesori... GATA!' AS Message;
END$$

CREATE PROCEDURE PopulateDidactic()
BEGIN
    DECLARE l INT DEFAULT 0;
    DECLARE max_prof INT;
    DECLARE max_curs INT;
    SELECT MAX(id) INTO max_prof FROM profesori;
    SELECT MAX(id) INTO max_curs FROM cursuri;
    WHILE l < 24 DO
        INSERT INTO didactic (id_profesor, id_curs, created_at, updated_at)
        VALUES (FLOOR(RAND() * max_prof + 1), FLOOR(RAND() * max_curs + 1), NOW(), NOW());
        SET l = l + 1;
    END WHILE;
    SELECT 'Asocierea profesorilor cu cursurile... GATA!' AS Message;
END$$

CREATE PROCEDURE PopulateNote()
BEGIN
    DECLARE i INT DEFAULT 0;
    DECLARE j INT DEFAULT 0;
    DECLARE k INT DEFAULT 0;
    DECLARE student_id INT;
    DECLARE curs_id INT;
    DECLARE an INT;
    DECLARE valoare INT;
    DECLARE data_notare DATE;

    DECLARE curs_student CURSOR FOR SELECT id, an FROM studenti;
    DECLARE curs_curs CURSOR FOR SELECT id FROM cursuri;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET i = i + 1;

    OPEN curs_student;

    student_loop: LOOP
        FETCH curs_student INTO student_id, an;
        IF i >= 1025 THEN
            LEAVE student_loop;
        END IF;
        
        SET j = 0;
        OPEN curs_curs;

        curs_loop: LOOP
            FETCH curs_curs INTO curs_id;
            IF j >= 8 AND an = 1 THEN
                LEAVE curs_loop;
            END IF;
            IF j >= 16 AND an = 2 THEN
                LEAVE curs_loop;
            END IF;
            IF j >= 24 AND an = 3 THEN
                LEAVE curs_loop;
            END IF;

            SET valoare = FLOOR(RAND() * 7) + 4;
            SET data_notare = DATE_ADD(NOW(), INTERVAL -FLOOR(RAND() * 365 * an) DAY);

            INSERT INTO note (id_student, id_curs, valoare, data_notare, created_at, updated_at)
            VALUES (student_id, curs_id, valoare, data_notare, NOW(), NOW());

            SET j = j + 1;
        END LOOP;

        CLOSE curs_curs;
    END LOOP;

    CLOSE curs_student;
    SELECT 'Inserare note... GATA!' AS Message;
END$$

DELIMITER ;

-- Call procedures to populate tables
CALL PopulateStudenti();
CALL PopulateCursuri();
CALL PopulateProfesori();
CALL PopulateDidactic();
CALL PopulateNote();
