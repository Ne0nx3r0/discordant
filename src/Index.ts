import Config from '../Config';
import Game from './game/Game';
import Bot from './bot/Bot';

class Discordant {
    public static main(): number {
        const game:Game = new Game();

        const bot:Bot = new Bot(game,Config.GameBotAuthToken);

        return 0;
    }
}

Discordant.main();