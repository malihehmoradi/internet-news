import {fetch} from 'undici';

export default async (data) => {
    const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            chat_id: process.env.TELEGRAM_CHANNEL,
            text: data,
            parse_mode: 'Markdown', // 'HTML'
            disable_web_page_preview: false,
        })
    });

    return await response.json();
}