import {fetch} from "undici";

export default async () => {

    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    const response = await  fetch("https://app.scrapingbee.com/api/v1/google?api_key=P1MYLQWQCDPFDQ8P21XJJL0IAVNYRXJV2ABB2OW8339RTS91DVCQWPBQ5U3209IYH0V976GQ4RWB7VH6&search=%D8%AC%D8%AF%DB%8C%D8%AF%D8%AA%D8%B1%DB%8C%D9%86+%D8%AF%D8%A7%D8%AF%D9%87%E2%80%8C%D9%87%D8%A7%DB%8C+%D9%88%D8%A7%D9%82%D8%B9%DB%8C+%D8%AF%D8%B1%D8%A8%D8%A7%D8%B1%D9%87+%D9%88%D8%B6%D8%B9%DB%8C%D8%AA+%D8%A7%DB%8C%D9%86%D8%AA%D8%B1%D9%86%D8%AA+%D8%AF%D8%B1+%D8%A7%DB%8C%D8%B1%D8%A7%D9%86+%D8%B1%D8%A7+%D8%A8%D8%A7+%D8%A2%D9%85%D8%A7%D8%B1%D8%8C+%D9%85%D9%86%D8%A7%D8%A8%D8%B9+%D9%88+%D8%AA%D8%AD%D9%88%D9%84%D8%A7%D8%AA+%D8%A7%D8%AE%DB%8C%D8%B1+%D8%AC%D9%85%D8%B9%E2%80%8C%D8%A2%D9%88%D8%B1%DB%8C+%DA%A9%D9%86%DB%8C%D8%AF.&language=fa&search_type=ai_mode&country_code=ir", requestOptions)


    if (!response.ok) {
        throw new Error(`ScrapingBee API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.ai_mode_answer.response_text

}