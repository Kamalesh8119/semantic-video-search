
import { useState } from "react";
import "./App.css";

const EXAMPLES = [
  "How do for loops work?",
  "What are Python lists?",
   "What are tuples?",
  "Explain dictionaries",
  "How to handle errors?",
   "what is object oriented programming?",
  
];

export default function App() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Sends the user question to the backend and stores the best matching result
  const search = async (selectedQuery) => {
    const searchText = selectedQuery ?? query;
    const cleanQuery = searchText.trim();

    if (!cleanQuery) {
      setError("Please enter a question.");
      return;
    }

    if (selectedQuery !== undefined) {
      setQuery(selectedQuery);
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("http://localhost:8000/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: cleanQuery }),
      });

      if (!res.ok) {
        throw new Error(
          "Could not reach the server. Please check if the backend is running."
        );
      }

      const data = await res.json();
      setResult(data);
    } catch (e) {
      setError(e.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Converts backend similarity score into percentage for display
  const confidence =
    result && typeof result.score === "number"
      ? `${(result.score * 100).toFixed(0)}%`
      : "N/A";

  // Shows a helpful message when query does not strongly match this video
  const isWeakMatch =
    result && typeof result.score === "number" && result.score < 0.4;

  return (
    <div className="app">
      <nav className="nav">
        <div className="nav-logo">▶</div>
        <span className="nav-name">Semantic Video Search</span>
      </nav>

      <main className="main">
        <h1 className="hero-title" align="center">
          Find the exact moment in any video
        </h1>

        <p className="hero-sub">
         Ask a question in plain English and jump straight to the exact moment in the video.
        </p>

        <div className="search-wrap">
          <input
            className="search-input"
            placeholder="e.g. How do I use a for loop?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                search();
              }
            }}
          />

          <button
            className="search-btn"
            onClick={() => search()}
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        <div className="chips">
          <span className="chip-label">Try an example</span>

          {EXAMPLES.map((example) => (
            <button
              key={example}
              className="chip"
              onClick={() => search(example)}
            >
              {example}
            </button>
          ))}
        </div>

        {loading && (
          <div className="loading-row">
            <div className="dot-loader">
              <span />
              <span />
              <span />
            </div>
            Searching transcript...
          </div>
        )}

        {error && <div className="error">{error}</div>}

        {result && (
          <div className="result">
            <div className="result-header">
              <div className="result-label">
                <div className="result-dot" />
                Best match found
              </div>

              <span className="confidence">Confidence {confidence}</span>
            </div>

            <div className="result-body">
              {isWeakMatch && (
                <div className="weak-match">
                  No strong match found. Showing the closest segment from this
                  video.
                </div>
              )}

              <div className="ts-block">
                <div className="ts-icon-wrap">⏱</div>

                <div className="ts-meta">
                  <span className="ts-meta-label">Timestamp</span>
                  <span className="ts-meta-value">
                    {result.timestamp || "N/A"}
                  </span>
                </div>
              </div>

              <p className="snippet-label">Transcript </p>

              <p className="snippet-text">
                {result.text || "No snippet available."}
              </p>
            </div>

            {result.video_url && (
              <div className="result-footer">
                <a
                  className="watch-link"
                  href={result.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Watch from {result.timestamp || "selected timestamp"}
                </a>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}