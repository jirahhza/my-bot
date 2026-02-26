require("dotenv").config();
const {
  Client,
  GatewayIntentBits,
  Partials,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder
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

  // ===== أوامر السلاش =====
  if (interaction.isChatInputCommand()) {

    if (interaction.commandName === "panel") {

      const row1 = new ActionRowBuilder();
      const row2 = new ActionRowBuilder();

      // الصف الأول (1-5)
      for (let i = 1; i <= 5; i++) {
        row1.addComponents(
          new ButtonBuilder()
            .setCustomId(`${i}`)
            .setLabel(`${i}`)
            .setStyle(ButtonStyle.Primary)
        );
      }

      // الصف الثاني (6-10)
      for (let i = 6; i <= 10; i++) {
        row2.addComponents(
          new ButtonBuilder()
            .setCustomId(`${i}`)
            .setLabel(`${i}`)
            .setStyle(ButtonStyle.Primary)
        );
      }

      const colors = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("colors")
          .setPlaceholder("اختر لونك")
          .addOptions([
            { label: "Red", value: "Red" },
            { label: "Blue", value: "Blue" },
            { label: "Green", value: "Green" }
          ])
      );

      return interaction.reply({
        content: "🎭 اختر مستواك أو لونك:",
        components: [row1, row2, colors]
      });
    }
  }

  // ===== الأزرار =====
  if (interaction.isButton()) {
    const role = interaction.guild.roles.cache.find(r => r.name === interaction.customId);

    if (!role)
      return interaction.reply({ content: "❌ الرتبة غير موجودة", ephemeral: true });

    await interaction.member.roles.add(role);
    return interaction.reply({ content: `✅ تم إعطائك رتبة ${role.name}`, ephemeral: true });
  }

  // ===== قائمة الألوان =====
  if (interaction.isStringSelectMenu()) {
    const role = interaction.guild.roles.cache.find(r => r.name === interaction.values[0]);

    if (!role)
      return interaction.reply({ content: "❌ اللون غير موجود", ephemeral: true });

    await interaction.member.roles.add(role);
    return interaction.reply({ content: `🎨 تم اختيار لون ${role.name}`, ephemeral: true });
  }

});

client.login(process.env.TOKEN);
