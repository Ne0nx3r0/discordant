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
    PermissionId.Unequip,
    PermissionId.Use,
    PermissionId.Challenge,
    PermissionId.Item,
    PermissionId.Echo,
    PermissionId.Embed,
    PermissionId.Grant,
].sort();

const testerPermissions = [
    PermissionId.ChannelId,
    PermissionId.Shutdown,
    PermissionId.SetPlayingGame,
].concat(playerPermissions).sort();

const adminPermissions = [
].concat(testerPermissions).sort();

export class PermissionRole{
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
    }

    isRole(name:string){
        return this._roles.has(name);
    }

    getRoleNames(){
        const roles = [];

        this._roles.forEach(function(role,name){
            roles.push(name);
        });

        return roles;
    }

    getRole(name:string):PermissionRole{
        const role = this._roles.get(name);

        return role;
    }
}



