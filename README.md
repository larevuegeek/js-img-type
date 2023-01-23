# js-img-type
A simple image type detector for nodejs, you can also test the type of file like isJpeg or isPng

## Installation
`npm install js-img-type`

## Usage

##### Node.js From file
```js
const imgType = require('js-img-type');

imgType.getType(currentFile).then((filetype) => {
    console.log("IMG TYPE : " + filetype)
});
```

##### Node.js From buffer
```js
const imgType = require('js-img-type');

//some code to get a buffer fs.readFile or read-chunk for exemple
var filetype = imgType.getTypeFromBuffer(buffer);

console.log("IMG TYPE : " + filetype);
```

For a jpeg file output should be `IMG TYPE : jpeg`

For a non supported file type output should be `IMG TYPE : false`

##### Node.js file test by type
```js
const imgType = require('js-img-type');

//Exemple : currentFileJpeg = ./test.jpg
imgType.isJpeg(currentFileJpeg).then((isJpeg) => {
    console.log("IS JPEG : " + isJpeg)
});
```
For a jpeg file output should be `IS JPEG : true`

For all other file output should be `IS JPEG : false`

## Functions availables
getType()  
geTypeFromBuffer()  
isJpeg()  
isPng()  
isGif()  
isBmp()  
isSvg()  
isWebp() 
isImg() 
isRaw()

## Supported file types

### Basic file types
jpeg  
png  
gif  
bmp  
tiff  
svg  
webp  

### Raw file types
cr2  
arw  
crw  
dng  

## Comming Soon
More Supported files

New functions

## License

MIT