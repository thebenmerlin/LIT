import styles from './InsightPanel.module.css';

interface InsightPanelProps {
    activeCase: any | null;
}

export default function InsightPanel({ activeCase }: InsightPanelProps) {

    if (!activeCase) {
        return (
            <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>§</div>
                <h3>No Case Selected</h3>
                <p>Select a precedent from your research terminal to view insights.</p>
            </div>
        );
    }

    const { score, metadata } = activeCase;
    const percentage = (score * 100).toFixed(1);

    return (
        <div className={styles.panelContainer}>
            <header className={styles.header}>
                <div className={styles.topMeta}>
                    <span className={styles.badge}>{metadata.year}</span>
                    <span className={styles.badge}>{metadata.court}</span>
                    <span className={styles.scoreBadge}>{percentage}% Match</span>
                </div>
                <h2 className={styles.title}>{metadata.title}</h2>
            </header>

            <div className={styles.scrollArea}>

                {/* SUMMARY SECTION */}
                <section className={styles.insightSection}>
                    <h3 className={styles.sectionTitle}>Structured Summary</h3>
                    <div className={styles.block}>
                        <h4>1. Facts</h4>
                        <p>This dispute centers around an alleged breach of an unliquidated commercial contract. The plaintiff contends failure of timely performance.</p>
                    </div>
                    <div className={styles.block}>
                        <h4>2. Issue</h4>
                        <p>Whether the damages claimed fall under natural and proximate consequences of the breach, or if they are to be considered remote and indirect under statutory interpretation.</p>
                    </div>
                    <div className={styles.block}>
                        <h4>3. Holding</h4>
                        <p>The court awarded nominal damages, finding that exact quantification of expected profit loss was speculative and not strictly proven, though the breach itself was affirmed.</p>
                    </div>
                </section>

                <div className={styles.divider}></div>

                {/* CITATIONS SECTION */}
                <section className={styles.insightSection}>
                    <h3 className={styles.sectionTitle}>Extracted Citations</h3>
                    <ul className={styles.citationList}>
                        <li>
                            <span className={styles.citeName}>Hadley v. Baxendale</span>
                            <span className={styles.citeContext}>Key principle test for remoteness of damages.</span>
                        </li>
                        <li>
                            <span className={styles.citeName}>{metadata.sections}</span>
                            <span className={styles.citeContext}>Core statutory framework applied to the dispute.</span>
                        </li>
                    </ul>
                </section>

                <div className={styles.divider}></div>

                {/* FUTURE EXTENSIBILITY */}
                <section className={`${styles.insightSection} ${styles.futureState}`}>
                    <h3 className={styles.sectionTitle}>Element Mapping Preview</h3>
                    <div className={styles.lockedArea}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                        <p>Element mapping graph unavailable in phase 4. Will unlock in future argument-graph releases.</p>
                    </div>
                </section>

            </div>
        </div>
    );
}
