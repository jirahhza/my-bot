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
  imageUrl: 'file:///C:/Users/EdarhNet/OneDrive/%D8%B3%D8%B7%D8%AD%20%D8%A7%D9%84%D9%85%D9%83%D8%AA%D8%A8/Fate.png',
  roleIds: [
    'ROLE_ID_1',
    'ROLE_ID_2',
    'ROLE_ID_3',
    'ROLE_ID_4',
    'ROLE_ID_5',
    'ROLE_ID_6',
    'ROLE_ID_7',
    'ROLE_ID_8',
    'ROLE_ID_9',
    'ROLE_ID_10'
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
