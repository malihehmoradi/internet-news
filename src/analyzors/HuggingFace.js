export default async (data) => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer "+process.env.HUGGINGFACE_TOKEN);
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "inputs": data
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    let response =await fetch("https://api-inference.huggingface.co/models/mousavian/mt5-small-persian-summarization-v2", requestOptions)

    if (!response.ok) {
        throw new Error(`HuggingFace API Error: ${response.status}`);
    }

    return await response.json();
}