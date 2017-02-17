CREATE OR REPLACE FUNCTION equip_player_item(inPlayerUID bigint,inItemID int,inEquipSlot equipmentslot) 
RETURNS int LANGUAGE plpgsql AS
$$

DECLARE
  unequippedItemId int;
BEGIN
  SELECT item_id INTO unequippedItemId FROM player_equipment_item WHERE player_uid = inPlayerUID AND slot = inEquipSlot LIMIT 1;
  IF NOT FOUND THEN 
    unequippedItemId := -1;
  END IF;

  UPDATE player_equipment_item SET item_id = inItemID WHERE player_uid = inPlayerUID AND slot = inEquipSlot;
  IF NOT FOUND THEN 
    INSERT INTO player_equipment_item(player_uid,item_id,slot) values (inPlayerUID,inItemID,inEquipSlot); 
  END IF;

  RETURN unequippedItemId;
END

$$;