import { useState } from "react";
import styles from '@/styles/Home.module.css';

export default function Home() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Array<{ type: string, content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchEmbedding() {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/embedding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      if (response.ok) {
        const botMessage = { type: 'bot', content: JSON.stringify(data.embedding, null, 2) };
        setMessages(prev => [...prev, botMessage]);
      } else {
        setError(data.error || "Failed to fetch embedding");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  function handleSend() {
    if (text.trim() === "") {
      return;
    }

    const userMessage = { type: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setText("");
    setIsSubmitted(true);
    fetchEmbedding();
  }

  function handleKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      handleSend();
    }
  }

  return (
    <div className={styles.page}>
      {!isSubmitted && (
        <div className={styles.centeredInputContainer}>
          <div className={styles.promptText}>
            Enter your own embedding!
          </div>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask anything"
              className={styles.input}
              aria-label="Ask anything"
              style={{ width: '115px', height: '115px' }}
            />
          </div>
          <div className={styles.inputFooter} style={{ marginTop: '20px' }}>
            OpenAI Embedding Tester
          </div>
        </div>
      )}

      {error && (
        <div className={styles.errorContainer}>
          <p className={styles.errorMessage}>{error}</p>
        </div>
      )}

      {isSubmitted && (
        <>
          <div className={styles.messagesContainer}>
            {messages.map((message, index) => (
              <div key={index} className={`${styles.messageWrapper} ${message.type === 'user' ? styles.userMessageWrapper : styles.botMessageWrapper}`}>
                <div className={styles.contentContainer}>
                  <div className={`${styles.message} ${message.type === 'user' ? styles.userMessage : styles.botMessage}`}>
                    {message.content}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className={styles.messageWrapper}>
                <div className={styles.contentContainer}>
                  <div className={styles.loadingIndicator}>
                    <div className={styles.loadingDot}></div>
                    <div className={styles.loadingDot}></div>
                    <div className={styles.loadingDot}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={styles.inputSection}>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask anything"
                className={styles.input}
                aria-label="Ask anything"
                style={{ width: '115px', height: '115px' }}
              />
            </div>
            <div className={styles.inputFooter} style={{ marginTop: '20px' }}>
              OpenAI Embedding Tester
            </div>
          </div>
        </>
      )}
    </div>
  );
}
