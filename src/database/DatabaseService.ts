import PlayerCharacter from '../game/creature/player/PlayerCharacter';
const pg = require('pg');
const winston = require('winston');

interface dbResult{
    error?:string;//A friendly error that can be handed to the user, logging handled by this class
    result?:any;//result rows
}

interface dbClientCallback{
    (error:any,result:any);
}

interface dbClient{
    query(query:string,params:Array<any>,callback:dbClientCallback):Function;
}

export default class DatabaseService{
    pool:any;

    constructor(dbConfig){
        this.pool = new pg.Pool(dbConfig);
    }

/* Usage:

    db.getPool().query('SELECT $1::text as name', ['brianc'], function (error, result) {
        if(error){
            //handle error
        }
        
        //use result
        //result.rows[0].name
    });
    
*/
    getPool():dbClient{
        return this.pool;
    }

    getPlayerCharacter(uid:string):dbResult{
        this.pool.query('SELECT * FROM player WHERE uid=$1 LIMIT 1', [uid], (error, result)=>{
            if(error){
                const did = new Date().getTime();

                winston.error({error:error,did:did,uid:uid});

                reject('A database error occurred did'+did);

                return;
            }

                    const row = result.rows[0];

                    if(!row){
                        //not found
                        resolve();

                        return;
                    }

                    const pcEquipment:EquipmentBag = {};

                    if(row.equipment){
                        if(row.equipment.amulet) pcEquipment.amulet = this.items.get(row.equipment.amulet.id) as ItemEquippable;
                        if(row.equipment.armor) pcEquipment.armor = this.items.get(row.equipment.armor.id) as ItemEquippable;
                        if(row.equipment.hat) pcEquipment.hat = this.items.get(row.equipment.hat.id) as ItemEquippable;
                        if(row.equipment.ring) pcEquipment.ring = this.items.get(row.equipment.ring.id) as ItemEquippable;
                        if(row.equipment.earring) pcEquipment.earring = this.items.get(row.equipment.earring.id) as ItemEquippable;
                        if(row.equipment.primaryWeapon) pcEquipment.primaryweapon = this.items.get(row.equipment.primaryWeapon.id) as Weapon;
                        if(row.equipment.offhandWeapon) pcEquipment.offhandweapon = this.items.get(row.equipment.offhandWeapon.id) as Weapon;
                    }

                    const pcInventory:PlayerInventory = new PlayerInventory();

                    if(row.inventory){
                        Object.keys(row.inventory).forEach((itemId)=>{
                            pcInventory.addItem(this.items.get(Number(itemId)),row.inventory[itemId].amount);
                        });
                    }
                    
                    const pc = new PlayerCharacter({
                        id: row.id,
                        uid: uid,
                        discriminator: row.discriminator,
                        description: row.description,
                        title: row.username,
                        xp: row.xp,
                        wishes: row.wishes,
                        class: CharacterClasses.get(row.class),
                        attributes: new AttributeSet(
                            row.attribute_strength,
                            row.attribute_agility,
                            row.attribute_vitality,
                            row.attribute_spirit,
                            row.attribute_luck
                        ),
                        equipment: new CreatureEquipment(pcEquipment),
                        inventory: pcInventory,
                        role: row.role,
                    });

                    this.cachedPlayers.set(pc.uid,pc);

                    resolve(pc);
                });
            }
            catch(ex){
                const did = new Date().getTime();

                winston.error({ex:ex,did:did});

                reject('A database error occurred did'+did);
            }
        });
    }
}