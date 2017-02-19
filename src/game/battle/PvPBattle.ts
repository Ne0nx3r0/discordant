import PlayerCharacter from '../creature/player/PlayerCharacter';

export default class PVP{
    id:number;
    pcs:Array<PlayerCharacter>;

    constructor(id:number,pc1:PlayerCharacter,pc2:PlayerCharacter){
        this.id = id;
        this.pcs = [pc1,pc2];
    }

    
}