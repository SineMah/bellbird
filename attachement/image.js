'use strict';

const { v5: uuidv5 } = require('uuid');

const IMAGE_NAMESPACE = '1b671a64-40d5-491e-99b0-da01ff1f3341';

module.exports = class Image {

    constructor(html = '', images=[]) {

        this.images = images;
        this.html = html;
        this.files = [];

        this.registerReplaceAll();
    }

    load = async () => {

        for(const image of this.images) {

            if(!image.alt) {

                image.alt = image.name;
            }

            switch(image.type) {

                case 'cid':
                    this.getCid(image);
                    break;

                case 'emb':
                    this.getEmbedded(image);
                    break;
            }
        }

        return this.html;
    }

    getCid = async (image) => {
        const id = uuidv5(image.name, IMAGE_NAMESPACE).replace(/-/g, '');
        const src = `src="cid:${id}"`;

        this.files.push({
            name: image.name,
            // content: Buffer.from(image.content, 'base64').toString('utf-8'),
            content: Buffer.from(image.content, 'base64'),
            cid: id
            // encoding: 'base64'
        });

        this.replaceFile(image.name, src, image.alt);
    }

    getEmbedded = async (image) => {
        const src = `src="${image.content}"`;

        this.replaceFile(image.name, src, image.alt);
    }

    replaceFile = (name, src, alt) => {
        const regex = /<c-image>(.*?)<\/c-image>/g;
        const match = [...this.html.matchAll(regex)];

        match.forEach(m => {
            const search = m[0];
            const inner = m[1].split(';;;');
            
            if(inner[0] === name) {
                let attributesString = '';

                if(inner.length > 1) {
                    const json = inner.slice(-1).pop();
                    const attributes = JSON.parse(json);

                    let attrs = [];

                    for (const [attribute, value] of Object.entries(attributes)) {

                        attrs.push(`${attribute}="${value}"`);
                    }

                    attributesString = ` ${attrs.join(' ')}`;
                }

                const replace = `<img ${src} alt="${alt}"${attributesString} />`;

                this.html = this.html.split(search).join(replace);

                console.log(this.html);
            }
        });
    }

    registerReplaceAll = () => {

        if (!String.prototype.replaceAll) {
            String.prototype.replaceAll = function(str, newStr){

                return this.split(str).join(newStr);
            };
        }

    }
}

