const { 
  Client, 
  GatewayIntentBits, 
  Partials, 
  EmbedBuilder 
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

// 🔧 CONFIGURACIÓN
const mensajeID = "1485085670908231852";
const rolID = "1474797060929753140";

const canalStatusID = "1475887618427453605";
const canalReglasID = "1474775525347037315";
const canalNormasID = "1474798304838815897";
const canalAyudaID = "1474769890568044776";
const canalTicketsID = "1474770726358876371";

const canalUserID = "1485814561775812690";

// 🔥 VARIOS ROLES DE STAFF
const rolesStaff = [
  "1474796106557817072",
  "1482185528550887588",
  "1482193690423332884"
];

client.once('ready', () => {
  console.log(`✅ Bot listo como ${client.user.tag}`);
});


// =========================
// ✅ VERIFICACIÓN POR REACCIÓN
// =========================

client.on("messageReactionAdd", async (reaction, user) => {

  if (user.bot) return;

  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (error) {
      console.error(error);
      return;
    }
  }

  if (reaction.message.id === mensajeID && reaction.emoji.name === "✅") {

    const miembro = await reaction.message.guild.members.fetch(user.id);
    await miembro.roles.add(rolID);

  }
});

client.on("messageReactionRemove", async (reaction, user) => {

  if (user.bot) return;

  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (error) {
      console.error(error);
      return;
    }
  }

  if (reaction.message.id === mensajeID && reaction.emoji.name === "✅") {

    const miembro = await reaction.message.guild.members.fetch(user.id);
    await miembro.roles.remove(rolID);

  }
});


// =========================
// 💬 COMANDOS
// =========================

client.on("messageCreate", async (message) => {

  if (message.author.bot) return;

  // 🚀 CONNECT
  if (message.content === "!connect") {

    const embed = new EmbedBuilder()
      .setDescription(`🚀 Para conectarte al mejor server **LAFAMA RP**, entra desde acá <#${canalStatusID}>`)
      .setColor("Gold");

    return message.channel.send({ embeds: [embed] });
  }


  // 📜 REGLAS
  if (message.content === "!reglas") {

    const embed = new EmbedBuilder()
      .setDescription(`📜 Las reglas de **LAFAMA RP** están acá <#${canalReglasID}>\n\n📖 Normativas del servidor aquí <#${canalNormasID}>`)
      .setColor("Blue");

    return message.channel.send({ embeds: [embed] });
  }


  // ❓ AYUDA
  if (message.content === "!ayuda") {

    const embed = new EmbedBuilder()
      .setDescription(`❓ Si necesitas ayuda o tienes dudas puedes ir a <#${canalAyudaID}> y preguntar.\n\n🎟️ Si es algo más interno abre ticket en <#${canalTicketsID}>`)
      .setColor("Green");

    return message.channel.send({ embeds: [embed] });
  }


  // 🔍 USER INFO (SOLO STAFF Y SOLO CANAL)
  if (message.content.startsWith("!user")) {

    // SOLO CANAL
    if (message.channel.id !== canalUserID) {
      return message.reply("❌ Este comando solo se usa en el canal correspondiente.");
    }

    // 🔒 SOLO STAFF (VARIOS ROLES)
    if (!rolesStaff.some(rol => message.member.roles.cache.has(rol))) {
      return message.reply("❌ No tienes permisos para usar este comando.");
    }

    const args = message.content.split(" ");
    const userID = args[1];

    if (!userID) {
      return message.reply("❌ Debes colocar un ID.");
    }

    let miembro;
    let estado = "❌ No está en el servidor";

    try {
      miembro = await message.guild.members.fetch(userID);
      estado = "✅ Está en el servidor";
    } catch {}

    let usuario;
    try {
      usuario = await client.users.fetch(userID);
    } catch {
      return message.reply("❌ Usuario no encontrado.");
    }

    const embed = new EmbedBuilder()
      .setTitle("🔍 Información de Usuario")
      .setColor("Purple")
      .addFields(
        { name: "🆔 ID", value: userID },
        { name: "👤 Usuario", value: usuario.tag },
        { name: "📊 Estado", value: estado },
        { name: "📅 Cuenta creada", value: `<t:${Math.floor(usuario.createdTimestamp / 1000)}:F>` }
      );

    if (miembro) {
      embed.addFields({
        name: "📥 Ingresó al servidor",
        value: `<t:${Math.floor(miembro.joinedTimestamp / 1000)}:F>`
      });
    }

    message.channel.send({ embeds: [embed] });
  }

});

client.login(process.env.TOKEN);
