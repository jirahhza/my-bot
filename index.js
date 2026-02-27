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
  channelId: '1476303102142316596',
  imageUrl: 'https://i.postimg.cc/yx4g0f2z/IMG-0269.png',
  roleIds: [
    '1476302952498200617', // ROLE_ID_1
    '1476302950115704964', // ROLE_ID_2
    '1476302948597498068', // ROLE_ID_3
    '1476302947204862022', // ROLE_ID_4
    '1476302945833320621', // ROLE_ID_5
    '1476302944583286835', // ROLE_ID_6
    '1476302943430119537', // ROLE_ID_7
    '1476302941727101081', // ROLE_ID_8
    '1476302940313747589', // ROLE_ID_9
    '1476302938824642645', // ROLE_ID_10
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










