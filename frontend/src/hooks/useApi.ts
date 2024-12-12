import axios from "axios";
import { useState } from "react";
const URL = "http://localhost:8000";

type Messages = {
  isBot: boolean;
  content: string;
};

const useApi = () => {
  const [messages, setMessages] = useState<Messages[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const sendRequest = async (content: string) => {
    const userMessage = {
      isBot: false,
      content,
    };
    setMessages((prev) => [...prev, userMessage]);
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.post(
        `${URL}/v1/api/chat`,
        { content },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const botMessage = {
        isBot: true,
        content: response.data.messages || "AI response",
      };
      setMessages((prev) => [...prev, botMessage]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error fetching AI response:", error);
      setError(error);
      const errorMessage = {
        isBot: true,
        content: "Error occurred. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  return { sendRequest, messages, isLoading, error };
};

export default useApi;
