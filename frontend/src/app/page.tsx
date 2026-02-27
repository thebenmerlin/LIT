"use client";

import { useState, useRef, useEffect, MouseEvent as ReactMouseEvent } from "react";
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

import { getAllCases, getSavedCases, toggleSavedCase as toggleSavedCaseAction } from "./actions";

export default function Terminal() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeCase, setActiveCase] = useState<any | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [savedCases, setSavedCases] = useState<any[]>([]);
  const [allCases, setAllCases] = useState<any[]>([]);

  useEffect(() => {
    getAllCases().then(setAllCases).catch(console.error);
    getSavedCases().then(setSavedCases).catch(console.error);
  }, []);

  // Navigation State
  const [activeTab, setActiveTab] = useState("research"); // research, saved, statutory, graph

  // Resize State
  const [leftWidth, setLeftWidth] = useState(260);
  const [rightWidth, setRightWidth] = useState(380);

  const isResizingLeft = useRef(false);
  const isResizingRight = useRef(false);

  // Global mouse event listeners for dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingLeft.current && !isResizingRight.current) return;

      if (isResizingLeft.current) {
        // Constrain left sidebar (min 200px, max 400px)
        const newWidth = Math.max(200, Math.min(e.clientX, 400));
        setLeftWidth(newWidth);
      } else if (isResizingRight.current) {
        // Constrain right sidebar (min 300px, max 600px)
        const newWidth = Math.max(300, Math.min(window.innerWidth - e.clientX, 600));
        setRightWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      isResizingLeft.current = false;
      isResizingRight.current = false;
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto'; // Re-enable selection
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const startResizingLeft = (e: ReactMouseEvent) => {
    e.preventDefault();
    isResizingLeft.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none'; // Prevent text selection while dragging
  };

  const startResizingRight = (e: ReactMouseEvent) => {
    e.preventDefault();
    isResizingRight.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const QUICK_SEARCHES = [
    "Section 73 Indian Evidence Act",
    "Article 20(3) Self-incrimination",
    "Admissibility of Expert Opinion"
  ];

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setQuery(searchQuery);
    setIsLoading(true);
    setHasSearched(true);
    setResults([]);
    setActiveCase(null);

    // Simulate network delay for demo
    setTimeout(() => {
      // Filter mock data based on keywords
      const keywords = searchQuery.toLowerCase().split(/\s+/).filter(k => k.length > 0);

      const filtered = allCases.filter(c => {
        const searchableText = [
          c.metadata.title,
          c.metadata.court,
          c.metadata.year.toString(),
          c.metadata.sections,
          c.metadata.summary,
          c.abstract,
          ...(c.citations || [])
        ].join(" ").toLowerCase();

        // Check if ALL keywords are present in the searchable text
        return keywords.every(kw => searchableText.includes(kw));
      });

      // Sort by score for demo realism
      filtered.sort((a, b) => b.score - a.score);

      // If no exact match via filter, just return all of them for demo purposes
      // so the UI always has *something* to show.
      setResults(filtered.length > 0 ? filtered : allCases);
      setIsLoading(false);
    }, 800);
  };

  const toggleSaveCase = async (caseToToggle: any) => {
    const isSaved = isCaseSaved(caseToToggle.metadata.id);

    // Optimistic UI update
    setSavedCases(prev => {
      if (isSaved) {
        return prev.filter(c => c.metadata.id !== caseToToggle.metadata.id);
      } else {
        return [caseToToggle, ...prev]; // Prepend new saved cases
      }
    });

    // Server Action
    try {
      await toggleSavedCaseAction(caseToToggle.metadata.id, !isSaved);
    } catch (err) {
      console.error("Error toggling saved case", err);
    }
  };

  const isCaseSaved = (caseId: string) => {
    return savedCases.some(c => c.metadata.id === caseId);
  };

  return (
    <div
      className={styles.layoutContainer}
      style={{
        '--left-width': `${leftWidth}px`,
        '--right-width': activeCase ? `${rightWidth}px` : '0px',
        '--right-gap': activeCase ? '4px' : '0px'
      } as React.CSSProperties}
    >

      {/* 1. LEFT - Navigation Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logoContainer}>
          <div className={styles.logoMark}>L</div>
          <h2 className={styles.logoText}>Litigation Intelligence Terminal</h2>
        </div>

        <nav className={styles.navigation}>
          <div
            className={`${styles.navItem} ${activeTab === 'research' ? styles.navActive : ''}`}
            onClick={() => {
              setActiveTab('research');
              setHasSearched(false);
              setQuery("");
              setActiveCase(null);
              setIsExpanded(false);
            }}
          >
            <IconResearch />
            <span>Research</span>
          </div>
          <div
            className={`${styles.navItem} ${activeTab === 'saved' ? styles.navActive : ''}`}
            onClick={() => setActiveTab('saved')}
          >
            <IconSaved />
            <span>Saved Cases</span>
          </div>

          <div className={styles.navDivider}></div>
          <div className={styles.navHeader}>Intelligence</div>

          <div
            className={`${styles.navItem} ${activeTab === 'statutory' ? styles.navActive : ''}`}
            onClick={() => setActiveTab('statutory')}
          >
            <IconStatute />
            <span>Statutory Elements</span>
            <span className={styles.futureTag}>Soon</span>
          </div>
          <div
            className={`${styles.navItem} ${activeTab === 'graph' ? styles.navActive : ''}`}
            onClick={() => setActiveTab('graph')}
          >
            <IconGraph />
            <span>Argument Graph</span>
            <span className={styles.futureTag}>Soon</span>
          </div>
        </nav>
      </aside>

      {/* Resizer LEFT */}
      <div
        className={styles.resizer}
        onMouseDown={startResizingLeft}
      />

      {/* 2. CENTER - Primary Terminal Content */}
      <main className={styles.mainPanel}>
        {activeTab === 'research' && (
          <>
            {!hasSearched ? (
              <div className={styles.centeredSearchArea}>
                <div style={{ marginBottom: "20px", textAlign: "center" }}>
                  <div className={styles.logoMark} style={{ margin: "0 auto", width: "48px", height: "48px", fontSize: "1.6rem", marginBottom: "16px" }}>L</div>
                  <h2 className={styles.logoText} style={{ fontSize: "1.4rem" }}>How can I assist your legal research today?</h2>
                </div>

                <div className={styles.centeredSearchWrapper}>
                  <SearchBar onSearch={handleSearch} isLoading={isLoading} />
                  <div className={styles.quickSearchContainer}>
                    {QUICK_SEARCHES.map((qs, i) => (
                      <button
                        key={i}
                        className={styles.quickSearchPill}
                        onClick={() => handleSearch(qs)}
                        disabled={isLoading}
                      >
                        {qs}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className={styles.searchHeaderArea}>
                  <SearchBar onSearch={handleSearch} isLoading={isLoading} />

                  <div className={styles.quickSearchContainer} style={{ justifyContent: "flex-start" }}>
                    <span className={styles.quickSearchLabel}>Quick searches:</span>
                    {QUICK_SEARCHES.map((qs, i) => (
                      <button
                        key={i}
                        className={styles.quickSearchPill}
                        onClick={() => handleSearch(qs)}
                        disabled={isLoading}
                      >
                        {qs}
                      </button>
                    ))}
                  </div>
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
              </>
            )}
          </>
        )}

        {/** DEMO PLACEHOLDERS **/}
        {activeTab === 'saved' && (
          <div className={styles.placeholderView}>
            <h2>Saved Cases Library</h2>
            <p>Your pinned precedents and structured research folios will appear here.</p>

            {savedCases.length === 0 ? (
              <div className={styles.placeholderBox}>
                <div style={{ opacity: 0.5 }}>No cases saved yet. Open a case from the Research terminal and click the bookmark icon to save it here.</div>
              </div>
            ) : (
              <div className={styles.resultsArea} style={{ padding: "24px 0", flex: "none", overflow: "visible" }}>
                {savedCases.map((res, i) => (
                  <CaseResultCard
                    key={`saved-${res.metadata.id}`}
                    data={res}
                    index={i}
                    isActive={activeCase?.metadata.id === res.metadata.id}
                    onClick={() => setActiveCase(res)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'statutory' && (
          <div className={styles.placeholderView}>
            <h2>Statutory Elements Graph</h2>
            <p>Visual mapping of statutory requirements against proven facts. Scheduled for Phase 6.</p>
            <div className={styles.graphPlaceholder}>
              &#128300; Module under construction
            </div>
          </div>
        )}

        {activeTab === 'graph' && (
          <div className={styles.placeholderView}>
            <h2>Argument Topology</h2>
            <p>Macro-level visual breakdown of winning arguments for specific claim types.</p>
            <div className={styles.graphPlaceholder}>
              &#128300; Module under construction
            </div>
          </div>
        )}
      </main>

      {/* Resizer RIGHT - only show if there is an active case and not expanded */}
      {activeCase && !isExpanded && (
        <div
          className={styles.resizer}
          onMouseDown={startResizingRight}
        />
      )}

      {/* 3. RIGHT - Insight Panel (Sidebar or Modal) */}
      {activeCase && (
        isExpanded ? (
          <div className={styles.modalOverlay} onClick={() => setIsExpanded(false)}>
            <div className={styles.expandedModal} onClick={e => e.stopPropagation()}>
              <div style={{ position: "absolute", top: "16px", right: "16px", display: "flex", gap: "8px", zIndex: 10 }}>
                <button
                  className={styles.iconButton}
                  onClick={() => toggleSaveCase(activeCase)}
                  title={isCaseSaved(activeCase.metadata.id) ? "Remove from Saved" : "Save Case"}
                  style={{ position: 'relative', top: 0, right: 0 }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill={isCaseSaved(activeCase.metadata.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                  </svg>
                </button>
                <button
                  className={styles.iconButton}
                  onClick={() => setIsExpanded(false)}
                  title="Close"
                  style={{ position: 'relative', top: 0, right: 0 }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              <InsightPanel activeCase={activeCase} />
            </div>
          </div>
        ) : (
          <aside className={styles.insightPanel}>
            <div style={{ position: "absolute", top: "16px", right: "16px", display: "flex", gap: "8px", zIndex: 10 }}>
              <button
                className={styles.iconButton}
                onClick={() => toggleSaveCase(activeCase)}
                title={isCaseSaved(activeCase.metadata.id) ? "Remove from Saved" : "Save Case"}
                style={{ position: 'relative', top: 0, right: 0 }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill={isCaseSaved(activeCase.metadata.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
              </button>
              <button
                className={styles.iconButton}
                onClick={() => setIsExpanded(true)}
                title="Expand Case View"
                style={{ position: 'relative', top: 0, right: 0 }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <polyline points="9 21 3 21 3 15"></polyline>
                  <line x1="21" y1="3" x2="14" y2="10"></line>
                  <line x1="3" y1="21" x2="10" y2="14"></line>
                </svg>
              </button>
            </div>
            <InsightPanel activeCase={activeCase} />
          </aside>
        )
      )}

    </div>
  );
}
