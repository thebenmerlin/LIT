import styles from './CaseResultCard.module.css';

export default function CaseResultCard({ data, index, isActive, onClick }) {
    const { score, metadata } = data;
    const percentage = (score * 100).toFixed(1);

    return (
        <div
            className={`${styles.card} ${isActive ? styles.active : ''}`}
            onClick={onClick}
        >
            <div className={styles.cardHeader}>
                <div className={styles.rankBadge}>{index + 1}</div>
                <div className={styles.scoreBadge}>
                    {percentage}% Match
                </div>
            </div>

            <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{metadata.title}</h3>

                <div className={styles.metaRow}>
                    <span className={styles.metaItem}>{metadata.court}</span>
                    <span className={styles.metaDot}>•</span>
                    <span className={styles.metaItem}>{metadata.year}</span>
                </div>

                <p className={styles.sectionInfo}>
                    {metadata.sections}
                </p>
            </div>
        </div>
    );
}
