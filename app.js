const Discord = require("discord.js");
const tokenfile = require("./tokenfile.json");
const botconfig = require("./botconfig.json")
const bot = new Discord.Client({disableEveryone: true})
// après 300000 milisecondes le role "Nouveaux" est supprimé
bot.on("ready", function(){
	console.log("le bot est en ligne")
})

bot.on("guildMemberAdd", async member =>{
	console.log(`${member.user.username} a rejoint le serveur !`)
    let newRole = member.guild.roles.find(`name`, "Nouveaux");
    if(!newRole) return console.log(`le role "Nouveaux" n'existe pas`)
    member.addRole(newRole)
    function supprNewRole() {
      setTimeout(function() {
        member.removeRole(newRole);
      }, 300000);
    }
    supprNewRole()
})

bot.on("message", async message =>{
	if(message.author.bot) return;
	if(message.content === "Commande qui ne sert a rien sauf faire un ping... et en plus elle ne retourne rien !"){
		
	}
})

bot.login(process.env.BOT_TOKEN)
