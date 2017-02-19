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
import { EquipmentBag, EquipmentSlot } from './item/CreatureEquipment';
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

interface DBEquipmentItem{
    player_uid:string;
    item_id:number;
    slot:EquipmentSlot;
}

interface DBInventoryItem{
    player_uid:string;
    item_id:number;
    amount:number;
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
            try{
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

                const queries:Array<any> = [
                    {query: insertPlayerQuery, params: insertPlayerParams}
                ];
                
                if(playerBag.class.startingEquipment){
                    const equipmentItems = [];

                    let valuesStr = '';

                    Object.keys(playerBag.class.startingEquipment._items).forEach((slot)=>{
                        const item = playerBag.class.startingEquipment._items[slot];

                        valuesStr += `,(${playerBag.uid},${item.id},'${slot}')`;
                    });

                    queries.push({
                        query: 'INSERT INTO player_equipment_item(player_uid,item_id,slot) VALUES'
                            +valuesStr.substr(1)
                    });
                }

                const insertPlayer = await this.db.runBatch(queries);          

                return await this.getPlayerCharacter(playerBag.uid);
            }
            catch(ex){
                const did = Logger.error(ex);

                throw 'An unexpected database error occurred '+did;
            }
        })();
    }

    getPlayerCharacter(uid:string,refreshPlayerData?:boolean):Promise<PlayerCharacter>{
        const getPlayerQuery = `
            SELECT 

                (SELECT array_agg(row_to_json(inventory_row))
                FROM (
                SELECT * FROM player_equipment_item WHERE player_uid = $1
                ) as inventory_row) as equipment,

                (SELECT array_agg(row_to_json(inventory_row))
                FROM (
                SELECT * FROM player_inventory_item WHERE player_uid = $1
                ) as inventory_row) as inventory,

                *
            FROM player WHERE uid = $1;
        `;

        return (async ()=>{
            let cachedPlayer = await this.cachedPlayers.get(uid);

            if(cachedPlayer && !refreshPlayerData){
                return cachedPlayer;
            }

            const result = await this.db.getPool().query(getPlayerQuery,[uid]);

            if(result.rows.length == 0){
                return null;
            }
            
            const row = result.rows[0];

            const inventory = new Map<number,InventoryItem>();

            if(row.inventory){
                row.inventory.forEach((item:DBInventoryItem)=>{
                    inventory.set(item.item_id,new InventoryItem(this.items.get(item.item_id),item.amount));
                });
            }

            const pcInventory = new PlayerInventory(inventory);
            
            const equipment = {};

            if(row.equipment){
                row.equipment.forEach((item:DBEquipmentItem)=>{
                    equipment[item.slot] = this.items.get(item.item_id);
                });
            }

            const pcEquipment = new CreatureEquipment(equipment);

            //create a new cached entry
            if(!cachedPlayer){
                cachedPlayer = new PlayerCharacter({
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
                    equipment: pcEquipment,
                    inventory: pcInventory,
                    role: row.role,
                    karma: row.karma
                });

                this.cachedPlayers.set(cachedPlayer.uid,cachedPlayer);
            }
            //Update existing entry
            else{
                cachedPlayer.description = row.description;
                cachedPlayer.title = row.username;
                cachedPlayer.xp = row.xp;
                cachedPlayer.wishes = row.wishes;
                cachedPlayer.class = CharacterClasses.get(row.class);
                cachedPlayer.attributes.Strength = row.attribute_strength;
                cachedPlayer.attributes.Agility = row.attribute_agility;
                cachedPlayer.attributes.Vitality = row.attribute_vitality;
                cachedPlayer.attributes.Spirit = row.attribute_spirit;
                cachedPlayer.attributes.Luck = row.attribute_luck;
                cachedPlayer.equipment = pcEquipment;
                cachedPlayer.inventory = pcInventory;
                cachedPlayer.role = row.role;
                cachedPlayer.karma = row.karma;
            }

            return cachedPlayer;
        })();
    }

    transferItem(from:PlayerCharacter,to:PlayerCharacter,item:ItemBase,amount:number):Promise<void>{
        const query = 'SELECT transfer_player_item($1,$2,$3,$4)';
        const params = [from.uid,to.uid,item.id,amount];

        return (async ()=>{
            try{
                await this.db.getPool().query(query,params);
                
                from.inventory._removeItem(item,amount);
                to.inventory._addItem(item,amount);
            }
            catch(ex){
                //Kind of hackish - "custom" exception from transfer_player_item function
                if(ex.code == 'P0002'){
                    throw 'You do not have enough of that item';
                }

                const did = Logger.error(ex);

                throw 'An unexpected database error occurred '+did;
            }
        })();
    }

    grantItem(to:PlayerCharacter,item:ItemBase,amount:number):Promise<void>{
        const query = 'select grant_player_item($1,$2,$3)';
        const params = [to.uid,item.id,amount];

        return (async ()=>{
            try{
                await this.db.getPool().query(query,params);

                to.inventory._addItem(item,amount);
            }
            catch(ex){
                const did = Logger.error(ex);

                throw 'An unexpected database error occurred '+did;
            }
        })();
    }

    equipItem(pc:PlayerCharacter,item:ItemEquippable,slot:EquipmentSlot):Promise<void>{
        return (async ()=>{
            try{
                const result = await this.db.getPool().query('select equip_player_item($1,$2,$3)',[pc.uid,item.id,slot]);

                const unEquippedItemId:number = result.rows[0].equip_player_item;

                if(unEquippedItemId != -1){
                    const itemUnequipped = this.items.get(unEquippedItemId);
                    
                    pc.inventory._addItem(itemUnequipped,1);
                }

                pc.inventory._removeItem(item,1);

                pc._equipItem(item,slot);
            }
            catch(ex){
                //Kind of hackish - "custom" exception from equip_player_item function
                if(ex.code == 'P0002'){
                    throw 'You do not have any of that item';
                }

                const did = Logger.error(ex);

                throw 'An unexpected database error occurred '+did;
            }
        })();
    }

    unequipItem(pc:PlayerCharacter,slot:EquipmentSlot):Promise<void>{
        return (async ()=>{
            try{
                const result = await this.db.getPool().query('select unequip_player_item($1,$2)',[pc.uid,slot]);
                
                const unEquippedItemId:number = result.rows[0].unequip_player_item;

                if(unEquippedItemId != -1){
                    const itemUnequipped = this.items.get(unEquippedItemId);

                    pc.equipment._unequipItem(slot);   
                    pc.inventory._addItem(itemUnequipped,1);
                }
            }
            catch(ex){
                //Kind of hackish - "custom" exception from equip_player_item function
                if(ex.code == 'P0002'){
                    throw 'You do not have anything equipped in that slot';
                }

                const did = Logger.error(ex);

                throw 'An unexpected database error occurred '+did;
            }
        })();
    }

    createMonsterBattle(players:Array<PlayerCharacter>,opponent:CreatureAIControlled){
        return new Promise((resolve,reject)=>{
            //Verify no player is currently in a battle
            for(var i=0;i<players.length;i++){
                const player:PlayerCharacter = players[i];

                if(player.battle){
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
        return (async ()=>{
            if(this.cachedPlayers.has(uid)){
                this.cachedPlayers.delete(uid);
            }

            this.db.runBatch([
                {query: 'DELETE FROM player_inventory_item WHERE player_uid = $1',params:[uid]},
                {query: 'DELETE FROM player_equipment_item WHERE player_uid = $1',params:[uid]},
                {query: 'DELETE FROM player WHERE uid = $1',params:[uid]}
            ]);
        })();
    }

    createPlayerParty(name:string,leader:PlayerCharacter,channel:DiscordTextChannel):PlayerParty{
        if(leader.party){
            throw 'You are already in a party';
        }

        const party = new PlayerParty(name,leader,channel,this);

        party.on(PlayerPartyEvent.PartyDisbanded,(e:PartyDisbandedEvent)=>{
            this.playerParties.delete(e.party.id);
        });

        this.playerParties.set(party.id,party);
        
        return party;
    }

    setPlayerRole(pc:PlayerCharacter,role:string):Promise<void>{
        return (async()=>{
            try{
                await this.db.getPool().query('UPDATE player SET role=$1 WHERE uid=$2',[role,pc.uid]);

                pc.role = role;
            }
            catch(ex){
                const did = Logger.error(ex);

                throw 'A database exception occurred '+did;
            }
        })();
    }
/*
    transferWishes(pcFrom:PlayerCharacter,pcTo:PlayerCharacter,amount:number):Promise{

    }

    addItem()
    removeItem()
    transferItem()

    addExperience()*/
}