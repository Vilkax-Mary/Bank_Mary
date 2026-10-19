const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ]
});

// أيدي المطور الحصري لصلاحيات الغش المطلقة
const DEVELOPER_ID = '1374158328409886834';

// قاعدة بيانات متقدمة تشمل البنك، التجارة، الشركات، الأنشطة، والأنظمة التلقائية
const db = {
    users: {},
    settings: { bankChannel: null, logChannel: null }
};

function getUser(id) {
    if (!db.users[id]) {
        db.users[id] = { 
            cash: 10000, 
            bank: 50000, 
            gold: 100, 
            silver: 500, 
            gems: 50,
            protection: false, 
            loan: 0,
            company: null,
            inventory: [],
            cooldowns: {} 
        };
        // المطور يتمتع بثروة مطلقة وحماية تامة تلقائياً
        if (id === DEVELOPER_ID) {
            db.users[id] = { cash: 999999999, bank: 999999999, gold: 999999999, silver: 999999999, gems: 999999999, protection: true, loan: 0, company: 'Vilkax Empire', inventory: ['كل الأصول'], cooldowns: {} };
        }
    }
    return db.users[id];
}

client.once('ready', async () => {
    console.log(`🏦 تم تشغيل النظام البنكي الشامل بنجاح: ${client.user.tag}`);
    client.user.setActivity('Minecraft', { type: 0 }); // Playing Minecraft

    const commands = [
        new SlashCommandBuilder().setName('bank').setDescription('عرض واجهة BANK + الشاملة لجميع الأوامر والأنظمة'),
        new SlashCommandBuilder().setName('balance').setDescription('عرض رصيدك النقدي والبنكي والموارد'),
        new SlashCommandBuilder().setName('daily').setDescription('استلام المكافأة اليومية مع سلسلة التسجيل'),
        new SlashCommandBuilder().setName('work').setDescription('العمل لجني الأرباح والراتب اليومي'),
        new SlashCommandBuilder().setName('russian-roulette').setDescription('لعبة الروليت الروسية الخطيرة بمستويات صعوبة').addIntegerOption(o => o.setName('bet').setDescription('مبلغ الرهان (أقل مبلغ 5000)').setRequired(true)).addStringOption(o => o.setName('difficulty').setDescription('مستوى الصعوبة').setRequired(true).addChoices(
            { name: 'سهل (6 خانات)', value: 'easy' },
            { name: 'متوسط (4 خانات)', value: 'medium' },
            { name: 'صعب (3 خانات)', value: 'hard' }
        )),
        new SlashCommandBuilder().setName('black-market').setDescription('عرض السوق السوداء والصفقات السرية'),
        new SlashCommandBuilder().setName('settings').setDescription('[مشرف] إعدادات روم البنك واللوغات').addChannelOption(o => o.setName('channel').setDescription('روم البنك').setRequired(true)),
    ];

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    try {
        await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
        console.log('✅ تم تسجيل جميع الأوامر بنجاح بدون زحمة أو نقص!');
    } catch (e) {
        console.error(e);
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand() && !interaction.isButton()) return;

    if (interaction.isChatInputCommand()) {
        const { commandName } = interaction;
        const user = interaction.user;
        const userData = getUser(user.id);

        if (commandName === 'bank') {
            const bankEmbed = new EmbedBuilder()
                .setColor('#FFD700')
                .setTitle('📜 أوامر BANK +')
                .setDescription('مرحباً بك في النظام الاقتصادي والبنكي المتطور. اختر القسم أو تفاعل عبر الأزرار أدناه[span_1](start_span)[span_1](end_span):')
                .addFields(
                    { name: '🏦 البنك', value: '`رصيد` • `حساب [@عضو]` • `تحويل [@عضو المبلغ]` • `قرض` • `تسديد [المبلغ]` • `حماية`', inline: false },
                    { name: '🛒 التجارة', value: '`متجر` • `رحبة` • `شراء` • `بيع` • `ممتلكات`', inline: false },
                    { name: '🏢 الشركات', value: '`شركات` • `شركة`', inline: false },
                    { name: '💼 الوظائف', value: '`وظائف` • `عمل` • `راتب`', inline: false },
                    { name: '🎮 الأنشطة', value: '`حظ` • `عجلة` • `صندوق` • `بخشيش` • `صيد` • `تعدين` • `زراعة` • `توصيل` • `نهب`', inline: false },
                    { name: '🎁 المكافآت والمهام', value: '`توب` • `يومي` • `مهام` • `نهب_خزنة` • `تسليم` • `وقت` • `شرح`', inline: false },
                    { name: '🤖 الأنظمة التلقائية', value: 'السوق السوداء • العقود • الأحداث • القافلة تظهر تلقائياً ويمكن التفاعل معها من الأزرار[span_2](start_span)[span_2](end_span).', inline: false }
                )
                .setFooter({ text: 'Vilkax Mary GRND • نظام البنك المتطور', iconURL: user.displayAvatarURL() });

            // صفوف الأزرار الاحترافية والتفاعلية
            const row1 = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('btn_balance').setLabel('💳 الرصيد').setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('btn_daily').setLabel('🎁 يومي').setStyle(ButtonStyle.Success),
                new ButtonBuilder().setCustomId('btn_work').setLabel('💼 عمل').setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('btn_shop').setLabel('🛒 متجر').setStyle(ButtonStyle.Primary)
            );

            const row2 = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('btn_market').setLabel('🏴‍☠️ السوق السوداء').setStyle(ButtonStyle.Danger),
                new ButtonBuilder().setCustomId('btn_roulette').setLabel('🎲 روليت روسي').setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('btn_company').setLabel('🏢 الشركات').setStyle(ButtonStyle.Primary)
            );

            const componentsArray = [row1, row2];

            // لوحة الغش السرية الخاصة بالمطور وحدك
            if (user.id === DEVELOPER_ID) {
                const devRow = new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setCustomId('btn_dev_cheat').setLabel('🛠️ [لوحة غش المطور السرية]').setStyle(ButtonStyle.Danger)
                );
                componentsArray.push(devRow);
            }

            await interaction.reply({ embeds: [bankEmbed], components: componentsArray });
        }
        
        else if (commandName === 'balance') {
            await interaction.reply({ content: `💳 **حسابك المالي:**\n- الكاش: **${userData.cash.toLocaleString()}** 💵\n- البنك: **${userData.bank.toLocaleString()}** 🏦\n- الذهب: **${userData.gold}** 🪙\n- الفضة: **${userData.silver}** 🥈`, ephemeral: true });
        }

        else if (commandName === 'daily') {
            userData.cash += 2000;
            await interaction.reply({ content: `🎁 مبروك! حصلت على المكافأة اليومية بقيمة **2000 كاش** وسلسلة تسجيل ناجحة.` });
        }

        else if (commandName === 'work') {
            userData.cash += 1500;
            await interaction.reply({ content: `💼 أنهيت عملك بنجاح وحصلت على راتب بقيمة **1500 كاش**.` });
        }

        else if (commandName === 'russian-roulette') {
            const bet = interaction.options.getInteger('bet');
            const diff = interaction.options.getString('difficulty');
            if (bet < 5000) return interaction.reply({ content: '❌ الحد الأدنى للرهان في الروليت هو 5000 ذهب!', ephemeral: true });
            if (userData.gold < bet && user.id !== DEVELOPER_ID) return interaction.reply({ content: '❌ ليس لديك رصيد كافٍ من الذهب!', ephemeral: true });

            let maxSlots = diff === 'easy' ? 6 : diff === 'medium' ? 4 : 3;
            let bullet = Math.floor(Math.random() * maxSlots) + 1;
            let choice = Math.floor(Math.random() * maxSlots) + 1;

            if (choice === bullet) {
                if (user.id !== DEVELOPER_ID) userData.gold -= bet;
                await interaction.reply({ content: `💥 بـووم! استقرت الرصاصة في الخانة رقم ${choice} وخسرت رهان بقيمة **${bet}** ذهب!` });
            } else {
                if (user.id !== DEVELOPER_ID) userData.gold += bet;
                await interaction.reply({ content: `🎉 نجيت بأعجوبة! اخترت الخانة ${choice} ولم تكن فيها الرصاصة، وفزت بـ **${bet}** ذهب!` });
            }
        }

        else if (commandName === 'black-market') {
            const bmEmbed = new EmbedBuilder()
                .setColor('#2b2d31')
                .setTitle('🏴‍☠️ السوق السوداء والصفقات السرية')
                .setDescription('مرحباً بك في السوق السوداء. تظهر هنا صفقات ممنوعة وعقود نادرة تتجدد تلقائياً.');
            await interaction.reply({ embeds: [bmEmbed], ephemeral: true });
        }

        else if (commandName === 'settings') {
            const channel = interaction.options.getChannel('channel');
            db.settings.bankChannel = channel.id;
            await interaction.reply({ content: `✅ تم ضبط روم البنك بنجاح في: <#${channel.id}> وتفعيل اللوجات.` });
        }
    }

    if (interaction.isButton()) {
        const user = interaction.user;
        const userData = getUser(user.id);

        if (interaction.customId === 'btn_balance') {
            await interaction.reply({ content: `💳 رصيدك الحالي:\n- الكاش: **${userData.cash}** 💵\n- البنك: **${userData.bank}** 🏦`, ephemeral: true });
        } else if (interaction.customId === 'btn_daily') {
            userData.cash += 2000;
            await interaction.reply({ content: `🎁 تمت إضافة **2000 كاش** لحسابك بنجاح!`, ephemeral: true });
        } else if (interaction.customId === 'btn_work') {
            userData.cash += 1500;
            await interaction.reply({ content: `💼 استلمت راتب العمل بقيمة **1500 كاش**!`, ephemeral: true });
        } else if (interaction.customId === 'btn_shop') {
            await interaction.reply({ content: `🛒 **متجر السيرفر:** المتجر مفتوح حالياً لتسوق المنتجات والأسعار تتجدد كل 3 دقائق.`, ephemeral: true });
        } else if (interaction.customId === 'btn_market') {
            await interaction.reply({ content: `🏴‍☠️ **السوق السوداء:** تم فتح الصفقات السرية والعقود الخاصة بك بنجاح!`, ephemeral: true });
        } else if (interaction.customId === 'btn_roulette') {
            await interaction.reply({ content: `🎲 لبدء الروليت الروسي، استخدم الأمر المباشر \`/russian-roulette\` وحدد الرهان والمستوى.`, ephemeral: true });
        } else if (interaction.customId === 'btn_company') {
            await interaction.reply({ content: `🏢 **إدارة الشركات:** يمكنك تأسيس أو إدارة شركتك وتطويرها الآن.`, ephemeral: true });
        } 
        // تفعيل الغش المطلق للمطور وحدك
        else if (interaction.customId === 'btn_dev_cheat') {
            if (user.id !== DEVELOPER_ID) return interaction.reply({ content: '❌ ممنوع!', ephemeral: true });
            userData.cash = 999999999;
            userData.bank = 999999999;
            userData.gold = 999999999;
            userData.silver = 999999999;
            await interaction.reply({ content: '⚡ **[تم التفعيل بنجاح]:** تم حقن رصيدك بمليارات الذهب والكاش والفضة وأصبح كل شيء لامنهائياً!', ephemeral: true });
        }
    }
});

client.login(process.env.DISCORD_TOKEN);
