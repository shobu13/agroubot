/*
* Bot créer par Shobu et O-Yama, libre distribution autorisée.
*
* Version 1.0
*
*/

const cron = require("node-cron");
const Discord = require("discord.js");
const tokenfile = require("./tokenfile.json");
const botconfig = require("./botconfig.json");

const BOT = new Discord.Client({disableEveryone: true});
const COMMAND_PREFIX = '!';
const GUILD_ID = '';
const GENERAL_ID = '';
const CHECK_TIME = 60000;
const IDLE_TIME = 10;
const NEW_ROLE_NAME = 'Nouveau';

let EMOJI_AGROU;
let EMOJI_NIQUE;

let ACTIVITY;
let ACTIVITY_FLIP_FLOP = false;
let GUILD;
let USERS_TIMESTAMP = new Map();

BOT.on("ready", function () {
    GUILD = BOT.guilds.get(GUILD_ID);
    EMOJI_AGROU = GUILD.emojis.find("name", "NBAgrou");
    EMOJI_NIQUE = GUILD.emojis.find("name", "NBNiquetoi");

    const SOUTIENT_HEURE = '20';
    const SOUTIENT_MINUTE = '30';
    const SOUTIENT_MSG = `Vous pouvez chaque jour soutenir Need Backup financièrement contre un peu de votre temps en regardant quelques pubs sur Utip ${EMOJI_AGROU} \n` +
        `https://www.utip.io/needbackup`;

    const CONTRIBUTION_HEURE = '17';
    const CONTRIBUTION_MINUTE = '00';
    const CONTRIBUTION_JOUR = '*/3';
    const CONTRIBUTION_MSG = `Si vous avez des idées d'améliorations, n'hésitez pas à MP nos chers administrateurs !${EMOJI_AGROU}`;

    BOT.user.setActivity("!help");

    console.log("le bot est en ligne");
    check_user_timestamp();
    console.log(GUILD.name);

    console.log("cronjob");
    cron.schedule(SOUTIENT_MINUTE + " " + SOUTIENT_HEURE + " * * *", function () {
        console.log("message promo");
        GUILD.channels.get(GENERAL_ID).send(SOUTIENT_MSG);
    });

    cron.schedule(CONTRIBUTION_MINUTE + " " + CONTRIBUTION_HEURE + " " + CONTRIBUTION_JOUR + " * *", function () {
        console.log("message contrib");
        GUILD.channels.get(GENERAL_ID).send(CONTRIBUTION_MSG);
    });

    cron.schedule("*/30 * * * * *", function () {
        console.log("changement activité");
        console.log("ACTIVITY =", ACTIVITY);
        if (ACTIVITY_FLIP_FLOP === true) {
            BOT.user.setActivity("!help");
            ACTIVITY_FLIP_FLOP = false;
        }
        else {
            BOT.user.setActivity(ACTIVITY);
            ACTIVITY_FLIP_FLOP = true;
        }
    });
});

BOT.on("guildMemberAdd", async member => {
    console.log(`${member.user.username} a rejoint le serveur !`);
    USERS_TIMESTAMP.set(member.user.id, Date.now());
    let newRole = member.guild.roles.find(`name`, NEW_ROLE_NAME);
    if (!newRole) return console.log(`le role ` + NEW_ROLE_NAME + `n'existe pas`);
    member.addRole(newRole);
    member.Channel('228605170592776192');
});

BOT.on("message", async message => {
    if (message.channel.type === 'dm') {
        let message_time = timestamp_to_time(message.createdTimestamp);
        let message_content = message.content;
        let message_author = message.author;
        let message_attachement = message.attachments;
        let message_attachement_id = message_attachement.keyArray()[0];
        console.log(message_time, "-", message_content, "-", message_author.username);
        if (message.content[0] === COMMAND_PREFIX)
            exec_admin_commande(message);
        if (message_attachement_id !== undefined) {
            console.log("\t", "Attachement info : ", "\n\r");
            console.log("\t", message_attachement_id);
            console.log("\t", message_attachement.get(message_attachement_id).url);
        }
    }
    if (message.channel.type === 'text') {
        if (message.guild.id === GUILD_ID) {
            let message_time = timestamp_to_time(message.createdTimestamp);
            let message_content = message.content;
            let message_author = message.author;
            let message_channel = message.channel;
            let message_attachement = message.attachments;
            let message_attachement_id = message_attachement.keyArray()[0];
            console.log(message_channel.name, "-", message_time, "-", message_content, "-", message_author.username);
            if (message.content[0] === COMMAND_PREFIX)
            {
                exec_command(message);
                exec_admin_commande(message);
            }

            if (message_attachement_id !== undefined) {
                console.log("\t", "Attachement info : ", "\n\r");
                console.log("\t", message_attachement_id);
                console.log("\t", message_attachement.get(message_attachement_id).url);
            }
            if (message.author.bot) return;
            if (message.content === "Commande qui ne sert a rien sauf faire un ping... et en plus elle ne retourne rien !") {
            }
        }
    }
});

