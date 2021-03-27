module.exports = {
  siteMetadata: {
    title: "miso-blog",
  },
  plugins: [
    "gatsby-plugin-netlify-cms",
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-sitemap",
    "gatsby-transformer-remark",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "pages",
        path: "./src/pages/",
      },
      __key: "pages",
    },
  ],
};
