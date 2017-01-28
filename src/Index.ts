import Config from '../Config';
import DatabaseService from './database/DatabaseService';
import Game from './game/Game';
import Bot from './bot/Bot';

class Discordant {
    public static main(): number {
        const db:DatabaseService = new DatabaseService(Config.DatabaseConfig);

        const game:Game = new Game(db);

        const bot:Bot = new Bot(game,Config.GameBotAuthToken);
        require('winston').error({some:{complex:{obj:42}}});
        return 0;
    }
}

Discordant.main();