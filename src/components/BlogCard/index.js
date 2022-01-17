import React from 'react';
import { Link } from 'gatsby';
import * as styles from './BlogCard.module.css';

export default function BlogCard({ title, description, slug, date, category }) {
  return (
    <Link to={slug} className={styles.card}>
      <div className={styles.date}>{date}</div>
      <div className={`${styles.headline} ${styles[category]}`}>{title}</div>
      <div className={styles.description}>{description}</div>
    </Link>
  );
}