BOT.login(tokenfile.token);

function exec_command(message) {
    console.log("exec commande");
    let commande_raw = get_char_between(message.content, 1).split(" ");
    let commande = commande_raw[0];
    commande_raw.shift();
    let arguments = commande_raw;
    console.log("\t", "commande=", commande);
    if (commande === 'users_timestamp') {
        console.log("\t", "users_timestamp command");
        console.log(USERS_TIMESTAMP);
    }
    if (commande === 'agrou') {
        console.log("agrou !");
        GUILD.channels.get(GENERAL_ID).send(`Agrougrou ! ${EMOJI_AGROU}`);
    }
    if (commande === 'bonjour') {
        console.log("nique toi");
        GUILD.channels.get(GENERAL_ID).send('<:NBNiquetoi:231846299710914567>');
    }
    if (commande === '0111001101100101011011100111001100100000011001000110010100100000011011000110000100100000011101100110100101100101') {
        GUILD.channels.get(GENERAL_ID).send(`scaimiateairaelxly ${EMOJI_AGROU}`);
    }
    if (commande === 'help') {
        console.log("page d'aide");
        message.author.send(
            '>**!agrou** : provoque la colère du bot\r' +
            '>**!bonjour** : dit bonjour au bot, il vous répondra à sa façon\r' +
            '>**!0111001101100101011011100111001100100000011001000110010100100000011011000110000100100000011101100110100101100101** : 0110100001100001011011000110011000100000011011000110100101100110011001010010000000110011\r'
        );
    }
}

function exec_admin_commande(message) {
    console.log("exec ADMIN commande");
    let commande_raw = get_char_between(message.content, 1).split(" ");
    let commande = commande_raw[0];
    commande_raw.shift();
    let arguments = commande_raw;
    console.log("\t", "commande=", commande);

    let admin_id_array = GUILD.roles.get('216542507415109633').members.keyArray();
    let modo_id_array = GUILD.roles.get('216542995426574336').members.keyArray();
    let message_author_id = GUILD.member(message.author).id;
    console.log(typeof admin_id_array);
    if (find_in_array(admin_id_array, message_author_id) || find_in_array(modo_id_array, message_author_id) || message_author_id === '189806101506686976') {
        if (commande === 'say') {
            GUILD.channels.get(GENERAL_ID).send(arguments.join(" "));
        }
        if (commande === 'activity') {
            ACTIVITY = arguments.join(" ");
            BOT.user.setActivity(ACTIVITY);
        }

        if (commande === 'help') {
            console.log("page d'aide");
            message.author.send(
                '>**!say** : permet de faire parler le bot\r'
            );
        }
    }
}

function timestamp_to_time(timestamp) {
    let date = new Date(timestamp);
// Hours part from the timestamp
    let hours = date.getHours();
// Minutes part from the timestamp
    let minutes = "0" + date.getMinutes();
// Seconds part from the timestamp
    let seconds = "0" + date.getSeconds();

// Will display time in 10:30:23 format
    return formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
}

function check_user_timestamp() {
// traitement
    console.log("check users timestamp");
    let new_users_ids = USERS_TIMESTAMP.keys();
    let id = new_users_ids.next().value;
    while (id !== undefined) {
        let timestamp = new Date(USERS_TIMESTAMP.get(id));
        let timestamp_now = new Date(Date.now());
        let delta_time = new Date(timestamp_now - timestamp);
        console.log("\t", id);
        console.log("\t delta= ", `${delta_time.getMinutes()} mn et ${delta_time.getSeconds()} s`);
        if (delta_time.getMinutes() >= IDLE_TIME) {
            let member = BOT.guilds.get(GUILD_ID).members.get(id);
            member.removeRole(GUILD.roles.find(`name`, NEW_ROLE_NAME));
            USERS_TIMESTAMP.delete(id);
        }

        id = new_users_ids.next().value;
    }
    /* rappel après x secondes = x*1000 millisecondes */
    setTimeout(check_user_timestamp, CHECK_TIME);

}

function get_char_between(string, pos1, pos2 = -1) {
    if (pos2 === -1)
        pos2 = string.length;
    if (pos2 <= pos1 || pos2 > string.length)
        return -1;
    else {
        let new_string = '';
        for (let i = pos1; i <= pos2; i++) {
            if (string[i] !== undefined)
                new_string += string[i];
        }
        return new_string;
    }
}

function find_in_array(array, iteration) {
    let found = array.find(function (element) {
        return element === iteration
    });
    return found !== undefined;
}