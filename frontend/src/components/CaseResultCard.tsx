import styles from './CaseResultCard.module.css';

interface CaseData {
    score: number;
    metadata: {
        id: number;
        title: string;
        court: string;
        year: number;
        sections: string;
        source_file: string;
    };
}

interface CaseResultCardProps {
    data: CaseData;
    index: number;
    isActive: boolean;
    onClick: () => void;
}

export default function CaseResultCard({ data, index, isActive, onClick }: CaseResultCardProps) {
    const { score, metadata } = data;
    const percentage = (score * 100).toFixed(1);

    return (
        <div
            className={`${styles.card} ${isActive ? styles.active : ''}`}
            onClick={onClick}
        >
            <div className={styles.cardHeader}>
                <div className={styles.metaRow}>
                    <span className={styles.metaCourt}>{metadata.court}</span>
                    <span className={styles.metaYear}>{metadata.year}</span>
                </div>

                <div className={styles.scoreBadge}>
                    {percentage}% Match
                </div>
            </div>

            <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{metadata.title}</h3>

                {/* 2-3 Line Summary Preview Simulation */}
                <p className={styles.summaryPreview}>
                    Judgment analysis concerning {metadata.sections}. The court examined the principles of unliquidated damages and remoteness of breach in commercial disputes, citing established statutory precedents.
                </p>
            </div>

            <div className={styles.cardFooter}>
                <button className={styles.expandBtn}>
                    {isActive ? "Viewing Insight" : "Expand Insights"}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
