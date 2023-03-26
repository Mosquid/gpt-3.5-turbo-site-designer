// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { set } from "@/services/redis";
import type { NextApiRequest, NextApiResponse } from "next";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";

const API_KEY = process.env.API_KEY;

const configuration = new Configuration({
  apiKey: API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { story, content } = req.body;
  const messages: Array<ChatCompletionRequestMessage> = [
    {
      content: `Hey. I have a simple html website. Here is its source code: ${content}. I need to add some funky css to it. Here are some ideas: ${story}. Could you please update to source code to make it look like this? Thanks!`,
      role: "user",
    },

    {
      role: "assistant",
      content: "here you go",
    },
    {
      role: "user",
      content:
        "thanks. could you wrap it in a code block and ship it with no formatting or line breaks?",
    },
  ];

  try {
    const ts = new Date().getTime();

    res.status(200).json({ ts });

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages,
    });
    const { message } = response.data.choices[0];

    const regex = /<html lang=\"en\">[\s\S]*<\/html>/;

    let { content } = message || {};
    const match = (content || "").match(regex);

    if (match) {
      content = match[0];
    }

    await set(ts.toString(), content || "");
  } catch (error) {
    // @ts-ignore
    console.error(error);
    res.status(400).json({ error });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1mb",
    },
  },
};
