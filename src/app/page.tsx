// import Image from "next/image";
// import styles from "./page.module.css";

// export default function Home() {
//   return (
//     <div className={styles.page}>
//       <main className={styles.main}>
//         <Image
//           className={styles.logo}
//           src="/next.svg"
//           alt="Next.js logo"
//           width={180}
//           height={38}
//           priority
//         />
//         <ol>
//           <li>
//             Get started by editing <code>src/app/page.tsx</code>.
//           </li>
//           <li>Save and see your changes instantly.</li>
//         </ol>

//         <div className={styles.ctas}>
//           <a
//             className={styles.primary}
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className={styles.logo}
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={20}
//               height={20}
//             />
//             Deploy now
//           </a>
//           <a
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//             className={styles.secondary}
//           >
//             Read our docs
//           </a>
//         </div>
//       </main>
//       <footer className={styles.footer}>
//         <a
//           href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/file.svg"
//             alt="File icon"
//             width={16}
//             height={16}
//           />
//           Learn
//         </a>
//         <a
//           href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/window.svg"
//             alt="Window icon"
//             width={16}
//             height={16}
//           />
//           Examples
//         </a>
//         <a
//           href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/globe.svg"
//             alt="Globe icon"
//             width={16}
//             height={16}
//           />
//           Go to nextjs.org →
//         </a>
//       </footer>
//     </div>
//   );
// }


"use client";
import React, { useState } from "react";
import Layout from "../components/Layout";
import ControlCard from "../components/ControlCard";
import ThemeToggle from "../components/ThemeToggle";
import axios from "axios";
import { downloadTxt, downloadDocx } from "../components/ExportButtons";

