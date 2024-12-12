"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, Send, User } from "lucide-react";
import { MoodIndicator } from "@/components/mood-indicator";
import { ModeToggle } from "@/components/mode-toggle";
import { motion, AnimatePresence } from "framer-motion";
import useApi from "./hooks/useApi";

// Simple sentiment analysis function
const analyzeSentiment = (text: string): number => {
  const positiveWords = [
    "happy",
    "great",
    "excellent",
    "good",
    "love",
    "like",
    "awesome",
  ];
  const negativeWords = [
    "sad",
    "bad",
    "terrible",
    "hate",
    "dislike",
    "awful",
    "horrible",
  ];

  const words = text.toLowerCase().split(/\s+/);
  let sentiment = 0;

  words.forEach((word) => {
    if (positiveWords.includes(word)) sentiment += 1;
    if (negativeWords.includes(word)) sentiment -= 1;
  });

  return sentiment / words.length;
};

export default function App() {
  const { messages, sendRequest, isLoading } = useApi();
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [overallSentiment, setOverallSentiment] = useState(0);

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      const newSentiment = analyzeSentiment(lastMessage.content);
      setOverallSentiment(
        (prevSentiment) => (prevSentiment + newSentiment) / 2
      );
    }
  }, [messages]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsTyping(true);
    if (!input) return;
    sendRequest(input);
    setInput("");
    setIsTyping(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 dark:from-gray-800 dark:to-gray-900 p-4 relative overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute left-0 top-0 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute right-0 top-0 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute left-20 bottom-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
      <Card className="w-full max-w-2xl shadow-xl relative z-10 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">AI Chatbot</CardTitle>
          <div className="flex items-center space-x-2">
            <MoodIndicator sentiment={overallSentiment} />
            <ModeToggle />
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[60vh] pr-4">
            <AnimatePresence initial={false}>
              {messages.map((m,index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`mb-4 flex ${
                    !m.isBot ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex items-start gap-2 ${
                      !m.isBot ? "flex-row-reverse" : ""
                    }`}
                  >
                    <Avatar>
                      <AvatarFallback>
                        {!m.isBot ? <User /> : <Bot />}
                      </AvatarFallback>
                      <AvatarImage
                        src={m.isBot ? "/user-avatar.png" : "/bot-avatar.png"}
                      />
                    </Avatar>
                    <div
                      className={`rounded-lg p-3 ${
                        m.isBot
                          ? "bg-blue-500 text-white dark:bg-blue-700"
                          : "bg-gray-200 text-black dark:bg-gray-700 dark:text-white"
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex justify-start mb-4"
              >
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarFallback>
                      <Bot />
                    </AvatarFallback>
                    <AvatarImage src="/bot-avatar.png" />
                  </Avatar>
                  <div className="bg-gray-200 text-black dark:bg-gray-700 dark:text-white rounded-lg p-3">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <form onSubmit={onSubmit} className="flex w-full space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow"
            />
            <Button type="submit" disabled={isLoading || isTyping}>
              <Send className="w-4 h-4 mr-2" />
              Send
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
