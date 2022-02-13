import React from 'react';
import { Link } from 'gatsby';
import * as styles from './BlogCard.module.css';

export default function BlogCard({
  title,
  description,
  slug,
  date,
  category,
  link,
}) {
  if (!!link) {
    return (
      <a href={link} className={styles.card} target="_blank">
        <div className={styles.date}>{date}</div>
        <div className={styles.link}>{link}</div>
        <div className={`${styles.headline} ${styles[category]}`}>{title}</div>
        <div className={styles.description}>{description}</div>
      </a>
    );
  } else {
    return (
      <Link to={slug} className={styles.card}>
        <div className={styles.date}>{date}</div>
        <div className={`${styles.headline} ${styles[category]}`}>{title}</div>
        <div className={styles.description}>{description}</div>
      </Link>
    );
  }
}
