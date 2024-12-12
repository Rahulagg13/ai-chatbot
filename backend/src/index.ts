import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import OpenAI from "openai";
import { enhanceUserPrompt, generateSystemPrompt } from "./training/prompt.js";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cors({
  origin: "",
  methods: "*"
}));
app.use(morgan("tiny"));

app.post("/v1/api/chat", async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    if (!process.env.OPENAI_API_KEY) {
      res.status(500).json({
        error: "OpenAI API key not configured",
        details: "Please set your OpenAI API key in the server .env file",
      });
      return;
    }
    const messages: {
      role: "system" | "user" | "assistant";
      content: string;
      refusal?: string;
    }[] = [
      { role: "system", content: generateSystemPrompt() }, // system role message
      { role: "user", content: enhanceUserPrompt(content) }, // user role message
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      max_tokens: 20,
      temperature: 0.7, 
    });

    const response = completion.choices[0].message.content;
    res.status(200).json({
      messages: response,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      messages: err,
    });
  }
});

app.get("/", (req: Request, res: Response) => {
  try {
    res.status(200).json({
      messages: "content received successfull",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      messages: err,
    });
  }
});

app.listen(PORT, () => {
  console.log(`App is running on PORT ${PORT}`);
});
