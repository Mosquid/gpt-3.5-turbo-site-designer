import Head from "next/head";
import styles from "@/styles/Home.module.css";
import {
  ChangeEvent,
  KeyboardEventHandler,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const initialStory = `I want my website to be dull. Black font on white background. The content area is centered and 500px wide.`;

export default function Home() {
  const [story, setStory] = useState(initialStory);
  const [content, setContent] = useState("");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState(false);
  const handleDescriptionChange = (
    e: ChangeEvent<HTMLTextAreaElement>
  ): void => {
    setStory(e.target.value);
  };

  const submitStory = async () => {
    setLoading(true);
    const res = await fetch("/api/designer", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ story, content }),
    });
    const { content: newContent } = await res.json();

    const doc = new DOMParser().parseFromString(newContent, "text/html");
    const body = doc.documentElement.outerHTML;

    if (doc && iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.document.documentElement.innerHTML = body;
    }
    setLoading(false);
  };

  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitStory();

      return false;
    }
  };

  const handleIframeMessage = (e: MessageEvent) => {
    const { message } = e.data;

    if (message) {
      setContent(message);
    }
  };

  useEffect(() => {
    window.addEventListener("message", handleIframeMessage);
    return () => {
      window.removeEventListener("message", handleIframeMessage);
    };
  }, []);

  const submitLabel = useMemo(() => {
    if (loading) {
      return "Loading...";
    }
    return "Press Enter to submit";
  }, [loading]);

  return (
    <>
      <Head>
        <title>The Power of AI: powered by AI</title>
        <meta name="description" content="OpenaAI gpt-3.5-turbo playground" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.siteStory}>
          <h2>What should your website look like?</h2>

          <textarea
            disabled={loading}
            onKeyDown={handleKeyDown}
            value={story}
            onChange={handleDescriptionChange}
          ></textarea>
          <div className={styles.submitLabel}>{submitLabel}</div>
        </div>
        <iframe ref={iframeRef} src="/content.html" frameBorder="0"></iframe>
      </main>
    </>
  );
}
