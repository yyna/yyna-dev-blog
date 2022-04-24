import React from 'react';
import * as styles from './Layout.module.css';
import { Link } from 'gatsby';

export default function Layout({ children }) {
  return (
    <>
      <section className={styles.head}>
        <div className={styles.subhead}>
          <Link to="/" className={`${styles.category} ${styles.home}`}>
            yyna.dev
          </Link>
          |
          <Link to="/?category=tech" className={styles.category}>
            tech
          </Link>
          |
          <Link to="/?category=book-review" className={styles.category}>
            book review
          </Link>
          |
          <Link to="/?category=etc" className={styles.category}>
            etc
          </Link>
          |
          <a
            href="https://github.com/yyna"
            target="_blank"
            rel="noreferrer"
            className={styles.category}
          >
            github
          </a>
        </div>
      </section>
      {children}
    </>
  );
}
