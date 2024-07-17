// pages/api/generate-quiz.ts
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import { generateQuizPrompt } from "../../utils";

function cleanJSONString(str: string) {
  return str
    .replace(/```json/g, "") // Remove ```json if present
    .replace(/```/g, "") // Remove closing ```
    .replace(/\\n/g, "") // Remove new lines
    .replace(/\\/g, ""); // Remove backslashes
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { theme, difficulty } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res
      .status(500)
      .json({ error: "OPENAI_API_KEY not set in environment variables" });
  }

  try {
    const openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: false,
    });
    console.log("prompting:", theme, difficulty);
    const prompt = generateQuizPrompt(theme, difficulty);

    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a quiz generator. Respond with a JSON object only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 1500,
      temperature: 0.7,
    });

    const messageContent = aiResponse?.choices[0]?.message?.content?.trim();
    console.log("OpenAI gave a response");
    if (!messageContent) {
      return res.status(500).json({ error: "Failed to generate quiz" });
    }
    // Clean the message content before parsing
    const cleanedContent = cleanJSONString(messageContent);
    console.log("Cleaned content");

    let quiz;
    try {
      quiz = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      return res.status(500).json({ error: "Failed to parse quiz data" });
    }

    res.status(200).json({ quiz });
  } catch (error) {
    console.error("Error generating quiz:", error);
    res.status(500).json({ error: "Failed to generate quiz" });
  }
}
