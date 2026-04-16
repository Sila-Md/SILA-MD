// ==================== LUCHA ZOTE ZA BOT ====================

const languages = {
    // KISWAHILI (Default)
    sw: {
        name: "Kiswahili",
        flag: "🇹🇿",
        
        // General
        loading: "🔃 *Inapakia...*",
        success: "✅ Imefanikiwa!",
        error: "❌ Hitilafu:",
        noQuery: "❌ Tafadhali ingiza neno la kutafuta!",
        noPermission: "❌ Huna ruhusa ya kutumia command hii!",
        
        // Language commands
        langChanged: "✅ Lugha imebadilishwa kuwa",
        langCurrent: "🌐 *Lugha yako ya sasa:*",
        langList: "📋 *Lugha Zinazopatikana:*",
        langChoose: "💬 Chagua lugha: .lang sw | .lang en | .lang ar",
        
        // Welcome messages
        welcome: "👋 Karibu",
        goodbye: "👋 Kwaheri",
        
        // Group commands
        groupOpen: "✅ *Group imefunguliwa.*\nWanachama wote wanaweza kutuma ujumbe.",
        groupClose: "✅ *Group imefungwa.*\nAdmin pekee wanaweza kutuma ujumbe.",
        groupLock: "✅ *Group imefungwa.*\nAdmin pekee wanaweza kubadilisha mipangilio.",
        groupUnlock: "✅ *Group imefunguliwa.*\nWanachama wote wanaweza kubadilisha mipangilio.",
        groupNameChanged: "✅ Jina la group limebadilishwa kuwa:",
        groupDescChanged: "✅ Maelezo ya group yamebadilishwa.",
        
        // Admin messages
        notGroup: "❌ Command hii inatumika kwenye group pekee!",
        notAdmin: "❌ Command hii ni ya admin wa group pekee!",
        notBotAdmin: "❌ Bot inahitaji kuwa admin kutumia command hii!",
        
        // Member management
        memberAdded: "✅ Ameongezwa kwenye group.",
        memberKicked: "✅ Ameondolewa kwenye group.",
        memberPromoted: "✅ Amepandishwa cheo kuwa admin.",
        memberDemoted: "✅ Ameshushwa cheo kutoka admin.",
        
        // Anti features
        antiLinkOn: "✅ *Anti-link imewashwa.*",
        antiLinkOff: "❌ *Anti-link imezimwa.*",
        antiBotOn: "✅ *Anti-bot imewashwa.*",
        antiBotOff: "❌ *Anti-bot imezimwa.*",
        welcomeOn: "✅ *Ujumbe wa karibu umewashwa.*",
        welcomeOff: "❌ *Ujumbe wa karibu umezimwa.*",
        goodbyeOn: "✅ *Ujumbe wa kwaheri umewashwa.*",
        goodbyeOff: "❌ *Ujumbe wa kwaheri umezimwa.*",
        
        // Media messages
        imageSent: "🖼️ Picha imetumwa.",
        videoSent: "🎥 Video imetumwa.",
        audioSent: "🎵 Audio imetumwa.",
        documentSent: "📄 Hati imetumwa.",
        
        // Download messages
        downloading: "⬇️ *Inapakua...*",
        downloadSuccess: "✅ Upakuaji umekamilika!",
        downloadFailed: "❌ Upakuaji umeshindikana.",
        noMedia: "❌ Hakuna media iliyopatikana.",
        
        // Search messages
        searchResults: "🔍 *Matokeo ya Utafutaji:*",
        noResults: "❌ Hakuna matokeo yaliyopatikana.",
        
        // Fun messages
        fact: "🤔 *Fakta ya Kuvutia:*",
        karma: "⚖️ *Karma yako:*",
        dreamName: "💭 *Jina lako la ndoto:*",
        truth: "🔍 *Ukweli Dare:*",
        
        // Menu
        mainMenu: "📋 *MENU KUU*",
        groupMenu: "👥 *MENU YA GROUP*",
        adminMenu: "👮 *MENU YA ADMIN*",
        downloadMenu: "⬇️ *MENU YA KUPAKUA*",
        searchMenu: "🔍 *MENU YA KUTAFUTA*",
        funMenu: "🎉 *MENU YA BURUDANI*",
        
        // Footer
        footer: "> © Sila MD | Powered by"
    },

    // ENGLISH
    en: {
        name: "English",
        flag: "🇬🇧",
        
        // General
        loading: "🔃 *Loading...*",
        success: "✅ Success!",
        error: "❌ Error:",
        noQuery: "❌ Please enter a search term!",
        noPermission: "❌ You don't have permission to use this command!",
        
        // Language commands
        langChanged: "✅ Language changed to",
        langCurrent: "🌐 *Your current language:*",
        langList: "📋 *Available Languages:*",
        langChoose: "💬 Choose language: .lang sw | .lang en | .lang ar",
        
        // Welcome messages
        welcome: "👋 Welcome",
        goodbye: "👋 Goodbye",
        
        // Group commands
        groupOpen: "✅ *Group opened.*\nAll members can now send messages.",
        groupClose: "✅ *Group closed.*\nOnly admins can send messages.",
        groupLock: "✅ *Group locked.*\nOnly admins can edit settings.",
        groupUnlock: "✅ *Group unlocked.*\nAll members can edit settings.",
        groupNameChanged: "✅ Group name changed to:",
        groupDescChanged: "✅ Group description changed.",
        
        // Admin messages
        notGroup: "❌ This command can only be used in groups!",
        notAdmin: "❌ This command is for group admins only!",
        notBotAdmin: "❌ Bot needs to be admin to use this command!",
        
        // Member management
        memberAdded: "✅ Added to group.",
        memberKicked: "✅ Removed from group.",
        memberPromoted: "✅ Promoted to admin.",
        memberDemoted: "✅ Demoted from admin.",
        
        // Anti features
        antiLinkOn: "✅ *Anti-link enabled.*",
        antiLinkOff: "❌ *Anti-link disabled.*",
        antiBotOn: "✅ *Anti-bot enabled.*",
        antiBotOff: "❌ *Anti-bot disabled.*",
        welcomeOn: "✅ *Welcome message enabled.*",
        welcomeOff: "❌ *Welcome message disabled.*",
        goodbyeOn: "✅ *Goodbye message enabled.*",
        goodbyeOff: "❌ *Goodbye message disabled.*",
        
        // Media messages
        imageSent: "🖼️ Image sent.",
        videoSent: "🎥 Video sent.",
        audioSent: "🎵 Audio sent.",
        documentSent: "📄 Document sent.",
        
        // Download messages
        downloading: "⬇️ *Downloading...*",
        downloadSuccess: "✅ Download complete!",
        downloadFailed: "❌ Download failed.",
        noMedia: "❌ No media found.",
        
        // Search messages
        searchResults: "🔍 *Search Results:*",
        noResults: "❌ No results found.",
        
        // Fun messages
        fact: "🤔 *Interesting Fact:*",
        karma: "⚖️ *Your karma:*",
        dreamName: "💭 *Your dream name:*",
        truth: "🔍 *Truth Dare:*",
        
        // Menu
        mainMenu: "📋 *MAIN MENU*",
        groupMenu: "👥 *GROUP MENU*",
        adminMenu: "👮 *ADMIN MENU*",
        downloadMenu: "⬇️ *DOWNLOAD MENU*",
        searchMenu: "🔍 *SEARCH MENU*",
        funMenu: "🎉 *FUN MENU*",
        
        // Footer
        footer: "> © Sila MD | Powered by"
    },

    // ARABIC
    ar: {
        name: "العربية",
        flag: "🇸🇦",
        
        // General
        loading: "🔃 *جاري التحميل...*",
        success: "✅ تم بنجاح!",
        error: "❌ خطأ:",
        noQuery: "❌ الرجاء إدخال كلمة البحث!",
        noPermission: "❌ ليس لديك إذن لاستخدام هذا الأمر!",
        
        // Language commands
        langChanged: "✅ تم تغيير اللغة إلى",
        langCurrent: "🌐 *لغتك الحالية:*",
        langList: "📋 *اللغات المتاحة:*",
        langChoose: "💬 اختر اللغة: .lang sw | .lang en | .lang ar",
        
        // Welcome messages
        welcome: "👋 مرحبا",
        goodbye: "👋 مع السلامة",
        
        // Group commands
        groupOpen: "✅ *المجموعة مفتوحة.*\nجميع الأعضاء يمكنهم إرسال الرسائل.",
        groupClose: "✅ *المجموعة مغلقة.*\nالمشرفون فقط يمكنهم إرسال الرسائل.",
        groupLock: "✅ *المجموعة مقفلة.*\nالمشرفون فقط يمكنهم تعديل الإعدادات.",
        groupUnlock: "✅ *المجموعة مفتوحة.*\nجميع الأعضاء يمكنهم تعديل الإعدادات.",
        groupNameChanged: "✅ تم تغيير اسم المجموعة إلى:",
        groupDescChanged: "✅ تم تغيير وصف المجموعة.",
        
        // Admin messages
        notGroup: "❌ هذا الأمر يستخدم فقط في المجموعات!",
        notAdmin: "❌ هذا الأمر مخصص لمشرفي المجموعة فقط!",
        notBotAdmin: "❌ البوت يحتاج أن يكون مشرفاً لاستخدام هذا الأمر!",
        
        // Member management
        memberAdded: "✅ تمت الإضافة إلى المجموعة.",
        memberKicked: "✅ تمت الإزالة من المجموعة.",
        memberPromoted: "✅ تمت الترقية إلى مشرف.",
        memberDemoted: "✅ تمت الإزالة من المشرفين.",
        
        // Anti features
        antiLinkOn: "✅ *تم تفعيل مكافحة الروابط.*",
        antiLinkOff: "❌ *تم تعطيل مكافحة الروابط.*",
        antiBotOn: "✅ *تم تفعيل مكافحة البوتات.*",
        antiBotOff: "❌ *تم تعطيل مكافحة البوتات.*",
        welcomeOn: "✅ *تم تفعيل رسالة الترحيب.*",
        welcomeOff: "❌ *تم تعطيل رسالة الترحيب.*",
        goodbyeOn: "✅ *تم تفعيل رسالة الوداع.*",
        goodbyeOff: "❌ *تم تعطيل رسالة الوداع.*",
        
        // Media messages
        imageSent: "🖼️ تم إرسال الصورة.",
        videoSent: "🎥 تم إرسال الفيديو.",
        audioSent: "🎵 تم إرسال الصوت.",
        documentSent: "📄 تم إرسال المستند.",
        
        // Download messages
        downloading: "⬇️ *جاري التحميل...*",
        downloadSuccess: "✅ تم التحميل بنجاح!",
        downloadFailed: "❌ فشل التحميل.",
        noMedia: "❌ لم يتم العثور على وسائط.",
        
        // Search messages
        searchResults: "🔍 *نتائج البحث:*",
        noResults: "❌ لا توجد نتائج.",
        
        // Fun messages
        fact: "🤔 *حقيقة مثيرة للاهتمام:*",
        karma: "⚖️ *الكارما الخاصة بك:*",
        dreamName: "💭 *اسم أحلامك:*",
        truth: "🔍 *جرأة الحقيقة:*",
        
        // Menu
        mainMenu: "📋 *القائمة الرئيسية*",
        groupMenu: "👥 *قائمة المجموعة*",
        adminMenu: "👮 *قائمة المشرفين*",
        downloadMenu: "⬇️ *قائمة التحميل*",
        searchMenu: "🔍 *قائمة البحث*",
        funMenu: "🎉 *قائمة الترفيه*",
        
        // Footer
        footer: "> © Sila MD | مشغل بواسطة"
    }
};

module.exports = languages;
