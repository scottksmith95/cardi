var request = require('request');
var cheerio = require('cheerio');
var tough = require('tough-cookie');

exports.fromUrl = function(url, callback) {
    parseUrl(url, callback);
}

exports.fromHtml = function(data, callback) {
    callback(null, parseHtml(data));
};

var parseUrl = function(url, callback) {
    var useragent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.143 Safari/537.36';
    var jar = request.jar();

    var options = {
        method: 'GET',
        url: url,
        followAllRedirects: true,
        headers: { 
            'User-Agent': useragent
        },
        jar: jar
    };

    request(options, function (err, resp, body) {
        callback(err, parseHtml(body));
    });
}

var parseHtml = function(data) {
    var card = {};

    try {
        $ = cheerio.load(data);

        var metaTags = $('meta');
        var imageTags = $('img');

        //Get initial card from meta tags
        card = parseMetas(metaTags);

        //If title isn't set now, grab it from the <title> tag
        if (!card.title || card.title.length <= 0) {
            card.title = $('title').text();
        }

        //Get images
        card.images = parseImages(imageTags);
    } catch (exception) {
        //Do nothing
    }

    //Sanity
    if (!card.title) { card.title = ''; }
    if (!card.description) { card.description = ''; }
    if (!card.openGraphDescription) { card.openGraphDescription = ''; }
    if (!card.twitterDescription) { card.twitterDescription = ''; }
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
            } else if (!card.description && metaName === 'description') {
                card.description = metaContent;
            } else if (!card.openGraphDescription && metaProperty === 'og:description') {
                card.openGraphDescription = metaContent;
            } else if (!card.twitterDescription && metaName === 'twitter:description') {
                card.twitterDescription = metaContent;
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







