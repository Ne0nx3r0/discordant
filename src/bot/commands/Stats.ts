import Command from './Command';
import Game from '../../game/Game';
import PlayerCharacter from '../../game/creature/player/PlayerCharacter';

const TAG_REGEX = new RegExp(/<@([0-9]+)>/);

export default class ChannelId extends Command{
    constructor(){
        super(
            'stats',
            'Shows your (or another player\'s stats)',
            'stats @player',
            'user.stats'
        );
    }

    run(params:Array<string>,message:any,game:Game){
        let statsUid;

        if(params.length == 0){
            statsUid = message.author.id;
        }
        else{
            const tag = params[0];
            
            if(TAG_REGEX.test(tag)){
                statsUid = TAG_REGEX.exec(tag)[1];
            }
            else{
                message.reply(this.getUsage());

                return;
            }
        }

        game.getPlayerCharacter(statsUid)
        .then((pc:PlayerCharacter)=>{
            if(!pc){
                message.reply('Player not found');

                return;
            }
            console.log(pc);
            message.channel
            .sendMessage("",getEmbed(pc))
            .catch(function(err){message.reply(err);});
        })
        .catch((err)=>{
            message.reply(err);
        });
    }
}

function getEmbed(pc:PlayerCharacter){
    const pcAttributesStr = ''
    +' STR'+pc.stats.Strength
    +' AGL'+pc.stats.Agility
    +' VIT'+pc.stats.Vitality
    +' SPR'+pc.stats.Spirit
    +' LCK'+pc.stats.Luck;

    const resistancesStr = ''
    +'Physical: '+pc.stats.Resistances.Physical
    +'\n Fire: '+pc.stats.Resistances.Fire
    +'\n Cold: '+pc.stats.Resistances.Cold
    +'\n Thunder: '+pc.stats.Resistances.Thunder;

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
                    name: 'Attributes',
                    value: pcAttributesStr,
                    inline: true,
                },
                {
                    name: 'Primary Weapon',
                    value: pc.equipment.primaryWeapon.title,
                    inline: true,
                },
                {
                    name: 'Offhand Weapon',
                    value: pc.equipment.offhandWeapon.title,
                    inline: true,
                },
                {
                    name: 'Health Points',
                    value: pc.HPCurrent + ' / ' + pc.stats.HPTotal,
                    inline: true,
                },
                {
                    name: 'Resistances',
                    value: resistancesStr,
                    inline: true,
                },
                {
                    name: 'Testing code markdown',
                    value: '```md\n\n< Testing spacing           '+pc.xp+'xp >\n<blue_stuff>         <blue_stuff>\n```',
                }
            ]
        }
    }
}