import Command from '../Command';
import Game from '../../game/Game';
import CharacterClass from '../../game/creature/player/CharacterClass';
import CharacterClasses from '../../game/creature/player/CharacterClasses';
import { DiscordMessage, CommandBag } from '../Bot';
import PermissionId from '../../permissions/PermissionIds';

export default class Classes extends Command{
    constructor(){
        super(
            'class',
            'Shows information on starting classes',
            'class [name]',
            PermissionId.Classes
        );

        this.allowAnonymous = true;

        this.aliases = ['classes'];
    }

    run(params:Array<string>,message:DiscordMessage,bag:CommandBag){
        let msgEmbed = 'Available classes:';

        CharacterClasses.forEach(function(c:CharacterClass,key){
            let equipStr = '';
            
            if(c.startingEquipment.amulet) equipStr += ', '+c.startingEquipment.amulet.title;
            if(c.startingEquipment.earring) equipStr += ', '+c.startingEquipment.earring.title;
            if(c.startingEquipment.ring) equipStr += ', '+c.startingEquipment.ring.title;
            if(c.startingEquipment.hat) equipStr += ', '+c.startingEquipment.hat.title;
            if(c.startingEquipment.armor) equipStr += ', '+c.startingEquipment.armor.title;
            if(c.startingEquipment.primaryweapon) equipStr += ', '+c.startingEquipment.primaryweapon.title;
            if(c.startingEquipment.offhandweapon) equipStr += ', '+c.startingEquipment.offhandweapon.title;

            equipStr = equipStr.substr(2);

            msgEmbed += `\n
**${c.title}**
${c.description}

Starting Attributes: 
Strength: ${c.startingAttributes.Strength}   Agiilty: ${c.startingAttributes.Agility}   Vitality: ${c.startingAttributes.Vitality}   Spirit: ${c.startingAttributes.Spirit}   Luck: ${c.startingAttributes.Luck}

Starting equipment: 
${equipStr}`;
        });

        message.channel.sendMessage('',this.getEmbed(msgEmbed,0x63FF47))
        .catch(function(){console.log(JSON.stringify(arguments));});
    }
}