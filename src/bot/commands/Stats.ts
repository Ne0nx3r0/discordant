import Command from '../Command';
import Game from '../../game/Game';
import PlayerCharacter from '../../game/creature/player/PlayerCharacter';
import { DiscordMessage, DiscordMessageOptions, CommandBag } from '../Bot';
import PermissionId from '../../permissions/PermissionIds';

export default class ChannelId extends Command{
    constructor(){
        super(
            'stats',
            'Shows your (or another player\'s stats)',
            'stats @player',
            PermissionId.Stats
        );
    }

    run(params:Array<string>,message:DiscordMessage,bag:CommandBag){
        if(params.length == 0){
            message.channel.sendMessage("",getEmbed(bag.pc) as DiscordMessageOptions);

            return;
        }

        const tagUserId = message.mentions.users.first().id;
        
        if(!tagUserId){
            message.channel.sendMessage(this.getUsage());

            return;
        }

        bag.game.getPlayerCharacter(tagUserId)
        .then((otherPC:PlayerCharacter)=>{
            if(!otherPC){
                message.channel.sendMessage('No player found, '+message.author.username);

                return;
            }

            message.channel.sendMessage("",getEmbed(otherPC) as DiscordMessageOptions);
        })
        .catch((err)=>{
            message.channel.sendMessage(err+', '+bag.pc.title);
        });
    }
}

function getEmbed(pc:PlayerCharacter){
    const pcAttributesStr = ''
    +'\n'+pc.stats.Strength+' Strength'
    +'\n'+pc.stats.Agility+' Agility'
    +'\n'+pc.stats.Vitality+' Vitality'
    +'\n'+pc.stats.Spirit+' Spirit'
    +'\n'+pc.stats.Luck+' Luck';

    const resistancesStr = ''
    +'\n'+(pc.stats.Resistances.Physical*100)+'% Physical'
    +'\n'+(pc.stats.Resistances.Fire*100)+'%'+' Fire'
    +'\n'+(pc.stats.Resistances.Cold*100)+'%'+' Cold'
    +'\n'+(pc.stats.Resistances.Thunder*100)+'% Thunder';

    return {
        embed: {
            color: 3447003,
            author: {
                name: 'Stats for '+pc.title,
                icon_url: 'http://dsi-vd.github.io/patternlab-vd/images/fpo_avatar.png'
            },
            description: 'description here '+pc.description,
            fields: [
                {
                    name: 'Health Points',
                    value: pc.HPCurrent + ' / ' + pc.stats.HPTotal,
                    inline: true,
                },
                {
                    name: 'Experience',
                    value: pc.xp,
                    inline: true,
                },
                {
                    name: 'Wishes',
                    value: pc.wishes,
                    inline: true,
                },                
                {
                    name: 'Karma',
                    value: pc.karma,
                    inline: true,
                },
                {
                    name: 'Primary Weapon',
                    value: pc.equipment.primaryweapon.title,
                    inline: true,
                },
                {
                    name: 'Offhand Weapon',
                    value: pc.equipment.offhandweapon.title,
                    inline: true,
                },
                {
                    name: 'Class',
                    value: pc.class.title,
                    inline: true,
                },
                {
                    name: 'Attributes',
                    value: pcAttributesStr,
                    inline: true,
                },
                {
                    name: 'Resistances',
                    value: resistancesStr,
                    inline: true,
                }
            ]
        }
    }
}