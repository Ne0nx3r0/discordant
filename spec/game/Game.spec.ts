/// <reference path="../../node_modules/typings/dist/bin.d.ts" />

import Config from '../../Config';
import DatabaseService from '../../src/database/DatabaseService';
import Game from '../../src/game/Game';
import Bot from '../../src/bot/Bot';
import CharacterClasses from '../../src/game/creature/player/CharacterClasses';
import PlayerCharacter from '../../src/game/creature/player/PlayerCharacter';
import Goblin from '../../src/game/creature/monsters/Goblin';
import { CoopMonsterBattleEvent, PlayersAttackedEventData } from '../../src/game/battle/CoopMonsterBattle';
import CoopMonsterBattle from '../../src/game/battle/CoopMonsterBattle';
import IDamageSet from '../../src/game/damage/IDamageSet';

const TEST_PC_ID = '42';

const db:DatabaseService = new DatabaseService(Config.DatabaseConfig);
const game:Game = new Game(db);

describe('User registration',()=>{
    it('should allow database queries',(done)=>{
        //delete test player if he exists
        db.getClient().query('DELETE FROM player WHERE uid = $1',[TEST_PC_ID],function(err,result){
            expect(err).toBeNull();

            done();
        });
    })

    it('should allow new users to register',(done)=>{
        game.registerPlayerCharacter({
            uid:TEST_PC_ID,
            discriminator:42,
            username:'Test Player',
            class:CharacterClasses.get(1),
        })
        .then((pc:PlayerCharacter)=>{
            expect(pc.id).toEqual(jasmine.any(Number));

            expect(pc.uid).toBe(TEST_PC_ID);

            done();
        })
        .catch((ex)=>{
            expect(ex).toBeNull();

            done();
        });
    });

    it('should allow retrieving existing users',(done)=>{
        game.getPlayerCharacter(TEST_PC_ID)
        .then((pc:PlayerCharacter)=>{
            expect(pc).toBeDefined();

            expect(pc.stats.HPCurrent).toEqual(pc.stats.HPTotal);

            done();
        })
        .catch((ex)=>{
            expect(ex).toBeNull();

            done();
        });    
    });
});

describe('Game player battles',()=>{
    it('should allow creating battles',(done)=>{
        game.getPlayerCharacter(TEST_PC_ID)
        .then((pc:PlayerCharacter)=>{
            createBattle(pc);
        })
        .catch((ex)=>{
            expect(ex).toBeNull();

            done();
        });   

        function createBattle(pc:PlayerCharacter){
            const opponent = new Goblin();

            game.createMonsterBattle([pc],opponent)
            .then((battle:CoopMonsterBattle)=>{
                expect(battle).toBeDefined();

                expect(battle.id).toEqual(jasmine.any(Number));

                expect(battle.pcs[0]).toEqual(pc);
            })
            .catch((ex)=>{
                expect(ex).toBeNull();

                done();
            });   
        }
    });
});