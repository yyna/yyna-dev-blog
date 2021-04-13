import React from 'react';
import { Link } from 'gatsby';
import * as styles from './BlogCard.module.css';

export default function BlogCard({ image, title, description, slug, tags }) {
  return (
    <Link to={slug} className={styles.card}>
      <div
        className={styles.image__wrapper}
        style={{ backgroundImage: `url(${image})` }}
      ></div>
      <div className={styles.content}>
        <div className={styles.title}>{title}</div>
        <div className={styles.description}>{description}</div>
        <div className={styles.categories}>
          {tags.map((tag) => (
            <span className={styles.category} key={tag}>
              # {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
