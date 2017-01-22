import AllItems from './item/AllItems';
import DatabaseService from '../database/DatabaseService';
import CharacterClass from './creature/player/CharacterClass';
import CharacterClasses from './creature/player/CharacterClasses';
import PlayerCharacter from './creature/player/PlayerCharacter';
import CreatureEquipment from './item/CreatureEquipment';
import AttributeSet from './creature/AttributeSet';
const winston = require('winston');

interface IPlayerRegisterBag{
    uid:string,//has to be because bigint
    discriminator:number;
    username:string;
    class:CharacterClass;
}

export default class Game{
    items:AllItems;
    db:DatabaseService;
    cachedPlayers:Map<string,string>;

    constructor(db:DatabaseService){
        this.db = db;
        this.cachedPlayers = new Map();

        this.items = new AllItems();
    }

    registerPlayerCharacter(playerBag:IPlayerRegisterBag){
        const queryStr = `
            INSERT INTO player (
                    uid,
                    discriminator,
                    username,
                    class,
                    attribute_strength,
                    attribute_agility,
                    attribute_vitality,
                    attribute_endurance,
                    attribute_spirit,
                    attribute_luck
                )
                VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10);
        `;

        const queryValues:Array<any> = [
            playerBag.uid,
            playerBag.discriminator,
            playerBag.username,
            playerBag.class.id,
            playerBag.class.startingAttributes.Strength,
            playerBag.class.startingAttributes.Agility,
            playerBag.class.startingAttributes.Vitality,
            playerBag.class.startingAttributes.Endurance,
            playerBag.class.startingAttributes.Spirit,
            playerBag.class.startingAttributes.Luck            
        ];

        return new Promise((resolve,reject)=>{
            const cachedPlayer = this.cachedPlayers.get(playerBag.uid);
            
            if(cachedPlayer){
                resolve(cachedPlayer);

                return;
            }

            try{
                const con = this.db.getClient();

                con.query(queryStr, queryValues, insertResult.bind(this));

                function insertResult(error, result) {
                    if(error){
                        winston.error([playerBag,error]);

                        //Unique constraint violation - uid exists already
                        if(error.code == 23505){
                            reject('Character has already been registered');
                        }
                        else{
                            reject(error);
                        }

                        return;
                    }
                    
                    if(result.rowCount != 1){
                        winston.error(['An unknown error occured while inserting into player table',playerBag,result]);

                        reject('An unknown error occurred');
                    }
                    else{
                        this.getPlayerCharacter(playerBag.uid)
                        .then(function(pc){
                            resolve(pc);
                        })
                        .catch(function(ex){
                            reject(ex);//not this method's problem
                        });
                    }
                }
            }
            catch(ex){
                winston.error(ex);

                reject(ex);
            }
        });
    }

    getPlayerCharacter(uid:string){
        return new Promise((resolve,reject)=>{
            try{
                const con = this.db.getClient();

                con.query('SELECT * FROM player WHERE uid=$1 LIMIT 1', [uid], insertResult.bind(this));

                function insertResult(error, result) {
                    if(error){
                        winston.error([uid,error]);

                        reject(error);

                        return;
                    }

                    const row = result.rows[0];

                    if(!row){
                        //not found
                        resolve();

                        return;
                    }

                    const pc = new PlayerCharacter({
                        id: row.id,
                        uid: uid,
                        discriminator: row.discriminator,
                        description: row.description,
                        title: row.username,
                        experience: row.experience,
                        gold: row.gold,
                        class: CharacterClasses.get(row.class),
                        attributes: new AttributeSet(
                            row.attribute_strength,
                            row.attribute_agility,
                            row.attribute_vitality,
                            row.attribute_endurance,
                            row.attribute_spirit,
                            row.attribute_luck
                        ),
                        equipment: new CreatureEquipment({
                                hat: this.items.get(row.equipment_hat),
                              armor: this.items.get(row.equipment_armor),
                             amulet: this.items.get(row.equipment_amulet),
                            earring: this.items.get(row.equipment_earring),
                               ring: this.items.get(row.equipment_ring),
                            primaryWeapon: this.items.get(row.equipment_weapon),
                            offhandWeapon: this.items.get(row.equipment_offhand),
                        }),
                    });

                    this.cachedPlayers.set(pc.uid,pc);

                    resolve(pc);
                }
            }
            catch(ex){
                winston.error(ex);

                reject(ex);
            }
        });
    }
}