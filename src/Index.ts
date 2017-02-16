import Config from '../Config';
import DatabaseService from './database/DatabaseService';
import Game from './game/Game';
import Bot from './bot/Bot';
import PermissionsService from './permissions/PermissionsService';
import CharacterClasses from './game/creature/player/CharacterClasses';

class Discordant {
    public static main(): number {
        const permissions = new PermissionsService();

        const db:DatabaseService = new DatabaseService(Config.DatabaseConfig);

        const game:Game = new Game(db);

        const bot:Bot = new Bot({
            game: game,
            permissions: permissions,
            authToken: Config.GameBotAuthToken,
            ownerUIDs: Config.OwnerUIDs,
            mainGuildId: Config.MainGuildId,
            commandPrefix: Config.CommandPrefix,
        });

        return 0;
    }
}

Discordant.main();

process.on("unhandledRejection", err => {
  console.error("Uncaught Promise Error: \n" + err.stack);
});