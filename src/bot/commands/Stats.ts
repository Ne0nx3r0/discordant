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
    return {
        embed: {
            color: 3447003,
            author: {
                name: 'Stats for '+pc.title,
                icon_url: 'http://dsi-vd.github.io/patternlab-vd/images/fpo_avatar.png'
            },
            //title: 'Stats for '+pc.title,
            //url: 'http://discordant.io/',
            description: 'description here '+pc.description,
            fields: [
                {
                    name: 'Experience',
                    value: pc.xp
                },
                {
                    name: 'Gold',
                    value: pc.gold
                },
                {
                    name: 'Primary Weapon',
                    value: pc.equipment.primaryWeapon.title
                },
                {
                    name: 'Offhand Weapon',
                    value: pc.equipment.offhandWeapon.title
                },
                {
                    name: 'Testing code markdown',
                    value: '```md\n\n< Testing spacing           '+pc.xp+'xp >\n<blue_stuff>         <blue_stuff>\n```'
                }
            ],
            /*timestamp: new Date(),
            footer: {
                icon_url: 'http://gohwp.org/wp-content/uploads/2016/10/light-bulb.png',
                text: 'Discordant Footer Text'
            }*/
        };
}