export default function Page() {
  const [topic, setTopic] = useState<string>("");
  const [tone, setTone] = useState<string>("");
  const [language, setLanguage] = useState<string>("");
  const [generatedPost, setGeneratedPost] = useState<string>("");
  const [comments, setComments] = useState<string>("");
  const [hashtags, setHashtags] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  async function generatePost() {
    setError("");
    if (!topic.trim() || !tone.trim() || !language.trim()) {
      setError("Please fill Topic, Tone and Language.");
      return;
    }
    setLoading(true);
    try {
      const resp = await axios.post("/api/generate_post", { topic, tone, language });
      setGeneratedPost(resp.data.post || "");
      setComments("");
      setHashtags("");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "AI error";
      const axiosError = err as { response?: { data?: { error?: string } } };
      setError(axiosError.response?.data?.error || errorMessage || "AI error");
    } finally {
      setLoading(false);
    }
  }

  async function generateComments() {
    setError("");
    if (!generatedPost.trim()) {
      setError("Generate or paste a post first.");
      return;
    }
    setLoading(true);
    try {
      const resp = await axios.post("/api/generate_comments", { post_text: generatedPost, n: 3, language });
      setComments(resp.data.comments || "");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "AI error";
      const axiosError = err as { response?: { data?: { error?: string } } };
      setError(axiosError.response?.data?.error || errorMessage || "AI error");
    } finally {
      setLoading(false);
    }
  }

  async function generateHashtags() {
    setError("");
    if (!topic.trim()) {
      setError("Enter a topic.");
      return;
    }
    setLoading(true);
    try {
      const resp = await axios.post("/api/generate_hashtags", { topic, n: 10 });

      // Process the response to ensure proper hashtag format
      let processedHashtags = resp.data.hashtags || "";

      // Clean up the response - remove common prefixes/suffixes that might come from AI
      processedHashtags = processedHashtags.replace(/```.*?\n|```/g, ''); // Remove code blocks
      processedHashtags = processedHashtags.replace(/\n/g, ', '); // Replace newlines with commas

      setHashtags(processedHashtags);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "AI error";
      const axiosError = err as { response?: { data?: { error?: string } } };
      setError(axiosError.response?.data?.error || errorMessage || "AI error");
    } finally {
      setLoading(false);
    }
  }

  function newPost() {
    setTopic("");
    setTone("");
    setLanguage("");
    setGeneratedPost("");
    setComments("");
    setHashtags("");
    setError("");
  }

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">PostGenie</h1>
          <p className="text-sm text-[var(--muted)] mt-1">AI-powered social media content generator</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={newPost}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <span>🆕</span> New Post
          </button>
          <ThemeToggle />
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      <ControlCard title="Create Post">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-[var(--muted)]">Topic</label>
            <input
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-[var(--card)]"
              placeholder="Topic (e.g., AI in Marketing)"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-[var(--muted)]">Tone</label>
            <select
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-[var(--card)]"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
            >
              <option value="">Select tone</option>
              <option>fun and engaging</option>
              <option>professional</option>
              <option>storytelling</option>
              <option>funny</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-[var(--muted)]">Language</label>
            <select
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-[var(--card)]"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="">Select language</option>
              <option>English</option>
              <option>Hindi</option>
              <option>Hinglish</option>
              <option>Urdu</option>
              <option>Roman Urdu</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={generatePost}
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg disabled:opacity-50 hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : "Generate Post"}
          </button>
          <button
            onClick={() => generatedPost && downloadTxt("post", generatedPost)}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download .txt
          </button>
          <button
            onClick={() => generatedPost && downloadDocx("post", generatedPost)}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download .docx
          </button>
        </div>
      </ControlCard>

      {generatedPost ? (
        <ControlCard title="Generated Post">
          <div className="bg-[var(--card)] p-4 rounded-lg mb-4 max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-700">
            <pre className="whitespace-pre-wrap break-words text-[var(--text)]">{generatedPost}</pre>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md flex items-center gap-2"
              href="https://www.linkedin.com/feed/"
              target="_blank"
              rel="noreferrer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
              Share on LinkedIn
            </a>
            <a
              className="px-4 py-2 bg-gradient-to-r from-sky-500 to-cyan-500 text-white rounded-lg hover:from-sky-600 hover:to-cyan-600 transition-all shadow-md flex items-center gap-2"
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(generatedPost)}`}
              target="_blank"
              rel="noreferrer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
              Share on Twitter
            </a>
          </div>
        </ControlCard>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ControlCard title="Comments">
          <textarea
            className="w-full h-36 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-[var(--card)] text-[var(--text)] resize-none"
            placeholder="Generated post will appear here for comment generation..."
            value={generatedPost}
            onChange={(e) => setGeneratedPost(e.target.value)}
            readOnly
          />
          <div className="flex flex-wrap gap-3 mt-3">
            <button
              onClick={generateComments}
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-md"
            >
              Generate Comments
            </button>
            {comments && (
              <div className="text-sm text-[var(--muted)] bg-gray-50 dark:bg-gray-800/30 p-3 rounded-lg flex-grow min-w-[200px] border border-gray-200 dark:border-gray-700">
                {comments}
              </div>
            )}
          </div>
        </ControlCard>

        <ControlCard title="Hashtags">
          <input
            className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-[var(--card)] text-[var(--text)]"
            placeholder="Topic for hashtags"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <div className="flex gap-3 mt-3">
            <button
              onClick={generateHashtags}
              disabled={loading}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg disabled:opacity-50 hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
            >
              {loading ? "Generating..." : "Generate Hashtags"}
            </button>
          </div>

          {hashtags && (
            <div className="mt-4">
              <div className="font-medium mb-3 text-indigo-700 dark:text-indigo-300">Generated Hashtags:</div>
              <div className="flex flex-wrap gap-2">
                {hashtags
                  .split(',')
                  .filter(tag => tag.trim()) // Remove empty strings
                  .map((hashtag, index) => {
                    // Clean up hashtag format - remove extra spaces and ensure it starts with #
                    let cleanTag = hashtag.trim();
                    if (!cleanTag.startsWith('#')) {
                      cleanTag = '#' + cleanTag;
                    }
                    return (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full text-sm cursor-pointer hover:from-indigo-600 hover:to-purple-600 transition-all shadow-sm hover:shadow-md"
                        onClick={() => navigator.clipboard.writeText(cleanTag)}
                        title="Click to copy"
                      >
                        {cleanTag}
                      </span>
                    );
                  })}
              </div>
            </div>
          )}
        </ControlCard>
      </div>
    </Layout>
  );
}

