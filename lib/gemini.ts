import { GoogleGenerativeAI } from "@google/generative-ai";

export const getModel = () => {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    return genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
}