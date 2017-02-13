-- Table: public.player_equipment_item

-- DROP TABLE public.player_equipment_item;

CREATE TABLE public.player_equipment_item
(
    player_uid bigint NOT NULL,
    slot smallint NOT NULL,
    item_id integer NOT NULL,
    CONSTRAINT player_equipment_pkey PRIMARY KEY (player_uid, slot),
    CONSTRAINT player_equipment_player_uid_fkey FOREIGN KEY (player_uid)
        REFERENCES public.player (uid) MATCH SIMPLE
        ON UPDATE RESTRICT
        ON DELETE RESTRICT
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.player_equipment_item
    OWNER to discordant;