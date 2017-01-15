class AttackStep{
    message:string;
    cooldown:number;
}

class Attack{
    title:string;
    steps:Array<AttackStep>;
}

class Weapon{
    id:number;
    title:string;
    description:string;
    attacks:Map<string,Attack>;
}