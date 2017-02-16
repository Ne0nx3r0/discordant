import Command from '../Command';
import Game from '../../game/Game';
import { DiscordMessage, CommandBag } from '../Bot';
import PermissionId from '../../permissions/PermissionIds';
import {TagRegex} from '../../util/Regex';
import ParseNumber from '../../util/ParseNumber';
import PlayerCharacter from '../../game/creature/player/PlayerCharacter';
import Weapon from '../../game/item/Weapon';
import ItemEquippable from '../../game/item/ItemEquippable';

export default class Grant extends Command{
    constructor(){
        super(
            'equip',
            'Equip an item',
            'equip <item name> [offhand]',
            PermissionId.Equip
        );
    }

    run(params:Array<string>,message:DiscordMessage,bag:CommandBag){
        if(params.length < 1){
            message.channel.sendMessage(this.getUsage());

            return;
        }

        const offhand = params[params.length-1] == 'offhand';

        const itemName = offhand ? params.slice(0,-1).join(' ') : params.join(' ');

        const itemBaseToEquip = bag.game.items.findByName(itemName);

        if(!itemBaseToEquip){
            message.channel.sendMessage(`"${itemName}" not found, ${bag.pc.title}`);

            return;
        }

        if(!bag.pc.inventory.hasItem(itemBaseToEquip)){
            message.channel.sendMessage(`You don't have any ${itemBaseToEquip.title}, ${bag.pc.title}`);

            return;
        }

        if(!(itemBaseToEquip instanceof ItemEquippable)){
            message.channel.sendMessage(`${itemBaseToEquip.title} cannot be equipped, ${bag.pc.title}`);

            return;
        }

        const itemEquippableToEquip = itemBaseToEquip as ItemEquippable;
        
        if(offhand && !(itemBaseToEquip instanceof Weapon)){
            message.channel.sendMessage(`You cannot equip ${itemBaseToEquip.title} as an offhand weapon, ${bag.pc.title}`);

            return;
        }

        let equipSlot = offhand ? 'offhand' : itemEquippableToEquip.slotType;

        asyncCommand();

        async function asyncCommand(){
            try{
                const itemUnequipped:ItemEquippable = await bag.game.equipItem(bag.pc,itemEquippableToEquip,equipSlot);

                let deEquippedStr = '';

                if(itemUnequipped){
                    
                }

                message.channel.sendMessage(`${bag.pc.title} equipped ${itemBaseToEquip.title}${deEquippedStr}`);
            }
            catch(ex){
                message.channel.sendMessage(ex+', '+bag.pc.title);

                return;
            }
        }
    }
}