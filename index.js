require("dotenv").config();
const {
  Client,
  GatewayIntentBits,
  Partials,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Channel]
});

client.once("ready", async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  // تسجيل أمر السلاش
  await client.application.commands.set([
    {
      name: "panel",
      description: "إرسال لوحة الرتب"
    }
  ]);
});

client.on("interactionCreate", async interaction => {

  // أمر السلاش /panel
  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === "panel") {

      const embed = new EmbedBuilder()
        .setColor("#2b2d31")
        .setImage("https://cdn.discordapp.com/attachments/1354053278081613824/1476625407540334592/Fate.png?ex=69a1ce13&is=69a07c93&hm=9a5c4149968382898cbc6ffd6d13bf38dd8a7de88e407bfedcdb9a072ca892c0&") // رابط الصورة
        .setFooter({ text: "VanctaCrew" });

      const row1 = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder().setCustomId("1").setLabel("1").setStyle(ButtonStyle.Secondary),
          new ButtonBuilder().setCustomId("2").setLabel("2").setStyle(ButtonStyle.Secondary),
          new ButtonBuilder().setCustomId("3").setLabel("3").setStyle(ButtonStyle.Success),
          new ButtonBuilder().setCustomId("4").setLabel("4").setStyle(ButtonStyle.Primary),
          new ButtonBuilder().setCustomId("5").setLabel("5").setStyle(ButtonStyle.Primary),
        );

      const row2 = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder().setCustomId("6").setLabel("6").setStyle(ButtonStyle.Danger),
          new ButtonBuilder().setCustomId("7").setLabel("7").setStyle(ButtonStyle.Secondary),
          new ButtonBuilder().setCustomId("8").setLabel("8").setStyle(ButtonStyle.Secondary),
          new ButtonBuilder().setCustomId("9").setLabel("9").setStyle(ButtonStyle.Secondary),
          new ButtonBuilder().setCustomId("10").setLabel("10").setStyle(ButtonStyle.Secondary),
        );

      return interaction.reply({
        embeds: [embed],
        components: [row1, row2]
      });
    }
  }

  // عند الضغط على زر
  if (interaction.isButton()) {
    const role = interaction.guild.roles.cache.find(r => r.name === interaction.customId);

    if (!role) {
      return interaction.reply({ content: "❌ الرتبة غير موجودة", ephemeral: true });
    }

    await interaction.member.roles.add(role);

    return interaction.reply({ content: `✅ تم إعطائك رتبة ${role.name}`, ephemeral: true });
  }
});

client.login(process.env.TOKEN);
