const faviconsPlugin = require("eleventy-plugin-gen-favicons");

const pluginPDFEmbed = require("eleventy-plugin-pdfembed");

const embedYouTube = require("eleventy-plugin-youtube-embed");

const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");

module.exports = function(eleventyConfig) {
    // Copy the `css` directory to the output
    eleventyConfig.addPassthroughCopy("./src/styles");

    // Watch the `css` directory for changes
    eleventyConfig.addWatchTarget('./src/styles');

    eleventyConfig.addPassthroughCopy("./src/images/");
    
    eleventyConfig.addPassthroughCopy({"./src/favicons": "/"});

    // eleventyConfig.addPassthroughCopy("./src/favicons")

    eleventyConfig.addPassthroughCopy("./src/assets/");

    eleventyConfig.addPassthroughCopy("./src/h5p-content/");

    eleventyConfig.addPassthroughCopy("./src/pdf-content")
    
    // favicon plugin
    eleventyConfig.addPlugin(faviconsPlugin, {});

    eleventyConfig.addPlugin(pluginPDFEmbed, {
		key: '70e713a9f68441eaa876ebca12ea8bf8'
	});

    eleventyConfig.addPlugin(embedYouTube);

    eleventyConfig.addPlugin(eleventyNavigationPlugin);

    eleventyConfig.addShortcode("quizlet", (url) => 
        `<iframe src="${url}" height="500" width="100%" style="border:0"></iframe>`
    );
    
    return {
        dir: {
            input: "src"
            // output: "public"
        }
    };
};