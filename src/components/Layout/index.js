import React from 'react';
import * as styles from './Layout.module.css';
import { Link } from 'gatsby';
import { faGithubAlt } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Layout({ children }) {
  return (
    <>
      <section className={styles.header}>
        <div className="container">
          <div className={styles.navigator}>
            <Link className={styles.logo} to="/">
              <span className={styles.logo__blog}>{'{ yyna.dev }'}</span>
            </Link>
            <div>
              <a
                className={styles.button}
                href="https://github.com/yyna"
                target="_blank"
                rel="noreferrer"
              >
                <FontAwesomeIcon icon={faGithubAlt} />
              </a>
            </div>
          </div>
        </div>
      </section>
      {children}
      <section className={styles.footer}>
        <div className="container">
          @ 2021 - Web app coded by{' '}
          <a href="https://yyna.dev">
            Jungin Kwon{' '}
            <span role="img" aria-label="woman-raising-hand">
              🙋🏻‍♀️
            </span>
          </a>
        </div>
      </section>
    </>
  );
}
