const embedYouTube = require("eleventy-plugin-youtube-embed");

const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");

const { EleventyRenderPlugin } = require("@11ty/eleventy");

// const eleventyWebcPlugin = require("@11ty/eleventy-plugin-webc");
// const { eleventyImagePlugin } = require("@11ty/eleventy-img");
const Image = require("@11ty/eleventy-img");

const faviconsPlugin = require("eleventy-plugin-gen-favicons");

// Table of Content for markdown
const pluginTOC = require('eleventy-plugin-toc');

// search
const { execSync } = require('child_process');

module.exports = function(eleventyConfig) {
    // Copy the `css` directory to the output
    eleventyConfig.addPassthroughCopy("./src/styles");

    // Watch the `css` directory for changes
    eleventyConfig.addWatchTarget('./src/styles');

    // eleventyConfig.addPassthroughCopy("./src/images/");

    eleventyConfig.addPassthroughCopy("./src/img-original/");
    
    eleventyConfig.addPassthroughCopy({"./src/favicons": "/"});

    eleventyConfig.addPassthroughCopy("./src/assets/");

    eleventyConfig.addPassthroughCopy("./src/h5p-content/");

    eleventyConfig.addPassthroughCopy("./src/files/");

    eleventyConfig.addPassthroughCopy("./src/scripts/");

    // Put robots.txt in root
    eleventyConfig.addPassthroughCopy({ "./src/robots.txt": "/robots.txt" });

    // eleventyConfig.addPassthroughCopy("./src/modules/");
    
    // favicon plugin
    eleventyConfig.addPlugin(faviconsPlugin, {});

    eleventyConfig.addPlugin(embedYouTube);

    eleventyConfig.addPlugin(eleventyNavigationPlugin);

    eleventyConfig.addPlugin(EleventyRenderPlugin);

    // Page order
    function sortByPageOrder(values) {
        return values.slice().sort((a, b) => Math.sign(a.data.order - b.data.order));
    }
    eleventyConfig.addFilter("sortByPageOrder", sortByPageOrder);

    eleventyConfig.addPlugin(pluginTOC, {        
        ul: true,
        wrapper: 'toc',
        wrapperClass: 'menu-list'     
    });

    // WebC
	// eleventyConfig.addPlugin(eleventyWebcPlugin, {
	// 	components: [
	// 		// …
	// 		// Add as a global WebC component
	// 		"npm:@11ty/eleventy-img/*.webc",
	// 	]
	// });

    // Image plugin
	// eleventyConfig.addPlugin(eleventyImagePlugin, {
	// 	// Set global default options
	// 	formats: ["webp", "jpeg"],        
	// 	urlPath: "/images/",
    //     outputDir: "./_site/images/",
        
	// 	// Notably `outputDir` is resolved automatically
	// 	// to the project output directory

	// 	defaultAttributes: {
	// 		loading: "lazy",
	// 		decoding: "async"           
	// 	}        
	// });

    // Image shortcode
    eleventyConfig.addShortcode("image", async function(src, alt, width, sizes) {
        const widths = width ? [width, width * 2] : [300, 800, "auto"];
		let metadata = await Image(`./src/images/${src}`, {
			widths: widths,
			formats: ["avif", "jpeg"],
            urlPath: "/images/",
            outputDir: "_site/images/"
		});

		let imageAttributes = {
			alt,
			sizes: "(min-width: 30em) 50vw, 100vw",
			loading: "lazy",
			decoding: "async",
		};

		// You bet we throw an error on a missing alt (alt="" works okay)
		return Image.generateHTML(metadata, imageAttributes);
	});

    //pagefind indexing after site building
    eleventyConfig.on('eleventy.after', () => {
        execSync(`npx pagefind --source _site`, { encoding: 'utf-8' })
    });

    // quizlet shortcode
    eleventyConfig.addShortcode("quizlet", (url) => 
        `<iframe src="${url}" height="500" width="100%" style="border:0"></iframe>`
    );

    // pdf shortcode
    // see documentation
    // https://developer.adobe.com/document-services/docs/overview/pdf-embed-api/
    eleventyConfig.addShortcode("pdf_embed", function(url, mode, divid) {
        if(!divid) divid = "adobe-pdf-view";
        if(!mode) mode = "FULL_WINDOW";
        let filename = url.split("/").pop();

        return `
<div id="${divid}" style="height: 500px;"></div>
<script src="https://documentservices.adobe.com/view-sdk/viewer.js"></script>
<script type="text/javascript">
    document.addEventListener("adobe_dc_view_sdk.ready", function(){
        // var adobeDCView = new AdobeDC.View({clientId: "70e713a9f68441eaa876ebca12ea8bf8", divId: "${divid}"}); //localhost
        var adobeDCView = new AdobeDC.View({clientId: "b4c210d1f7b84725b53e753649870543", divId: "${divid}"}); //monkfish-app-f6zri.ondigitalocean.app
        adobeDCView.previewFile({
            content:{ location:
                    { url: "${url}"}},
            metaData:{fileName: "${filename}"}
        },
        {
            embedMode: "${mode}"
        });
    });
</script>
        `;
    });

    // h5p shortcode
    eleventyConfig.addShortcode("h5p", function(url, divid) {
        if(!divid) divid = "h5p-container";

        return `
<div id="${divid}"></div>
<script type="text/javascript" src="/assets/h5p/main.bundle.js"></script>
<script type="text/javascript">
	const el = document.getElementById("${divid}");
    const options = {
        h5pJsonPath:  "${url}",
        frameJs: '/assets/h5p/frame.bundle.js',
        frameCss: '/assets/h5p/styles/h5p.css',
    }
    new H5PStandalone.H5P(el, options);
</script>
        `;
    });

    return {
        dir: {
            input: "src"
            // output: "public"
        }
    }
};