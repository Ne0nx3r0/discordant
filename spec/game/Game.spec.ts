/// <reference path="../../node_modules/typings/dist/bin.d.ts" />

import Config from '../../Config';
import DatabaseService from '../../src/database/DatabaseService';
import Game from '../../src/game/Game';
import Bot from '../../src/bot/Bot';
import CharacterClasses from '../../src/game/creature/player/CharacterClasses';
import PlayerCharacter from '../../src/game/creature/player/PlayerCharacter';

const db:DatabaseService = new DatabaseService(Config.DatabaseConfig);
const game:Game = new Game(db);

describe('User registration',()=>{
    it('should allow database queries',(done)=>{
        //delete test player if he exists
        db.getClient().query('DELETE FROM player WHERE uid = $1',[42],function(err,result){
            expect(err).toBeNull();

            done();
        });
    })

    it('should allow new users to register',(done)=>{
        game.registerPlayerCharacter({
            uid:'42',
            discriminator:42,
            username:'Test Player',
            class:CharacterClasses.get(1),
        })
        .then((pc:PlayerCharacter)=>{
            expect(pc.id).toEqual(jasmine.any(Number));

            expect(pc.uid).toBe('42');

            done();
        })
        .catch((ex)=>{
            expect(ex).toBeNull();
        });
    });

    it('should allow retrieving existing users',(done)=>{
        game.getPlayerCharacter('42')
        .then((pc:PlayerCharacter)=>{
            expect(pc).toBeDefined();

            expect(pc.stats.hpCurrent).toEqual(pc.stats.HPTotal);
        })
        .catch((ex)=>{
            expect(ex).toBeNull();
        });    
    });
});