import React from 'react';
import * as styles from './Layout.module.css';
import { Link } from 'gatsby';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGithubAlt,
  faYoutube,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons';

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
            href="https://twitter.com/yyna_x"
            target="_blank"
            rel="noreferrer"
            className={styles.category}
          >
            <FontAwesomeIcon icon={faTwitter} />
          </a>
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
            href="https://www.youtube.com/@yyna"
            target="_blank"
            rel="noreferrer"
            className={styles.category}
          >
            <FontAwesomeIcon icon={faYoutube} />
          </a>
        </div>
      </section>
      {children}
    </>
  );
}
