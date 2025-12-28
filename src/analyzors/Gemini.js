export default async (data) => {
    log('🤖 Analyzing data with Gemini...');
    const myHeaders = new Headers();
    // myHeaders.append("x-goog-api-key", "AIzaSyAnYab_qOEZrnF039-QxN-xvSRNu-jJOiM");
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "contents": [
            {
                "parts": [
                    {
                        "text": data
                    }
                ]
            }
        ]
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    let response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + process.env.GEMINI_API_KEY, requestOptions)

    if (!response.ok) {
        throw new Error(`Gemini API Error: ${response.status}`);
    }

    return await response.json();
}