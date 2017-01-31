import Command from '../Command';
import Game from '../../game/Game';
import CharacterClass from '../../game/creature/player/CharacterClass';
import CharacterClasses from '../../game/creature/player/CharacterClasses';
import {CharacterClassId} from '../../game/creature/player/CharacterClasses';
import { DiscordMessage, DiscordMessageOptions, CommandBag } from '../Bot';
import PermissionId from '../../permissions/PermissionIds';

export default class Begin extends Command {
    constructor() {
        super(
            'begin',
            'Registers the user to play as the given class',
            'begin <class>',
            PermissionId.Begin
        );

        this.allowAnonymous = true;
    }

    getAvailableClasses() {
        let classesStr = 'Available classes: ';

        const classes = CharacterClasses.forEach(function(c: CharacterClass, key){
            classesStr += c.title + ', ';
        });

        return classesStr.slice(0, -2) + '\n(`dclass` for more info)';
    }

    run(params: Array<string>, message:DiscordMessage, bag:CommandBag) {
        if(bag.pc){
            message.channel.sendMessage('You have already begun, '+bag.pc.title);

            return;
        }

        if (params.length < 1) {
            message.channel.sendMessage('You must choose a class, '+message.author.username
            +'\n\n' + this.getAvailableClasses());

            return;
        }

        const wantedClassStr = params[0];
        const wantedClassStrUpper = wantedClassStr.toUpperCase();

        const wantedClass: CharacterClass = CharacterClasses.find((val) => {
            return val.title.toUpperCase() === wantedClassStrUpper;
        });

        if (!wantedClass) {
            message.channel.sendMessage(params[0] + ' is not a valid class, '+message.author.username
            +'\n\n' + this.getAvailableClasses());

            return;
        }

        bag.game.registerPlayerCharacter({
            uid: message.author.id,
            discriminator: message.author.discriminator,
            username: message.author.username,
            class: wantedClass,
        })
        .then(function(pc){
            let luckMsg = 'Good luck!';

            if(wantedClass.id == CharacterClassId.Nobody){
                luckMsg = 'Seek strength. The rest will follow...';
            }

            message.channel.sendMessage('You have successfully been registered as a ' + wantedClass.title + ', '+message.author.username
            +'\n\nGood luck!');
        })
        .catch(function(err){
            message.channel.sendMessage(err+', '+message.author.username);
        });
    }
}