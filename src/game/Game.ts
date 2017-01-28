import AllItems from './item/AllItems';
import DatabaseService from '../database/DatabaseService';
import CharacterClass from './creature/player/CharacterClass';
import CharacterClasses from './creature/player/CharacterClasses';
import PlayerCharacter from './creature/player/PlayerCharacter';
import CreatureEquipment from './item/CreatureEquipment';
import Creature from './creature/Creature';
import CreatureAIControlled from './creature/CreatureAIControlled';
import AttributeSet from './creature/AttributeSet';
import CoopMonsterBattle from './battle/CoopMonsterBattle';
import { CoopMonsterBattleEvent, BattleEndEvent } from './battle/CoopMonsterBattle';
import { EquipmentBag } from './item/CreatureEquipment';
import PlayerInventory from './item/PlayerInventory';
import ItemEquippable from './item/ItemEquippable';
import Weapon from './item/Weapon';
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
    cachedPlayers:Map<string,PlayerCharacter>;
    battleCardinality:number;
    activeBattles:Map<number,CoopMonsterBattle>;

    constructor(db:DatabaseService){
        this.db = db;
        this.cachedPlayers = new Map();

        this.items = new AllItems();

        this.activeBattles = new Map();
        this.battleCardinality = 1;
    }

    registerPlayerCharacter(playerBag:IPlayerRegisterBag){
        return new Promise((resolve,reject)=>{
            const cachedPlayer = this.cachedPlayers.get(playerBag.uid);
            
            if(cachedPlayer){
                resolve(cachedPlayer);

                return;
            }

            try{
                const queryStr = `
                    INSERT INTO player (
                            uid,
                            discriminator,
                            username,
                            class,
                            attribute_strength,
                            attribute_agility,
                            attribute_vitality,
                            attribute_spirit,
                            attribute_luck,
                            inventory,
                            equipment,
                            role,
                        )
                        VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12);
                `;

                const pcInventory = {};//TODO: implement starting inventory for classes

                const pcEquipment = {};

                const startingEquipment = playerBag.class.startingEquipment.toDatabase();

                const queryValues:Array<any> = [
                    playerBag.uid,
                    playerBag.discriminator,
                    playerBag.username,
                    playerBag.class.id,
                    playerBag.class.startingAttributes.Strength,
                    playerBag.class.startingAttributes.Agility,
                    playerBag.class.startingAttributes.Vitality,
                    playerBag.class.startingAttributes.Spirit,
                    playerBag.class.startingAttributes.Luck,
                    pcInventory,
                    pcEquipment,
                    'player'
                ];
                
                const con = this.db.pool();

                con.query(queryStr, queryValues, insertResult.bind(this));

                function insertResult(error, result) {
                    if(error){
                        //Unique constraint violation - uid exists already
                        if(error.code == 23505){
                            reject('Character has already been registered');
                        }
                        else{
                            const did = new Date().getTime();

                            winston.error({error:error,did:did});

                            reject('A database error occurred did'+did);
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
                const did = new Date().getTime();

                winston.error({ex:ex,did:did});

                reject('A promise error occurred did'+did);
            }
        });
    }

    getPlayerCharacter(uid:string){
        return new Promise((resolve,reject)=>{
            try{
                const cachedPC = this.cachedPlayers.get(uid);

                if(cachedPC){
                    resolve(cachedPC);

                    return;
                }

                const con = this.db.getPool();

                con.query('SELECT * FROM player WHERE uid=$1 LIMIT 1', [uid], (error, result)=>{
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

    createMonsterBattle(players:Array<PlayerCharacter>,opponent:CreatureAIControlled){
        return new Promise((resolve,reject)=>{
            //Verify no player is currently in a battle
            for(var i=0;i<players.length;i++){
                const player:PlayerCharacter = players[i];

                if(player.inBattle){
                    reject(player.title + ' is already in a battle');

                    return;
                }
            }

            const battle:CoopMonsterBattle = new CoopMonsterBattle(this.battleCardinality++,players,opponent);

            battle.on(CoopMonsterBattleEvent.BattleEnd,(e:BattleEndEvent)=>{
                if(e.victory){
                    e.survivingPCs.forEach((pc:PlayerCharacter)=>{
                        this.addXP(pc,e.xpEarned)
                        .catch((error)=>{
                            winston.error(error);
                        });
                    });

                    e.defeatedPCs.forEach((pc:PlayerCharacter)=>{
                        this.addXP(pc,e.xpEarned)
                        .catch((error)=>{
                            winston.error(error);
                        });
                    });
                }

                this.activeBattles.delete(battle.id);
            });

            this.activeBattles.set(battle.id,battle);

            resolve(battle);
        });
    }

    addWishes(pc:PlayerCharacter,amount:number):Promise<{}>{
        return new Promise((resolve,reject)=>{
        try{
            const queryStr = `
                UPDATE player 
                SET wishes = wishes + $1
                WHERE uid = $2
                RETURNING wishes;
            `;

            this.db.getClient().query(queryStr,[amount,pc.uid],(error,result)=>{
                if(error){
                    const nowMS = new Date().getTime();

                    winston.error({
                        did: nowMS,
                        error: error,
                    });

                    reject('A database error occured - did'+nowMS);

                    return;
                }

                if(result.rows){
                    const nowMS = new Date().getTime();

                    reject('Database did not return any rows? Wat. did'+nowMS);

                    winston.error({
                        did: nowMS,
                        query: queryStr,
                        result: result,
                    });

                    return;
                }

                pc.wishes = result.rows[0].wishes;

                resolve();              
            });
        }
        catch(ex){
            const nowMS = new Date().getTime();
            
            winston.log({
                did:nowMS,
                error:ex
            });

            reject('An unexpected error occurred did'+nowMS);
        }
        });
    }

    addXP(pc:PlayerCharacter,amount:number):Promise<{}>{
        return new Promise((resolve,reject)=>{
        try{
            const queryStr = `
                UPDATE player 
                SET xp = xp + $1
                WHERE uid = $2
                RETURNING xp;
            `;

            this.db.getClient().query(queryStr,[amount,pc.uid],(error,result)=>{
                if(error){
                    const nowMS = new Date().getTime();

                    winston.error({
                        did: nowMS,
                        error: error,
                    });

                    reject('A database error occured - did'+nowMS);

                    return;
                }

                if(result.rows){
                    const nowMS = new Date().getTime();

                    reject('Database did not return any rows? Wat. did'+nowMS);

                    winston.error({
                        did: nowMS,
                        query: queryStr,
                        result: result,
                    });

                    return;
                }

                pc.xp = result.rows[0].xp;

                resolve();              
            });
        }
        catch(ex){
            const nowMS = new Date().getTime();
            
            winston.log({
                did:nowMS,
                error:ex
            });

            reject('An unexpected error occurred did'+nowMS);
        }
        });
    }
/*
    transferWishes(pcFrom:PlayerCharacter,pcTo:PlayerCharacter,amount:number):Promise{

    }

    addItem()
    removeItem()
    transferItem()

    addExperience()*/
}