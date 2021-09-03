import React from 'react';
import Layout from 'src/components/Layout';
import BlogCard from 'src/components/BlogCard';
import { Helmet } from 'react-helmet';
import { graphql } from 'gatsby';

export const query = graphql`
  query SITE_INDEX_QUERY {
    site {
      siteMetadata {
        title
        description
      }
    }
    allMdx(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { published: { eq: true } } }
    ) {
      nodes {
        frontmatter {
          title
          description
          image
          date(formatString: "YYYY-MM-DD")
          category
        }
        fields {
          slug
        }
      }
    }
  }
`;

const Home = ({ data, location }) => {
  const {
    allMdx: { nodes: blogs },
    site: { siteMetadata },
  } = data;

  const params = new URLSearchParams(location.search);
  const c = params.get('category');

  return (
    <Layout>
      <Helmet>
        <title>{siteMetadata.title}</title>
        <meta name="description" content={siteMetadata.description} />
        <meta property="og:title" content={`${siteMetadata.title}`} />
        <meta property="og:url" content={`https://yyna.dev`} />
        <meta property="og:image" content={`https://yyna.dev/_thumbnail.png`} />
        <meta property="og:image:width" content="900" />
        <meta property="og:image:height" content="481" />
        <meta property="og:description" content={siteMetadata.description} />

        <meta name="twitter:title" content={`${siteMetadata.title}`} />
        <meta name="twitter:description" content={siteMetadata.description} />
        <meta
          name="twitter:image"
          content={`https://yyna.dev/_thumbnail.png`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@yyna_kwon" />
      </Helmet>
      <div className="blogcards">
        {blogs
          .filter(({ frontmatter: { category } }) => {
            return c == undefined ? true : category == c;
          })
          .map(
            ({
              frontmatter: { title, description, date, image, category },
              fields: { slug },
            }) => (
              <BlogCard
                key={title}
                title={title}
                description={description}
                image={image}
                date={date}
                slug={slug}
                category={category}
              />
            )
          )}
      </div>
    </Layout>
  );
};

export default Home;
