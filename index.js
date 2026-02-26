const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  Events,
  PermissionsBitField
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

/* ========= الاعدادات ========= */

const CONFIG = {
  channelId: '1349906852909027399',
  imageUrl: 'https://i.postimg.cc/wx4NMvbs/Fate.png',
  roleIds: [
    '1476625887712510134', // ROLE_ID_1
    '1476631730730434600', // ROLE_ID_2
    '1476631739957776505', // ROLE_ID_3
    '1476631747025309930', // ROLE_ID_4
    '1476631754860134622', // ROLE_ID_5
  ]
};

/* ========= عند تشغيل البوت ========= */

client.once(Events.ClientReady, async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  const channel = await client.channels.fetch(CONFIG.channelId).catch(() => null);
  if (!channel) return console.log('❌ لم يتم العثور على الروم');

  const embed = new EmbedBuilder()
    .setColor('#2b2d31')
    .setImage(CONFIG.imageUrl);

  const selectMenu = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('level_select')
      .setPlaceholder('اختر اللون المناسب لك')
      .addOptions(
        CONFIG.roleIds.map((id, index) => ({
          label: `${index + 1}`,
          value: id
        }))
      )
  );

  await channel.send({
    embeds: [embed],
    components: [selectMenu]
  });
});

/* ========= عند اختيار رول ========= */

client.on('interactionCreate', async interaction => {
  if (!interaction.isStringSelectMenu()) return;
  if (interaction.customId !== 'level_select') return;

  const member = interaction.member;
  const guild = interaction.guild;
  const selectedRoleId = interaction.values[0];

  try {
    const role = guild.roles.cache.get(selectedRoleId);
    if (!role) return interaction.reply({ content: '❌ الرول غير موجود', ephemeral: true });

    await member.roles.remove(member.roles.cache.filter(r => CONFIG.roleIds.includes(r.id)));
    await member.roles.add(role);

    // الرسالة تكون بين العضو والبوت فقط
    await interaction.reply({
      content: `**تم تغير اللون .** ${role.name}`,
      ephemeral: true
    });

  } catch (err) {
    console.error(err);
    if (!interaction.replied)
      await interaction.reply({ content: '❌ حصل خطأ أثناء تحديث الرول', ephemeral: true });
  }
});

client.login(process.env.TOKEN);



