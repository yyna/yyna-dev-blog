import React from 'react';
import * as styles from './Layout.module.css';
import { Link } from 'gatsby';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithubAlt, faLinkedin } from '@fortawesome/free-brands-svg-icons';

export default function Layout({ children }) {
  return (
    <>
      <section className={styles.head}>
        <div className={styles.subhead}>
          <Link to="/" className={`${styles.category} ${styles.home}`}>
            yyna.dev
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
            <FontAwesomeIcon icon={faGithubAlt} />
          </a>
          |
          <a
            href="https://www.linkedin.com/in/jungin/"
            target="_blank"
            rel="noreferrer"
            className={styles.category}
          >
            <FontAwesomeIcon icon={faLinkedin} />
          </a>
        </div>
      </section>
      {children}
    </>
  );
}
