import {Client} from 'node-appwrite';
import {Databases} from 'node-appwrite';
import {fetch} from 'undici';
import ScrapingBee from "./dataCollections/ScrapingBee.js";
import openAI from "./analyzors/OpenAI.js";

/**
 * Main Appwrite Function Handler
 * @returns {Object} Response object
 */
export default async ({ res, log, error}) => {
    try {
        log('🚀 Starting Iran Internet Report Generation...');

        /* ---------------- 1. Initialize Appwrite Client ---------------- */
        const client = new Client()
            .setEndpoint(
                process.env.APPWRITE_ENDPOINT ?? 'https://cloud.appwrite.io/v1'
            )
            .setProject(process.env.APPWRITE_PROJECT_ID)
            .setKey(process.env.APPWRITE_API_KEY);

        const databases = new Databases(client);

        /* ---------------- 2. Collect Data with Serper ---------------- */
        log('📊 Fetching data from Serper AI...');

        let rawData = await ScrapingBee();

        log('✅ Data collected successfully ' + rawData);

        /* ---------------- 3. Analyze with OpenAI (ChatGPT) ---------------- */
        log('🤖 Analyzing data with ChatGPT...');

        const analysis = await openAI(rawData)
        log('✅ Analysis completed');

        /* ---------------- 4. GENERATE FINAL REPORT ---------------- */
        const persianDate = new Date().toLocaleDateString('fa-IR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

        const finalReport = `
📊 گزارش هوشمند: وضعیت اینترنت ایران

${analysis}

━━━━━━━━━━━━━━━━━
🕒 ${persianDate}
━━━━━━━━━━━━━━━━━
`;

        /* ---------------- 5. SAVE TO DATABASE ---------------- */
        log('💾 Saving to database...');

        const document = await databases.createDocument(
            process.env.APPWRITE_DB_ID,
            process.env.APPWRITE_COLLECTION_ID,
            'unique()',
            {
                topic: 'Internet in Iran',
                raw_data: rawData.substring(0, 10000), // Limit length
                analysis: analysis.substring(0, 5000),
                final_report: finalReport,
                created_at: new Date().toISOString(),
                status: 'published',
            }
        );

        log(`✅ Document created: ${document.$id}`);

        /* ---------------- 6. SEND TO TELEGRAM ---------------- */
        log('📤 Sending to Telegram...');

        const telegramResponse = await fetch(
            `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    chat_id: process.env.TELEGRAM_CHANNEL_ID,
                    text: finalReport,
                    parse_mode: 'HTML',
                    disable_web_page_preview: false,
                }),
            }
        );

        if (!telegramResponse.ok) {
            const telegramError = await telegramResponse.text();
            log (`Telegram API Error: ${telegramError}`);
        }

        log('✅ Report sent to Telegram successfully');

        /* ---------------- 7. Return Success Response ---------------- */
        return res.json({
            success: true,
            message: '✅ گزارش با موفقیت تولید و ارسال شد',
            document_id: document.$id,
            timestamp: new Date().toISOString(),
        });
    } catch (err) {
        error(`❌ Error: ${err.message}`);
        error(err.stack);

        return res.json(
            {
                success: false,
                error: err.message,
                timestamp: new Date().toISOString(),
            },
            500
        );
    }
};
