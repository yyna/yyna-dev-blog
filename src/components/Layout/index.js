import React from 'react';
import * as styles from './Layout.module.css';
import { Link } from 'gatsby';
import { faGithubAlt } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Layout({ children }) {
  return (
    <>
      <section className={styles.head}>
        <Link to="/">
          <header className={styles.header}>{'YYNA DEV'}</header>
        </Link>
        <div className={styles.subhead}>
          <Link to="/?category=tech" className={styles.category}>
            tech
          </Link>
          |
          <Link to="/?category=book_review" className={styles.category}>
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
