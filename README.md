#Cardio

Parse web page meta data into an object containing title, description, keywords, and images.

##Installation

Global
```
npm install cardio -g
```

Local
```
npm install cardio
```

##Usage

```JavaScript
var cardio = require('cardio');

cardio.fromUrl('https://github.com', function (card) {
  console.log(card);
});

cardio.fromHtml('<html><head><title>The title</title></head><body></body></html>', function (card) {
  console.log(card);
});)
```

##Example Card

```JavaScript
{
  title: 'Build software better, together',
  description: 'GitHub is the best place to build software together. Over 4 million people use GitHub to share code.',
  keywords: [
    'coders',
    'developers'
  ],
  image: 'https://github.global.ssl.fastly.net/images/modules/open_graph/github-octocat.png',
  images: [ 
    'https://github.global.ssl.fastly.net/images/modules/home/gh-mac-app.png',
    'https://github.global.ssl.fastly.net/images/modules/home/gh-windows-app.png',
    'https://github.global.ssl.fastly.net/images/modules/home/gh-app-apple.png',
    'https://github.global.ssl.fastly.net/images/modules/home/gh-app-windows.png',
    'https://github.global.ssl.fastly.net/images/modules/home/gh-app-eclipse.png',
    'https://github.global.ssl.fastly.net/images/modules/home/gh-enterprise-code.png'
  ]
 }
```

## License

(The MIT License)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
