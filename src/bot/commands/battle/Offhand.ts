import Command from '../../Command';
import Game from '../../../game/Game';
import CharacterClass from '../../../game/creature/player/CharacterClass';
import CharacterClasses from '../../../game/creature/player/CharacterClasses';
import PlayerCharacter from '../../../game/creature/player/PlayerCharacter';
import CoopBattle from '../../../game/battle/CoopBattle';
import { DiscordMessage, CommandBag } from '../../Bot';
import PermissionId from '../../../permissions/PermissionIds';

export default class Offhand extends Command{
    constructor(){
        super(
            'offhand',
            '(in battle) attacks the monster with the default or a specific attack from held offhand weapon',
            'offhand [attackname]',
            PermissionId.BattleOffhand
        );

        this.addAlias('o');
    }

    run(params:Array<string>,message:DiscordMessage,bag:CommandBag){
        const battle = bag.pc.battle;

        if(!battle){
            message.channel.sendMessage('You are not currently in a battle, '+bag.pc.title);

            return;
        }
        
        if(bag.pc.party.channel.id != message.channel.id){
            message.channel.sendMessage('Your battle is in <#'+bag.pc.party.channel.id+'>, '+bag.pc.title);

            return;
        }

        const wantedAttackStr = params.join(' ').toUpperCase();

        const pcWeaponOffhand = bag.pc.equipment.offhandweapon;
        let attack;
        
        if(params.length == 0){
            attack = pcWeaponOffhand.attacks[0];
        }
        else{
            attack = pcWeaponOffhand.findAttack(wantedAttackStr);
        }

        if(!attack){
            let validAttacks = '';

            pcWeaponOffhand.attacks.forEach((attack)=>{
                validAttacks += ', '+attack.title;
            });

            message.channel.sendMessage(wantedAttackStr+' is not a valid attack, '+bag.pc.title+'. '+pcWeaponOffhand.title+' has: '+validAttacks.substr(2));
        }
        else{
            bag.pc.battle.playerActionAttack(bag.pc,attack)
            .catch(function(error){message.channel.sendMessage(error+', '+bag.pc.title);});
        }
    }
}