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
import {DBItemBag} from './item/PlayerInventory';
import ItemEquippable from './item/ItemEquippable';
import Weapon from './item/Weapon';
import Logger from '../util/Logger';
import PlayerParty from './party/PlayerParty';
import {DiscordTextChannel} from '../bot/Bot';
import { PlayerPartyEvent, PartyDisbandedEvent } from './party/PlayerParty';
import InventoryItem from './item/InventoryItem';
import ItemBase from './item/ItemBase';

interface IPlayerRegisterBag{
    uid:string,//has to be because bigint
    discriminator:string;
    username:string;
    class:CharacterClass;
}

export default class Game{
    items:AllItems;
    db:DatabaseService;
    cachedPlayers:Map<string,PlayerCharacter>;

    activeBattles:Map<number,CoopMonsterBattle>;
    battleCardinality:number;

    playerParties:Map<string,PlayerParty>;

    constructor(db:DatabaseService){
        this.db = db;
        this.cachedPlayers = new Map();
        this.playerParties = new Map();
        this.activeBattles = new Map();

        this.battleCardinality = 1;

        this.items = new AllItems();
    }

    registerPlayerCharacter(playerBag:IPlayerRegisterBag){
        return (async ()=>{
            //try to grab the existing player from the database or cache
            const dbPlayer = await this.getPlayerCharacter(playerBag.uid);

            if(dbPlayer){
                throw dbPlayer.title+' is already registered!';
            }

            const insertPlayerQuery = `
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
                        role
                    )
                    VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10);
            `;

            const insertPlayerParams:Array<any> = [
                playerBag.uid,
                playerBag.discriminator,
                playerBag.username,
                playerBag.class.id,
                playerBag.class.startingAttributes.Strength,
                playerBag.class.startingAttributes.Agility,
                playerBag.class.startingAttributes.Vitality,
                playerBag.class.startingAttributes.Spirit,
                playerBag.class.startingAttributes.Luck,
                'player'
            ];

            const queries = [
                {query: insertPlayerQuery, params: insertPlayerParams}
            ];
            
            if(playerBag.class.startingEquipment._items){
                
            }

            const insertPlayer = await this.db.runBatch(queries);          

            return await this.getPlayerCharacter(playerBag.uid);
        })();
    }

