const fs = require("fs");
const {
    Client,
    GatewayIntentBits,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    InteractionType
} = require("discord.js");
const token = process.env.TOKEN

// ================== تشغيل العميل ==================
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
});

// ================== الإعدادات ==================
const LOGS = {
    REPORTS_LOG: "1372556238436700202" // آيدي روم التقارير
};

const FILES = {
    PTS: "./points.json"
};

const pendingReports = new Map();

// ================== تحميل النقاط ==================
let points = fs.existsSync(FILES.PTS)
    ? JSON.parse(fs.readFileSync(FILES.PTS, "utf8"))
    : {};

const savePoints = () => {
    fs.writeFileSync(FILES.PTS, JSON.stringify(points, null, 2));
};

// ================== Ready ==================
client.once("ready", () => {
    console.log(`✅ البوت شغال: ${client.user.tag}`);
});

// ================== أوامر الكتابة ==================
client.on("messageCreate", async (msg) => {
    if (msg.author.bot) return;

    // فتح لوحة التقارير
    if (msg.content === "!police_panel") {
        const embed = new EmbedBuilder()
            .setTitle("🚨 نظام التقارير الجنائية")
            .setDescription("اضغط الزر لرفع تقرير على مجرم")
            .setColor("Blue");

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("report")
                .setLabel("📄 رفع تقرير")
                .setStyle(ButtonStyle.Danger)
        );

        return msg.channel.send({ embeds: [embed], components: [row] });
    }

    // استقبال صورة التقرير
    if (
        pendingReports.has(msg.author.id) &&
        msg.attachments.size > 0
    ) {
        const data = pendingReports.get(msg.author.id);

        const logChannel = await client.channels.fetch(LOGS.REPORTS_LOG).catch(() => null);
        if (!logChannel) return;

        const embed = new EmbedBuilder()
            .setTitle("🚨 تقرير جنائي")
            .setColor("Red")
            .addFields(
                { name: "👮 العسكري", value: `<@${msg.author.id}>` },
                { name: "🆔 البصمة", value: data.p },
                { name: "👤 الاسم", value: data.n },
                { name: "⚖️ التهمة", value: data.c },
                { name: "📄 المخالفة", value: data.v },
                { name: "⏳ مدة السجن", value: data.s }
            )
            .setImage(msg.attachments.first().url)
            .setTimestamp();

        await logChannel.send({ embeds: [embed] });

        // نقاط
        points[msg.author.id] = (points[msg.author.id] || 0) + 5;
        savePoints();

        // حذف الصورة
        await msg.delete().catch(() => {});

        pendingReports.delete(msg.author.id);

        const done = await msg.channel.send("✅ تم إرسال التقرير بنجاح");
        setTimeout(() => done.delete().catch(() => {}), 4000);
    }
});

// ================== التفاعلات ==================
client.on("interactionCreate", async (i) => {

    // زر التقرير
    if (i.isButton() && i.customId === "report") {
        const modal = new ModalBuilder()
            .setCustomId("rep_modal")
            .setTitle("🚨 تقرير جنائي");

        modal.addComponents(
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId("p")
                    .setLabel("البصمة")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
            ),
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId("n")
                    .setLabel("اسم المتهم")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
            ),
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId("c")
                    .setLabel("التهمة")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
            ),
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId("v")
                    .setLabel("المخالفة")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
            ),
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId("s")
                    .setLabel("مدة السجن")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
            )
        );

        return i.showModal(modal);
    }

    // استلام النموذج
    if (i.type === InteractionType.ModalSubmit && i.customId === "rep_modal") {
        pendingReports.set(i.user.id, {
            p: i.fields.getTextInputValue("p"),
            n: i.fields.getTextInputValue("n"),
            c: i.fields.getTextInputValue("c"),
            v: i.fields.getTextInputValue("v"),
            s: i.fields.getTextInputValue("s"),
        });

        return i.reply({
            content: "📸 أرسل صورة المتهم الآن في نفس الروم",
            ephemeral: true
        });
    }
});

// ================== تشغيل ==================
console.log("TOKEN:", process.env.TOKEN);
client.login(process.env.TOKEN);

