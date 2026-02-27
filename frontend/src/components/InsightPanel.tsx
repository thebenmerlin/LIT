import styles from './InsightPanel.module.css';

interface CaseData {
    score: number;
    metadata: {
        id: string;
        title: string;
        court: string;
        year: number;
        sections: string;
        source_file?: string;
        summary: string;
    };
    abstract: string;
    citations: string[];
}

interface InsightPanelProps {
    activeCase: CaseData | null;
}

export default function InsightPanel({ activeCase }: InsightPanelProps) {
    if (!activeCase) {
        return (
            <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                </div>
                <p>No precedent selected. Click a case from the research list to view structural insights.</p>
            </div>
        );
    }

    const { metadata, score } = activeCase;
    const percentage = (score * 100).toFixed(1);

    return (
        <div className={styles.container}>
            {/* Header Area */}
            <div className={styles.header}>
                <div className={styles.badgeRow}>
                    <span className={styles.matchBadge}>{percentage}% Structural Match</span>
                    <span className={styles.courtBadge}>{metadata.court} • {metadata.year}</span>
                </div>
                <h2 className={styles.title}>{metadata.title}</h2>
                <div className={styles.statuteLabel}>Primary Element: {metadata.sections}</div>
            </div>

            {/* Structured Summary Sections */}
            <div className={styles.contentArea}>

                <section className={styles.insightBlock}>
                    <h3 className={styles.blockTitle}>Summary Frame</h3>
                    <div className={styles.abstractGroup}>
                        <h4 className={styles.abstractSub}>Synopsis</h4>
                        <p className={styles.abstractText}>{metadata.summary}</p>

                        <h4 className={styles.abstractSub}>Key Findings</h4>
                        <p className={styles.abstractText}>{activeCase.abstract}</p>
                    </div>
                </section>

                <section className={styles.insightBlock}>
                    <h3 className={styles.blockTitle}>Extracted Citations</h3>
                    <ul className={styles.citationList}>
                        {activeCase.citations.map((cite, i) => (
                            <li key={i}><span className={styles.citeRef}>{cite}</span></li>
                        ))}
                    </ul>
                </section>

                {/* Locked Feature Placeholder */}
                <section className={`${styles.insightBlock} ${styles.lockedBlock}`}>
                    <div className={styles.lockedHeader}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                        <h3 className={styles.blockTitle}>Element Mapping Integration</h3>
                    </div>
                    <p className={styles.lockedText}>
                        Advanced entity processing and visual argument mapping is not available in the Early MVP footprint.
                        Available in Phase 6.
                    </p>
                </section>

            </div>
        </div>
    );
}
