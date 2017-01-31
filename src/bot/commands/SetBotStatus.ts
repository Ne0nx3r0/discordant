import Command from '../Command';
import Game from '../../game/Game';
import { CommandBag, DiscordMessage } from '../Bot';
import PermissionId from '../../permissions/PermissionIds';

export default class ChannelId extends Command{
    constructor(){
        super(
            'setplayinggame',
            'Sets the bots playing message',
            'setplayinggame <status>',
            PermissionId.SetPlayingGame
        );
    }

     run(params:Array<string>,message:DiscordMessage,bag:CommandBag){
        const status = message.content.substr('setbotstatus '.length);

        bag.bot.setPlayingGame(status);
    }
}