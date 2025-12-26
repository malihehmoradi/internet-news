import fetch from "node-fetch";
import { Client, Databases } from "node-appwrite";

export default async function () {

    /* ---------------- Appwrite ---------------- */
    const client = new Client()
        .setEndpoint(process.env.APPWRITE_ENDPOINT)
        .setProject(process.env.APPWRITE_PROJECT_ID)
        .setKey(process.env.APPWRITE_API_KEY);

    const databases = new Databases(client);

    /* ---------------- 1. COLLECT DATA (Perplexity) ---------------- */
    const pplxRes = await fetch(
        "https://api.perplexity.ai/chat/completions",
        {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.PERPLEXITY_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "pplx-70b-online",
                messages: [
                    {
                        role: "user",
                        content: "Collect latest factual data about internet situation in Iran with statistics and sources"
                    }
                ]
            })
        }
    );

    const pplxData = await pplxRes.json();
    const rawData = pplxData.choices[0].message.content;

    /* ---------------- 2. ANALYZE (ChatGPT) ---------------- */
    const gptRes = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-4.1-mini",
                messages: [
                    {
                        role: "system",
                        content: "You are a professional data analyst and report writer."
                    },
                    {
                        role: "user",
                        content: `
Analyze the following data and produce:
- 5 key insights
- Short telegram-ready report
- Clear bullet points

DATA:
${rawData}
`
                    }
                ]
            })
        }
    );

    const gptData = await gptRes.json();
    const analysis = gptData.choices[0].message.content;

    /* ---------------- 3. FINAL REPORT ---------------- */
    const finalReport = `
📊 گزارش هوشمند اینترنت ایران

${analysis}

🕒 ${new Date().toLocaleDateString("fa-IR")}
`;

    /* ---------------- 4. SAVE TO DATABASE ---------------- */
    await databases.createDocument(
        process.env.APPWRITE_DB_ID,
        process.env.APPWRITE_COLLECTION_ID,
        "unique()",
        {
            topic: "Internet in Iran",
            raw_data: rawData,
            analysis: analysis,
            final_report: finalReport,
            created_at: new Date().toISOString()
        }
    );

    /* ---------------- 5. SEND TO TELEGRAM ---------------- */
    await fetch(
        `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: process.env.TELEGRAM_CHANNEL,
                text: finalReport
            })
        }
    );

    return { status: "DONE ✅" };
}
