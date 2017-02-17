import Command from '../Command';
import Game from '../../game/Game';
import { DiscordMessage, CommandBag } from '../Bot';
import PermissionId from '../../permissions/PermissionIds';
import {TagRegex} from '../../util/Regex';
import ParseNumber from '../../util/ParseNumber';
import PlayerCharacter from '../../game/creature/player/PlayerCharacter';
import Weapon from '../../game/item/Weapon';
import ItemEquippable from '../../game/item/ItemEquippable';
import { VALID_SLOTS, EquipmentSlot } from '../../game/item/CreatureEquipment';
export default class Unequip extends Command{
    constructor(){
        super(
            'unequip',
            'unequip an item',
            'unequip <hat|armor|amulet|bracer|ring|weapon|offhand>',
            PermissionId.Unequip
        );
    }

    run(params:Array<string>,message:DiscordMessage,bag:CommandBag){
        (async()=>{
            try{
                if(params.length < 1){
                    message.channel.sendMessage(this.getUsage());

                    return;
                }

                const slot = params[0].toLocaleLowerCase();

                if(VALID_SLOTS.indexOf(slot) == -1){
                    message.channel.sendMessage(slot+' is not a valid equipment slot, '+bag.pc.title+'\n\n'+this.getUsage());

                    return;
                }

                const itemToUnequip:ItemEquippable = bag.pc.equipment._items[slot];

                if(!itemToUnequip){
                    message.channel.sendMessage(`${slot} slot is empty, ${bag.pc.title}`);

                    return;
                }

                await bag.game.unequipItem(bag.pc,slot as EquipmentSlot);

                message.channel.sendMessage(`${bag.pc.title} unequipped ${itemToUnequip.title}`);
            }
            catch(ex){
                message.channel.sendMessage(ex+', '+bag.pc.title);

                return;
            }
        })();
    }
}