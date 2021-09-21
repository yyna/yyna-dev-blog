import React from 'react';
import { Link } from 'gatsby';
import * as styles from './BlogCard.module.css';

export default function BlogCard({
  image,
  title,
  description,
  slug,
  date,
  category,
}) {
  console.log(image);
  return (
    <Link to={slug} className={styles.card}>
      {image ? (
        <div
          className={styles.image__wrapper}
          style={{ backgroundImage: `url(${image})` }}
        ></div>
      ) : (
        <div className={styles.fake__thumbnail}>
          {title.replace(/\s/g, '\n')}
        </div>
      )}
      <div className={styles.head}>
        <div className={`${styles.headline} ${styles[category]}`}>{title}</div>
        <p>
          <span className={styles.date}>{date}</span>
        </p>
        <div className={styles.description}>{description}</div>
      </div>
    </Link>
  );
}
