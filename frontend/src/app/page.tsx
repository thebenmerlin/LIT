"use client";

import { useState } from "react";
import styles from "./page.module.css";
import SearchBar from "@/components/SearchBar";
import CaseResultCard from "@/components/CaseResultCard";
import InsightPanel from "@/components/InsightPanel";

// Mock SVG icons for the sidebar
const IconResearch = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);
const IconSaved = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
  </svg>
);
const IconStatute = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
  </svg>
);
const IconGraph = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"></circle>
    <circle cx="6" cy="12" r="3"></circle>
    <circle cx="18" cy="19" r="3"></circle>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
  </svg>
);

export default function Terminal() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeCase, setActiveCase] = useState<any | null>(null);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setQuery(searchQuery);
    setIsLoading(true);
    setResults([]);
    setActiveCase(null);

    // Simulate API search loading
    try {
      // In Phase 3, this will hook deeply into the FastAPI backend
      const response = await fetch("http://127.0.0.1:8000/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery, top_k: 5 }),
      });

      if (!response.ok) throw new Error("Search failed");
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error("Error fetching cases:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.layoutContainer}>

      {/* 1. LEFT - Navigation Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logoContainer}>
          <div className={styles.logoMark}>L</div>
          <h2 className={styles.logoText}>Litigation Intelligence Terminal</h2>
        </div>

        <nav className={styles.navigation}>
          <div className={`${styles.navItem} ${styles.navActive}`}>
            <IconResearch />
            <span>Research</span>
          </div>
          <div className={styles.navItem}>
            <IconSaved />
            <span>Saved Cases</span>
          </div>

          <div className={styles.navDivider}></div>
          <div className={styles.navHeader}>Intelligence</div>

          <div className={styles.navItem}>
            <IconStatute />
            <span>Statutory Elements</span>
            <span className={styles.futureTag}>Soon</span>
          </div>
          <div className={styles.navItem}>
            <IconGraph />
            <span>Argument Graph</span>
            <span className={styles.futureTag}>Soon</span>
          </div>
        </nav>
      </aside>

      {/* 2. CENTER - Primary Research Terminal */}
      <main className={styles.mainPanel}>
        <div className={styles.searchHeaderArea}>
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>

        <div className={styles.resultsArea}>
          {isLoading && (
            <div className={styles.loadingSkeletonContainer}>
              {[1, 2, 3].map(i => (
                <div key={i} className={styles.skeletonCard}></div>
              ))}
            </div>
          )}

          {!isLoading && results.map((res, i) => (
            <CaseResultCard
              key={res.metadata.id}
              data={res}
              index={i}
              isActive={activeCase?.metadata.id === res.metadata.id}
              onClick={() => setActiveCase(res)}
            />
          ))}

          {!isLoading && results.length === 0 && query && (
            <div className={styles.noResults}>No exact precedents found for &quot;{query}&quot;.</div>
          )}
        </div>
      </main>

      {/* 3. RIGHT - Insight Panel */}
      <aside className={styles.insightPanel}>
        <InsightPanel activeCase={activeCase} />
      </aside>

    </div>
  );
}
