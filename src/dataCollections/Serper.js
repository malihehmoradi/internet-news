import {fetch} from "undici";

export default async () => {
    const myHeaders = new Headers();
    myHeaders.append("X-API-KEY", "1a9b0912d4a768584668a9d2c2221e4e5e95db9f");
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "q": "جدیدترین داده‌های واقعی درباره وضعیت اینترنت در ایران را با آمار، منابع و تحولات اخیر جمع‌آوری کنید.",
        "gl": "ir",
        "hl": "fa",
        "tbs": "qdr:w"
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    const response = await fetch("https://google.serper.dev/search", requestOptions)

    if (!response.ok) {
        throw new Error(`Serper API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.organic.toString()
}