    _old_registerPlayerCharacter(playerBag:IPlayerRegisterBag){
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
                            role
                        )
                        VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10);
                `;

                const pcInventory = [];//TODO: implement starting inventory for classes

                const pcEquipment = playerBag.class.startingEquipment.toDatabase();

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
                    'player'
                ];

                const con = this.db.getPool();

                con.query(queryStr, queryValues, insertResult.bind(this));

                function insertResult(error, result) {
                    if(error){
                        //Unique constraint violation - uid exists already
                        if(error.code == 23505){
                            reject('Character has already been registered');
                        }
                        else{
                            const did = Logger.error(error);

                            reject('An unexpected database error occurred '+did);
                        }

                        return;
                    }

                    this.getPlayerCharacter(playerBag.uid)
                    .then(function(pc){
                        resolve(pc);
                    })
                    .catch(function(ex){
                        reject(ex);//not this method's problem
                    });
                }
            }
            catch(ex){
                const did = Logger.error(ex);

                reject('An unexpected promise error occurred '+did);
            }
        });
    }

    a_getPlayerCharacter(uid:string):Promise<PlayerCharacter>{
        const getPlayerQuery = `
            SELECT 
                (SELECT array_agg(row_to_json(row))
                FROM (
                SELECT * FROM player_equipment_item WHERE player_uid = $1
                ) as row) as equipment,
                *
            FROM player WHERE uid = $1;
        `;

        const getPlayerParams = [uid];

        return (async ()=>{
            const cachedPlayer = await this.cachedPlayers.get(uid);

            if(cachedPlayer){
                return cachedPlayer;
            }

            const playerResult = await this.db.getPool().query(getPlayerQuery,getPlayerParams);

            console.log('playerResult',playerResult);

            if(!playerResult){
                return null;
            }

            //TODO: process player result into a player object and cache it
        })();
    }

    getPlayerCharacter(uid:string):Promise<PlayerCharacter>{
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
                        const did = Logger.error({error:error,uid:uid});

                        reject('An unexpected database error occurred '+did);

                        return;
                    }

                    const row = result.rows[0];

                    if(!row){
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
                        if(row.equipment.primaryweapon) pcEquipment.primaryweapon = this.items.get(row.equipment.primaryweapon.id) as Weapon;
                        if(row.equipment.offhandweapon) pcEquipment.offhandweapon = this.items.get(row.equipment.offhandweapon.id) as Weapon;
                    }

                    const pcInventory:PlayerInventory = new PlayerInventory();

                    if(row.inventory){
                        row.inventory.forEach((item:DBItemBag)=>{
                            const itemBase = this.items.get(item.id);
                            const inventoryItem = new InventoryItem(itemBase,item.amount);

                            pcInventory.items.set(item.id,inventoryItem);
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
                        karma: row.karma
                    });

                    this.cachedPlayers.set(pc.uid,pc);

                    resolve(pc);
                });
            }
            catch(ex){
                const did = Logger.error(ex);

                reject('A database error occurred '+did);
            }
        });
    }

    createMonsterBattle(players:Array<PlayerCharacter>,opponent:CreatureAIControlled){
        return new Promise((resolve,reject)=>{
            //Verify no player is currently in a battle
            for(var i=0;i<players.length;i++){
                const player:PlayerCharacter = players[i];

                if(player.isInBattle){
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
                            Logger.error({error:error,uid:pc.uid});
                        });
                    });

                    e.defeatedPCs.forEach((pc:PlayerCharacter)=>{
                        this.addXP(pc,e.xpEarned)
                        .catch((error)=>{
                            Logger.error({error:error,uid:pc.uid});
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

            this.db.getPool().query(queryStr,[amount,pc.uid],(error,result)=>{
                if(error){
                    const did = Logger.error({
                        error:error,
                        uid:pc.uid,
                        amount:amount
                    });

                    reject('A database error occured '+did);

                    return;
                }

                if(result.rows){
                    const did = Logger.error({
                        error:error,
                        uid:pc.uid,
                        amount:amount
                    });

                    reject('Database did not return any rows? Wat. '+did);

                    return;
                }

                pc.wishes = result.rows[0].wishes;

                resolve();              
            });
        }
        catch(ex){
            const did = Logger.error({
                ex:ex,
                uid:pc.uid,
                amount:amount
            });

            reject('An unexpected error occurred '+did);
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

            this.db.getPool().query(queryStr,[amount,pc.uid],(error,result)=>{
                if(error){
                    const did = Logger.error({
                        error:error,
                        uid:pc.uid,
                        amount:amount
                    });

                    reject('A database error occured '+did);

                    return;
                }

                if(result.rows){
                    const did = Logger.error({
                        query: queryStr,
                        result: result,
                    });

                    reject('Database did not return any rows? Wat. '+did);

                    return;
                }

                pc.xp = result.rows[0].xp;

                resolve();              
            });
        }
        catch(ex){
            const did = Logger.error({
                ex:ex,
                uid:pc.uid,
                amount:amount
            });

            reject('An unexpected error occurred '+did);
        }
        });
    }

    deletePlayerCharacter(uid:string){
        return new Promise((resolve,reject)=>{
            if(this.cachedPlayers.has(uid)){
                this.cachedPlayers.delete(uid);
            }

            this.db.getPool().query('DELETE FROM player WHERE uid = $1',[uid],(error,result)=>{
                if(error){
                    const did = Logger.error(error);

                    reject('An unexpected error occurred '+did);
                }
                else{
                    resolve();
                }
            });
        });
    }

    createPlayerParty(name:string,leader:PlayerCharacter,channel:DiscordTextChannel):PlayerParty{
        if(leader.isInParty){
            throw 'You are already in a party';
        }

        const party = new PlayerParty(name,leader,channel,this);

        party.on(PlayerPartyEvent.PartyDisbanded,(e:PartyDisbandedEvent)=>{
            this.playerParties.delete(e.party.id);
        });

        this.playerParties.set(party.id,party);
        
        return party;
    }
/*
    async transferItem(pcFrom:PlayerCharacter,pcTo:PlayerCharacter,itemBase:ItemBase,amount:number){
        try{
            const pcFromItem = pcFrom.inventory.items.get(itemBase.id);

            if(!pcFromItem){
                throw 'You do not have '+itemBase.title;
            }

            if(pcFromItem.amount < amount){
                throw 'You have less than '+amount+' '+itemBase.title;
            }

            const pcFromInvClone = pcFrom.inventory.clone();
            const pcToInvClone = pcTo.inventory.clone();

            pcFromInvClone.removeItem(itemBase,amount);
            pcToInvClone.addItem(itemBase,amount);

            const query = `
                UPDATE player as p set
                    inventory = pc.inventory
                FROM (values
                    ($1, CAST($2 as jsonb)),
                    ($3, CAST($4 as jsonb))  
                ) as pc(uid, inventory) 
                WHERE pc.uid = pc.uid
                RETURNING p.uid,p.inventory;
            `;

            const queryParams = [
                pcFrom.uid,
                pcFromInvClone.toDatabase(),
                pcTo.uid,
                pcToInvClone.toDatabase()
            ];

            const result = await this.db.getPool().query(query,queryParams);

            console.log(JSON.stringify(result));

            if(result.error){
                const did = Logger.error(result.error);

                throw 'An unexpected error occurred '+did;
            }

            //Update their inventories since the database call succeeded
            pcFrom.inventory = pcFromInvClone;
            pcTo.inventory = pcToInvClone;
        }
        catch(ex){
            const did = Logger.error(ex);

            throw 'An unexpected error occurred '+did;
        }
    }*/

/*
    transferWishes(pcFrom:PlayerCharacter,pcTo:PlayerCharacter,amount:number):Promise{

    }

    addItem()
    removeItem()
    transferItem()

    addExperience()*/
}