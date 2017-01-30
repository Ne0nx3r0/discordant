import Command from '../Command';
import Game from '../../game/Game';
import { DiscordMessage, CommandBag } from '../Bot';
import PermissionId from '../../permissions/PermissionIds';
import EvalCode from '../../util/EvalCode';

export default class EvalCommand extends Command{
    constructor(){
        super(
            'eval',
            'runs a JavaScript expression in the command.run context',
            'eval <code>',
            PermissionId.Eval
        );
    }

    run(params:Array<string>,message:DiscordMessage,bag:CommandBag){
        const code = params.join(' ');

        const result = EvalCode.runInContext(code,{
            pc:bag.pc,
            game:bag.game,
            message:message
        });

        message.channel.sendMessage(result);
    }
}