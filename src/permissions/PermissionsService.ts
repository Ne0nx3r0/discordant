import PermissionId from './PermissionIds';
import PartyExplore from '../bot/commands/party/PartyExplore';

//Hard coded permissions assigned to each role
const playerPermissions = [
    PermissionId.Begin,
    PermissionId.Reset,
    PermissionId.Stats,
    PermissionId.Party,
    PermissionId.PartyNew,
    PermissionId.PartyInvite,
    PermissionId.PartyJoin,
    PermissionId.PartyExplore,
    PermissionId.PartyMove,
    PermissionId.Battle,
    PermissionId.BattleAttack,
    PermissionId.BattleOffhand,
    PermissionId.BattleBlock,
    PermissionId.Classes,
    PermissionId.Inventory,
    PermissionId.Help,
    PermissionId.Give,
    PermissionId.Equip,
].sort();

const testerPermissions = [
    PermissionId.ChannelId,
    PermissionId.Echo,
    PermissionId.Embed,
    PermissionId.Shutdown,
    PermissionId.SetPlayingGame,
].concat(playerPermissions).sort();

const adminPermissions = [
    PermissionId.Eval,
    PermissionId.SetRole,
    PermissionId.Grant,
].concat(testerPermissions).sort();

class PermissionRole{
    permissions:Array<PermissionId>;

    constructor(permissions:Array<PermissionId>){
        this.permissions = permissions;
    }

    has(permission:PermissionId){
        return this.permissions.indexOf(permission) != -1;
    }
}

export default class PermissionsService{
    _roles:Map<string,PermissionRole>;

    constructor(){
        this._roles = new Map();

        this._roles.set('player',new PermissionRole(playerPermissions));
        this._roles.set('tester',new PermissionRole(testerPermissions));        
        this._roles.set('admin',new PermissionRole(adminPermissions));
        this._roles.set('unknown',new PermissionRole([]));
    }   

    role(name:string):PermissionRole{
        const role = this._roles.get(name);

        if(!role){
            return this._roles.get('unknown');
        }

        return role;
    }
}



