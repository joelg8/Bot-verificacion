const { Client, GatewayIntentBits, Partials } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

// 🔧 CAMBIA ESTO
const mensajeID = "1485085670908231852";
const rolID = "1474797060929753140";

client.once('ready', () => {
  console.log(`✅ Bot listo como ${client.user.tag}`);
});

// CUANDO REACCIONAN
client.on("messageReactionAdd", async (reaction, user) => {

  if (user.bot) return;

  // Evita errores con mensajes no cargados
  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (error) {
      console.error("Error al obtener la reacción:", error);
      return;
    }
  }

  if (reaction.message.id === mensajeID && reaction.emoji.name === "✅") {

    const miembro = await reaction.message.guild.members.fetch(user.id);
    await miembro.roles.add(rolID);

  }
});

// CUANDO QUITAN REACCIÓN
client.on("messageReactionRemove", async (reaction, user) => {

  if (user.bot) return;

  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (error) {
      console.error("Error al obtener la reacción:", error);
      return;
    }
  }

  if (reaction.message.id === mensajeID && reaction.emoji.name === "✅") {

    const miembro = await reaction.message.guild.members.fetch(user.id);
    await miembro.roles.remove(rolID);

  }
});

client.login(process.env.TOKEN);