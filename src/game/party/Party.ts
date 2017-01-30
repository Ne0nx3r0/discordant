import PlayerCharacter from '../creature/player/PlayerCharacter';


export default class Party{
    leader:PlayerCharacter;
    members:Map<string,PlayerCharacter>;
    channel:string;

    constructor(leader:PlayerCharacter,channel:string){
        this.leader = leader;
        this.channel = channel;
    }
}

/*create invite
const channel = '123123';

const options = {
    maxAge: 60,
    maxUses: 1,
    temporary: true,
    xkcd: true,
};

client.createInvite(channel,options,callback);

function callback(error,invite){

}
*/

/*delete invite
invite.delete(callback);

function callback(error){

}
*/

/*create channel
client.createChannel(server,channelName,'text',callback)

function callback(error,channel){

}
*/

/*delete channel
client.deleteChannel(channelId,callback);

function callback(error){

}
*/

/*change channel permissions
const options = {
    // general
    administrator,
    createInstantInvite,
    kickMembers,
    banMembers,
    manageRoles,
    managePermissions,
    manageChannels,
    manageChannel,
    manageServer,
    changeNickname,
    manageNicknames,
    // text
    readMessages: true,
    sendMessages: true,
    sendTTSMessages: true,
    manageMessages,
    embedLinks,
    attachFiles,
    readMessageHistory,
    mentionEveryone,
};

client.overwritePermissions(channel, roleOrUserObj, options, callback)

function callback(error){

}
*/