/// <reference path='../../../node_modules/typings/dist/bin.d.ts' />

import Config from '../../../Config';
import DatabaseService from '../../../src/database/DatabaseService';
import Game from '../../../src/game/Game';
import Bot from '../../../src/bot/Bot';
import CharacterClasses from '../../../src/game/creature/player/CharacterClasses';
import PlayerCharacter from '../../../src/game/creature/player/PlayerCharacter';
import Goblin from '../../../src/game/creature/monsters/Goblin';
import { CoopMonsterBattleEvent, PlayersAttackedEventData } from '../../../src/game/battle/CoopMonsterBattle';
import CoopMonsterBattle from '../../../src/game/battle/CoopMonsterBattle';
import IDamageSet from '../../../src/game/damage/IDamageSet';
