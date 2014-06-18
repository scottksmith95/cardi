var request = require('request');
var cheerio = require('cheerio');

exports.fromUrl = function(url, callback) {
    parseUrl(url, callback);
}

exports.fromHtml = function(data, callback) {
    callback(null, parseHtml(data));
};

var parseUrl = function(url, callback) {
    request.get(url, function(err, resp, body) {
        callback(err, parseHtml(body));
    });
}

var parseHtml = function(data) {
    $ = cheerio.load(data);

    var metaTags = $('meta');
    var imageTags = $('img');

    //Get initial card from meta tags
    var card = parseMetas(metaTags);

    //If title isn't set now, grab it from the <title> tag
    if (!card.title || card.title.length <= 0) {
        card.title = $('title').text();
    }

    //Get images
    card.images = parseImages(imageTags);

    //Sanity
    if (!card.title) { card.title = ''; }
    if (!card.description) { card.description = ''; }
    if (!card.keywords) { card.keywords = []; }
    if (!card.image) { card.image = ''; }
    if (!card.images) { card.images = []; }

    return card;
};

var parseMetas = function(metaTags) {
    var card = { };
    var keys = Object.keys(metaTags)

    //Iterate throuhg all meta tags
    keys.forEach(function(key){
        if (metaTags[key].attribs && (metaTags[key].attribs.property || metaTags[key].attribs.name)) {
            var metaProperty = ((metaTags[key].attribs.property) ? metaTags[key].attribs.property.toLowerCase() : '');
            var metaName = ((metaTags[key].attribs.name) ? metaTags[key].attribs.name.toLowerCase() : '');
            var metaContent = ((metaTags[key].attribs.content) ? metaTags[key].attribs.content : '');

            if ((!card.title || card.title.length < metaContent.length) && 
                (metaProperty === 'og:title' || metaName === 'twitter:title')) {
                card.title = metaContent;
            } else if ((!card.description || card.description.length < metaContent.length) && 
                (metaProperty === 'og:description' || metaName === 'twitter:description' || metaName === 'description')) {
                card.description = metaContent;
            } else if ((!card.image || card.image.length < metaContent.length) && 
                (metaProperty === 'og:image:secure_url' || metaProperty === 'og:image')) {
                var temp = metaContent.toLowerCase();
                if (temp.substring(0, 7) === 'http://' || temp.substring(0, 8) === 'https://')
                    card.image = metaContent;
            } else if (metaName === 'keywords') {
                card.keywords = metaContent.split(/[\s,]+/);
            }
        }
    });

    return card;
};

var parseImages = function(imageTags) {
    var imageTagsArray = imageTags.toArray();
    var images = [];

    for (var i = 0; i < imageTagsArray.length; i++) {
        if (imageTagsArray[i].attribs && imageTagsArray[i].attribs.src) {
            var src = imageTagsArray[i].attribs.src;
            images.push(src);
        }
    }

    return images;
};







