module.exports = {
  siteMetadata: {
    title: '( yyna.dev )',
    siteUrl: 'https://yyna.dev/',
    description: '#Developer, #Clojure, #Seoul',
    home: {
      title: '권정인, Jungin Kwon',
      description: '#Developer, #Clojure, #Seoul',
    },
  },
  plugins: [
    `gatsby-plugin-sharp`,
    'gatsby-plugin-netlify-cms',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sitemap',
    'gatsby-transformer-remark',
    'gatsby-plugin-root-import',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'pages',
        path: './src/pages/',
      },
      __key: 'pages',
    },
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        extensions: ['.mdx', '.md'],
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'blogs',
        path: `${__dirname}/blogs`,
      },
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: 'UA-167254649-1',
        head: true,
      },
    },
  ],
};
