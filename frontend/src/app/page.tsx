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

// --- DEMO MOCK DATA ---
const MOCK_DATA = [
  {
    score: 0.98,
    metadata: {
      id: "C-1988-234",
      title: "State of Maharashtra vs. R. K. Sharma",
      court: "Supreme Court of India",
      year: 1988,
      sections: "Section 73 of the Indian Evidence Act",
      summary: "A landmark judgment interpreting Section 73 of the Indian Evidence Act regarding the court's power to direct a person to give specimen signatures. The court held that such a direction does not violate the fundamental right against self-incrimination under Article 20(3) of the Constitution."
    },
    abstract: "The core issue was whether a Magistrate could direct an accused to give specimen handwriting/signatures under Section 73 of the Evidence Act. The Supreme Court clarified the scope of Section 73, distinguishing it from Section 311A CrPC, and emphasized the necessity of such powers for the administration of justice without compromising constitutional safeguards.",
    citations: [
      "Article 20(3) of the Constitution of India",
      "Section 73 of the Indian Evidence Act, 1872",
      "Section 311A of the Code of Criminal Procedure, 1973"
    ]
  },
  {
    score: 0.85,
    metadata: {
      id: "C-2001-892",
      title: "P. R. Sharma vs. Union of India",
      court: "Delhi High Court",
      year: 2001,
      sections: "Section 45 & Section 73 of Evidence Act",
      summary: "This case dealt with the admissibility of expert opinion on handwriting and the evidentiary value of specimen signatures obtained under Section 73 of the Evidence Act in cases involving white-collar crimes and forgery."
    },
    abstract: "The High Court extensively analyzed the procedure for obtaining specimen signatures and the chain of custody required for such evidence to be admissible and reliable in court, particularly emphasizing the role of the Magistrate in ensuring the voluntariness of the samples provided.",
    citations: [
      "Section 45 of the Indian Evidence Act, 1872",
      "Section 73 of the Indian Evidence Act, 1872"
    ]
  },
  {
    score: 0.76,
    metadata: {
      id: "C-2015-104",
      title: "Vikas Kumar vs. State of UP",
      court: "Supreme Court of India",
      year: 2015,
      sections: "Section 73 Evidence Act, IT Act 2000",
      summary: "Further clarification on the intersection of Section 73 of the Evidence Act and modern forensic techniques, specifically challenging the authenticity of digital signatures and scanned documents."
    },
    abstract: "The Apex court ruled on the limitations of physical specimen signatures when dealing with complex digital forgery, highlighting the need for specialized cyber forensic tools alongside traditional Section 73 applications.",
    citations: [
      "Section 73 of the Indian Evidence Act, 1872",
      "Information Technology Act, 2000"
    ]
  }
];

export default function Terminal() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeCase, setActiveCase] = useState<any | null>(null);

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
    setResults([]);
    setActiveCase(null);

    // Simulate network delay for demo
    setTimeout(() => {
      // Filter mock data based on query (simple case-insensitive inclusion)
      const lowercaseQuery = searchQuery.toLowerCase();
      const filtered = MOCK_DATA.filter(c =>
        c.metadata.title.toLowerCase().includes(lowercaseQuery) ||
        c.metadata.summary.toLowerCase().includes(lowercaseQuery) ||
        c.abstract.toLowerCase().includes(lowercaseQuery) ||
        c.citations.some(cite => cite.toLowerCase().includes(lowercaseQuery))
      );

      // If no exact match via simple filter, just return all of them for demo purposes
      // so the UI always has *something* to show if they search random things
      setResults(filtered.length > 0 ? filtered : MOCK_DATA);
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div
      className={styles.layoutContainer}
      style={{
        '--left-width': `${leftWidth}px`,
        '--right-width': `${rightWidth}px`
      } as React.CSSProperties}
    >

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

      {/* Resizer LEFT */}
      <div
        className={styles.resizer}
        onMouseDown={startResizingLeft}
      />

      {/* 2. CENTER - Primary Research Terminal */}
      <main className={styles.mainPanel}>
        <div className={styles.searchHeaderArea}>
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />

          <div className={styles.quickSearchContainer}>
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
      </main>

      {/* Resizer RIGHT */}
      <div
        className={styles.resizer}
        onMouseDown={startResizingRight}
      />

      {/* 3. RIGHT - Insight Panel */}
      <aside className={styles.insightPanel}>
        <InsightPanel activeCase={activeCase} />
      </aside>

    </div>
  );
}
