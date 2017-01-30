import PermissionId from './PermissionIds';

//Hard coded permissions assigned to each role
const playerPermissions = [
    PermissionId.Begin,
    PermissionId.Reset,
    PermissionId.Stats,
    PermissionId.Party,
    PermissionId.PartyNew,
    PermissionId.Battle,
    PermissionId.BattleAttack,
    PermissionId.BattleOffhand,
    PermissionId.BattleBlock,
].sort();

const testerPermissions = [
    PermissionId.ChannelId,
    PermissionId.Echo,
    PermissionId.Embed,
    PermissionId.Shutdown,
    PermissionId.SetPlayingGame,
].concat(playerPermissions).sort();

const adminPermissions = [

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
    roles:Map<string,PermissionRole>;

    super(){
        this.roles = new Map();

        this.roles.set('player',new PermissionRole(playerPermissions));
        this.roles.set('tester',new PermissionRole(testerPermissions));        
        this.roles.set('admin',new PermissionRole(adminPermissions));
    }   

    role(name:string):PermissionRole{
        return this.roles.get(name);
    }
}



