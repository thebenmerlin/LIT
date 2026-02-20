"use client";

import { useState } from "react";
import styles from "./page.module.css";
import SearchBar from "@/components/SearchBar";
import CaseResultCard from "@/components/CaseResultCard";

export default function Terminal() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeCase, setActiveCase] = useState(null);

  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;

    setQuery(searchQuery);
    setIsLoading(true);
    setResults([]);
    setActiveCase(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery, top_k: 5 }),
      });

      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error("Error fetching cases:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* LEFT PANEL */}
      <section className={styles.leftPanel}>
        <div className={styles.historySection}>
          <div className={styles.historyHeader}>
            <h1 className={styles.title}>LIT (Legal Intelligence Terminal)</h1>
            <p className={styles.subtitle}>Enter a query to find relevant judicial precedent.</p>
          </div>

          <div className={styles.resultsList}>
            {isLoading && <div className={styles.loader}>Searching index...</div>}

            {!isLoading && results.map((res, i) => (
              <CaseResultCard
                key={res.metadata.id}
                data={res}
                index={i}
                isActive={activeCase?.metadata.id === res.metadata.id}
                onClick={() => setActiveCase(res)}
              />
            ))}
          </div>
        </div>

        <div className={styles.inputSection}>
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>
      </section>

      {/* RIGHT PANEL */}
      <section className={styles.rightPanel}>
        {activeCase ? (
          <div className={styles.documentViewer}>
            <div className={styles.viewerHeader}>
              <div className={styles.viewerMeta}>
                <span className={styles.metaBadge}>{activeCase.metadata.year}</span>
                <span className={styles.metaBadge}>{activeCase.metadata.court}</span>
                <span className={styles.metaScoreBadge}>Similarity: {(activeCase.score * 100).toFixed(1)}%</span>
              </div>
              <h2 className={styles.viewerTitle}>{activeCase.metadata.title}</h2>
              <p className={styles.viewerSections}>{activeCase.metadata.sections}</p>
            </div>

            <div className={styles.viewerContent}>
              <div className={styles.mockDocumentArea}>
                <p>
                  <strong>Abstract / Excerpt:</strong><br /><br />
                  This is the document viewer pane. In a fully completed prototype, the raw text of
                  <em> {activeCase.metadata.source_file} </em> would be loaded here from the backend to allow the attorney to read the judgment.
                </p>
                <div className={styles.mockLines}>
                  <div className={styles.line}></div>
                  <div className={styles.line}></div>
                  <div className={styles.line}></div>
                  <div className={styles.line} style={{ width: '80%' }}></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>§</div>
            <h3>Workspace Empty</h3>
            <p>Select a case from the results to view the full judgment document.</p>
          </div>
        )}
      </section>
    </div>
  );
}
