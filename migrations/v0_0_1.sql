CREATE EXTENSION IF NOT EXISTS "pgcrypto";
create schema smshub;


CREATE OR REPLACE FUNCTION unique_short_id()
RETURNS TRIGGER AS $$
DECLARE
  key TEXT;
  qry TEXT;
  found TEXT;
BEGIN
  qry := 'SELECT id FROM ' || quote_ident(TG_TABLE_NAME) || ' WHERE id=';
  LOOP
    key := encode(gen_random_bytes(12), 'hex');
    key := replace(key, '/', '_');
    key := replace(key, '+', '-');
    EXECUTE qry || quote_literal(key) INTO found;
    IF found IS NULL THEN
      EXIT;
    END IF;
  END LOOP;
  NEW.id = key;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- API Key table
CREATE TABLE smshub.apikeys
(
    id TEXT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);
CREATE UNIQUE INDEX apikeys_id_uindex ON smshub.apikeys (id);
CREATE INDEX apikeys_name_index ON smshub.apikeys (name);

CREATE TRIGGER trigger_apikeys_genid BEFORE INSERT ON smshub.apikeys FOR EACH ROW EXECUTE PROCEDURE unique_short_id();

INSERT INTO smshub.apikeys (name) VALUES ('DebtPanel');


-- Numbers table
CREATE TABLE smshub.numbers
(
    id TEXT PRIMARY KEY,
    apikey_id TEXT DEFAULT NULL,
    number VARCHAR(15) NOT NULL,
    CONSTRAINT numbers_apikey_id_fk FOREIGN KEY (apikey_id) REFERENCES apikeys (id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX numbers_id_uindex ON smshub.numbers (id);
CREATE INDEX numbers_number_index ON smshub.numbers (number);
CREATE INDEX numbers_apikey_id_index ON smshub.numbers (apikey_id);

CREATE TRIGGER trigger_numbers_genid BEFORE INSERT ON smshub.numbers FOR EACH ROW EXECUTE PROCEDURE unique_short_id();


-- Conversation table
CREATE TABLE smshub.conversations
(
    id TEXT PRIMARY KEY,
    outbound_number VARCHAR(15) NOT NULL,
    inbound_number VARCHAR(15) NOT NULL,
    content TEXT NOT NULL,
    message_count int DEFAULT 0 NOT NULL
);
CREATE UNIQUE INDEX conversations_id_uindex ON smshub.conversations (id);
CREATE INDEX conversations_outbound_number_index ON smshub.conversations (outbound_number);
CREATE INDEX conversations_inbound_number_index ON smshub.conversations (inbound_number);

CREATE TRIGGER trigger_conversations_genid BEFORE INSERT ON smshub.conversations FOR EACH ROW EXECUTE PROCEDURE unique_short_id();

