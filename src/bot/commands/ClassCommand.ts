import Command from './Command';
import Game from '../../game/Game';
import CharacterClass from '../../game/creature/player/CharacterClass';
import CharacterClasses from '../../game/creature/player/CharacterClasses';

export default class ClassCommand extends Command{
    constructor(){
        super(
            'class',
            'Shows information on starting classes',
            'class [name]',
            'user.class'
        );
    }

    run(params:Array<string>,message:any,game:Game){
        let msg = 'Available classes:';

        CharacterClasses.forEach(function(c:CharacterClass,key){
            let equipStr = '';
            
            if(c.startingEquipment.amulet) equipStr += '\nAmulet: '+c.startingEquipment.amulet;
            if(c.startingEquipment.earring) equipStr += '\nEarring: '+c.startingEquipment.earring;
            if(c.startingEquipment.ring) equipStr += '\nRing: '+c.startingEquipment.ring;
            if(c.startingEquipment.hat) equipStr += '\nHat: '+c.startingEquipment.hat;
            if(c.startingEquipment.armor) equipStr += '\nArmor: '+c.startingEquipment.armor;
            if(c.startingEquipment.primaryWeapon) equipStr += '\nWeapon: '+c.startingEquipment.primaryWeapon;
            if(c.startingEquipment.offhandWeapon) equipStr += '\nOffhand: '+c.startingEquipment.offhandWeapon;

            msg += `
**${c.title}** - ${c.description}
Starting stats: Strength: ${c.startingAttributes.Strength} Agiilty: ${c.startingAttributes.Agility} Vitality: ${c.startingAttributes.Vitality} Spirit: ${c.startingAttributes.Spirit} Luck: ${c.startingAttributes.Luck}
Starting equipment: ${equipStr}
`;
        });

        message.channel.sendMessage(msg)
        .catch(function(){console.log(JSON.stringify(arguments));});
    }
}