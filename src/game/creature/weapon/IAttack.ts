class AttackStep{
    message:string;
    duration:number;
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