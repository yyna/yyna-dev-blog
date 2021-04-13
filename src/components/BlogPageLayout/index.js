import React from 'react';
import { graphql } from 'gatsby';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import { DiscussionEmbed } from 'disqus-react';
import { Helmet } from 'react-helmet';

import * as styles from './BlogPageLayout.module.css';

import Layout from 'src/components/Layout';

export const query = graphql`
  query PostsByID($id: String!) {
    site {
      siteMetadata {
        title
        description
      }
    }
    mdx(id: { eq: $id }) {
      body
      frontmatter {
        image
        title
        date(formatString: "YYYY-MM-DD")
        tags
        disqusIdentifier
      }
      fields {
        slug
      }
    }
  }
`;

export default function BlogPageLayout({ data }) {
  const {
    mdx: {
      frontmatter: { image, title, date, tags, disqusIdentifier, description },
      fields: { slug },
      body,
    },
    site: { siteMetadata },
  } = data;

  return (
    <Layout>
      <Helmet>
        <title>
          {title} | {siteMetadata.title}
        </title>
        <meta name="description" content={description} />
        <meta
          property="og:title"
          content={`${title} | ${siteMetadata.title}`}
        />
        <meta property="og:url" content={`https://yyna.dev${slug}`} />
        <meta property="og:image" content={`https://yyna.dev${image}`} />
        <meta property="og:image:width" content="900" />
        <meta property="og:image:height" content="481" />
        <meta property="og:description" content={description} />

        {/* twitter */}
        <meta
          name="twitter:title"
          content={`${title} | ${siteMetadata.title}`}
        />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={`https://yyna.dev${image}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@yyna_kwon" />
      </Helmet>
      <div
        className={styles.background}
        style={{ backgroundImage: `url(${image})` }}
      ></div>
      <div className={styles.container}>
        <div className={styles.categories}>
          {tags.map((tag) => (
            <span className={styles.category} key={tag}>
              # {tag}
            </span>
          ))}
        </div>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.date}>{date}</div>

        <div className={styles.body}>
          <MDXRenderer>{body}</MDXRenderer>
        </div>
      </div>
      <div className={styles.disqus__wrapper}>
        <DiscussionEmbed
          shortname="yyna-dev"
          config={{ identifier: disqusIdentifier || slug }}
          url={`https://yyna.dev${slug}`}
        />
      </div>
    </Layout>
  );
}
