import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();

const client = new Groq({ apikey: process.env.Groq_API_KEY });

export async function summarize(text){
    const response = await client.chat.completions.create({
        model: "llama-3.1-8b-instant",
        message: [
            {
                role: "system",
                content: "You summarize long social media posts into short, clear summaries."
            },
            {
                role: "user",
                message: `Summarize this: ${text}`
            }
        ],
        temperature: 0.3
    });

    return response.choices[0].message.content;
}