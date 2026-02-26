const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  Events
} = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

// حط هنا كل الرولات الخاصة بالمستويات
const levelRoles = [
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
];

client.once(Events.ClientReady, async () => {
  const channel = await client.channels.fetch('1349906852909027399'); // ايدي الروم

  const embed = new EmbedBuilder()
    .setColor('#2b2d31')
    .setImage('file:///C:/Users/EdarhNet/OneDrive/%D8%B3%D8%B7%D8%AD%20%D8%A7%D9%84%D9%85%D9%83%D8%AA%D8%A8/Fate.png'); // رابط الصورة

  const selectMenu = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('level_select')
      .setPlaceholder('اختر اللون المناسب لك')
      .addOptions(
        { label: '1', value: 'ROLE_ID_1' },
        { label: '2', value: 'ROLE_ID_2' },
        { label: '3', value: 'ROLE_ID_3' },
        { label: '4', value: 'ROLE_ID_4' },
        { label: '5', value: 'ROLE_ID_5' },
        { label: '6', value: 'ROLE_ID_6' },
        { label: '7', value: 'ROLE_ID_7' },
        { label: '8', value: 'ROLE_ID_8' },
        { label: '9', value: 'ROLE_ID_9' },
        { label: '10', value: 'ROLE_ID_10' }
      )
  );

  await channel.send({
    embeds: [embed],
    components: [selectMenu]
  });
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isStringSelectMenu()) return;

  const member = interaction.member;
  const selectedRoleId = interaction.values[0];

  // يشيل أي رول من نفس القائمة
  for (const roleId of levelRoles) {
    if (member.roles.cache.has(roleId)) {
      await member.roles.remove(roleId);
    }
  }

  // يعطي الرول الجديد
  await member.roles.add(selectedRoleId);

  await interaction.reply({
    content: 'تم تحديث رولك ✅',
    ephemeral: true
  });
});

client.login(process.env.TOKEN);
