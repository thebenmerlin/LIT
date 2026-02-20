import { useState } from 'react';
import styles from './SearchBar.module.css';

export default function SearchBar({ onSearch, isLoading }) {
    const [input, setInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            onSearch(input);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <form className={styles.searchContainer} onSubmit={handleSubmit}>
            <textarea
                className={styles.searchInput}
                placeholder="Ask a legal question or search precedent..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                rows={1}
            />
            <button
                type="submit"
                className={styles.searchButton}
                disabled={isLoading || !input.trim()}
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
            </button>
        </form>
    );
}
