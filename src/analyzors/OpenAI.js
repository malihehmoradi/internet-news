export default async  (req) => {

    const response = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content:
                            'You are a professional data analyst. Create concise, actionable reports in Persian suitable for Telegram channels.',
                    },
                    {
                        role: 'user',
                        content: `
تحلیل داده‌های زیر و تولید:
1️⃣ 5 نکته کلیدی (به فارسی)
2️⃣ گزارش خلاصه برای تلگرام
3️⃣ آمار و ارقام مهم

داده‌ها:
${req}

خروجی باید کاملاً فارسی و مناسب کانال تلگرام باشد.
`,
                    },
                ],
                temperature: 0.3,
                max_tokens: 1500,
            }),
        }
    );

    if (!response.ok) {
        throw new Error(`OpenAI API Error: ${response.status}`);
    }

    return await response.json();
}