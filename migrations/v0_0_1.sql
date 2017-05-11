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
CREATE TABLE apikeys
(
    id TEXT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);
CREATE UNIQUE INDEX apikeys_id_uindex ON apikeys (id);
CREATE INDEX apikeys_name_index ON apikeys (name);

CREATE TRIGGER trigger_apikeys_genid BEFORE INSERT ON apikeys FOR EACH ROW EXECUTE PROCEDURE unique_short_id();

INSERT INTO apikeys (name) VALUES ('DebtPanel');


-- Numbers table
CREATE TABLE numbers
(
    id TEXT PRIMARY KEY,
    apikey_id TEXT DEFAULT NULL,
    number VARCHAR(15) NOT NULL,
    CONSTRAINT numbers_apikey_id_fk FOREIGN KEY (apikey_id) REFERENCES apikeys (id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX numbers_id_uindex ON numbers (id);
CREATE INDEX numbers_number_index ON numbers (number);
CREATE INDEX numbers_apikey_id_index ON numbers (apikey_id);

CREATE TRIGGER trigger_numbers_genid BEFORE INSERT ON numbers FOR EACH ROW EXECUTE PROCEDURE unique_short_id();


-- Conversation table
CREATE TABLE conversations
(
    id TEXT PRIMARY KEY,
    type VARCHAR(15) NOT NULL,
    outbound_number VARCHAR(255) NOT NULL,
    inbound_number VARCHAR(255) NOT NULL,
    subject TEXT,
    content TEXT NOT NULL,
    message_count int DEFAULT 0 NOT NULL,
    created_at TIMESTAMP(0) DEFAULT NOW() NULL
);
CREATE UNIQUE INDEX conversations_id_uindex ON conversations (id);
CREATE INDEX conversations_outbound_number_index ON conversations (outbound_number);
CREATE INDEX conversations_inbound_number_index ON conversations (inbound_number);
CREATE INDEX conversations_type_index ON conversations (type);

CREATE TRIGGER trigger_conversations_genid BEFORE INSERT ON conversations FOR EACH ROW EXECUTE PROCEDURE unique_short_id();

