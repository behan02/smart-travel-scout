import { NextResponse } from "next/server";
import { inventory } from "@/data/inventory";
import { getModel } from "@/lib/gemini";
import { responseSchema } from "@/lib/validation";

export async function POST(req: Request) {
    try{
        const { userQuery } = await req.json();

        const prompt = `
            You are a travel recommendation assistant.

            You must ONLY select travel packages from the provided inventory.
            Do NOT invent new destinations.
            Return ONLY valid JSON in this format:

            {
                "results": [
                    {
                        "id": number,
                        "reason": string
                    },
                ]
            }

            Inventory:
            ${JSON.stringify(inventory)}

            User Request:
            ${userQuery}
        `;
        const model = getModel();
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0 }
        });

        const text = result.response.text();
        const cleaned = text.replace(/```json|```/g, "");
        const parsed = JSON.parse(cleaned);

        // Validate structure
        const validated = responseSchema.parse(parsed);

        // Guardrail: filter invalid IDs
        const validIds = inventory.map(i => i.id);
        const safeResults = validated.results.filter(r =>
            validIds.includes(r.id)
        );

        return NextResponse.json({ results: safeResults });

    } catch (error) {
        return NextResponse.json({ error: "Invalid response" }, { status: 500 });
    }
}