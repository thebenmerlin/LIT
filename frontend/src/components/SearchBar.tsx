import { useState, KeyboardEvent } from 'react';
import styles from './SearchBar.module.css';

interface SearchBarProps {
    onSearch: (query: string) => void;
    isLoading: boolean;
}

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
    const [input, setInput] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            onSearch(input);
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e as unknown as React.FormEvent);
        }
    };

    return (
        <div className={styles.wrapper}>
            <form className={styles.searchContainer} onSubmit={handleSubmit}>
                <textarea
                    className={styles.searchInput}
                    placeholder="Search Section 73 jurisprudence..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                    rows={1}
                />
                <button
                    type="submit"
                    className={`${styles.searchButton} ${isLoading ? styles.loadingBtn : ''}`}
                    disabled={isLoading || !input.trim()}
                >
                    {isLoading ? (
                        <div className={styles.spinner}></div>
                    ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                    )}
                </button>
            </form>
            <div className={styles.hintText}>Press <kbd>Enter</kbd> to search</div>
        </div>
    );
}
