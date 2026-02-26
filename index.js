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
const CONFIG = {
  roleIds: [
    '1476625887712510134', // ROLE_ID_1
    '1476631730730434600', // ROLE_ID_2
    '1476631739957776505', // ROLE_ID_3
    '1476631747025309930', // ROLE_ID_4
    '1476631754860134622', // ROLE_ID_5
    '987654321098765432', // ROLE_ID_6
    '987654321098765432', // ROLE_ID_7
    '987654321098765432', // ROLE_ID_8
    '987654321098765432', // ROLE_ID_9
    '987654321098765432', // ROLE_ID_10
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

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isStringSelectMenu()) return;
  if (interaction.customId !== 'level_select') return;

  const member = interaction.member;
  const guild = interaction.guild;
  const selectedRoleId = interaction.values[0];

  const botMember = guild.members.me;

  // تأكد من صلاحية Manage Roles
  if (!botMember.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
    return interaction.reply({
      content: '❌ البوت ما عنده صلاحية Manage Roles',
      ephemeral: true
    });
  }

  const role = guild.roles.cache.get(selectedRoleId);
  if (!role) {
    return interaction.reply({
      content: '❌ الرول غير موجود',
      ephemeral: true
    });
  }

  if (role.position >= botMember.roles.highest.position) {
    return interaction.reply({
      content: '❌ رتبة البوت لازم تكون أعلى من الرتب',
      ephemeral: true
    });
  }

  try {
    // إزالة كل رولات المستويات السابقة
    const rolesToRemove = member.roles.cache.filter(r =>
      CONFIG.roleIds.includes(r.id)
    );

    await member.roles.remove(rolesToRemove);

    // إضافة الرول الجديد
    await member.roles.add(role);

    await interaction.reply({
      content: `✅ تم تحديث مستواك إلى ${role.name}`,
      ephemeral: true
    });

  } catch (err) {
    console.error(err);
    await interaction.reply({
      content: '❌ حصل خطأ أثناء تحديث الرول',
      ephemeral: true
    });
  }
});

client.login(process.env.TOKEN);


