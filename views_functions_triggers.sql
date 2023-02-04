-- Procedures and Functions

-- Devuelve la informacion de un trabajador dada su ID
CREATE OR REPLACE FUNCTION worker_infoXjid(wid INT)
RETURNS TABLE(user_id INT,
			  password VARCHAR,
			  avg_rating NUMERIC,
			  available BOOLEAN)
AS $BODY$
BEGIN
	RETURN QUERY
    SELECT *
	FROM mande_api_worker AS w
	WHERE w.user_id = wid;
END
$BODY$
  LANGUAGE 'plpgsql' SECURITY INVOKER
;
-- SELECT * FROM worker_infoXjid(1)

-- Devuelve la cantidad de servicios ofrecidos en la app
CREATE OR REPLACE FUNCTION total_services()
RETURNS INTEGER
AS $BODY$
DECLARE
	total INTEGER;
BEGIN
    SELECT COUNT(*) INTO total
	FROM mande_api_services
END
$BODY$
  LANGUAGE 'plpgsql' SECURITY INVOKER
;
-- SELECT total_services()

-- Devuelve el tipo de usuario de acuerdo a un ID dado
CREATE OR REPLACE FUNCTION user_typexuid(u_id INT)
RETURNS VARCHAR AS 
$BODY$
DECLARE
	typeOfUser VARCHAR;
BEGIN
    SELECT u.type INTO typeOfUser
	FROM mande_api_user AS u
	WHERE u.uid = u_id;
	RETURN typeOfUser;
END
$BODY$
  LANGUAGE 'plpgsql' SECURITY INVOKER
;
-- SELECT user_typexuid(1)

-- Devuelve el total que un usuario ha pagado por servicios
CREATE OR REPLACE FUNCTION total_amount_user(uid int)
RETURNS INTEGER
AS $BODY$
DECLARE
	total_amount NUMERIC;
BEGIN
    SELECT SUM(h.amount) INTO total_amount
	FROM mande_api_history AS h
	WHERE h.client_id_id = uid;
	RETURN total;
	
END
$BODY$
  LANGUAGE 'plpgsql' SECURITY INVOKER
;
-- SELECT total_amount_user(1)

-- Views

CREATE VIEW view_cleanuser AS
SELECT uid, f_name, l_name, birth_dt, type, last_login
FROM mande_api_user;

-- Vista que muestra a los usuarios junto con su ubicación GPS
CREATE VIEW view_userlocation AS
SELECT u.f_name, u.l_name, l.latitude, l.longitude
FROM  mande_api_user AS u 
JOIN mande_api_gps_location AS l ON u.uid = l.uid_id;

-- Vista que muestra a los trabajadores junto con su información relevante
CREATE VIEW view_workerinfo AS
SELECT u.f_name, u.l_name, j.occupation, wj.price, w.avg_rating, w.available
FROM mande_api_user AS u 
JOIN mande_api_worker AS w ON u.uid = w.user_id
JOIN mande_api_worker_job  AS wj ON w.user_id = wj.worker_id_id
JOIN mande_api_job AS j ON wj.jid_id = j.jid;

-- Trigger Functions

CREATE OR REPLACE FUNCTION user_insertion()
RETURNS TRIGGER AS
$BODY$
BEGIN
	RAISE NOTICE 'User successfully added';
	RETURN NEW;
END
$BODY$
LANGUAGE plpgsql SECURITY INVOKER;

CREATE TRIGGER success_user_insertion
AFTER INSERT ON mande_api_user
FOR EACH ROW EXECUTE FUNCTION user_insertion();

CREATE OR REPLACE FUNCTION user_deletion()
RETURNS TRIGGER AS
$BODY$
BEGIN
	RAISE NOTICE 'User successfully deleted';
	RETURN OLD;
END
$BODY$
LANGUAGE plpgsql SECURITY INVOKER;

CREATE TRIGGER success_user_deletion
AFTER DELETE ON mande_api_user
FOR EACH ROW EXECUTE FUNCTION user_deletion();