'use strict';

const util = require('util');
const fs = require('fs');

const open = util.promisify(fs.open);
const read = util.promisify(fs.read);

/**
 * get file type from filepath
 * @param {string} file
 * @return {string|false}
 */
async function readType(file) {
  
  return await open(file, 'r').then((fd) => {

    return readBuffer(fd).then((filetype) => {
        
      fs.close(fd, function(error) {
        if (error) {
             console.error("close error:  " + error.message);
        }
      });
      
      return filetype;

    }).catch((e) => {
      // Handle the error.
      console.log(e);
      throw e;
    });

  }).catch((error) => {
      // Handle the error.
      console.log(error);
      throw error;
  });
}

/**
 * Read buffer of file limited to the specified length bytes (100 default)
 * @param {integer} fd
 * @param {integer} length
 * @return {string|false}
 */
async function readBuffer(fd, length = 100) {
  
    var buffer = Buffer.alloc(length);

    let filetype = await read(fd, buffer, 0, length, 0).then((num) => {
        //console.log(buffer.toString('hex', 0, num));
        return readTypeFromBuffer(buffer);

    }).catch((e) => {
      // Handle the error.
      console.log(e);
      throw e;
    });

    return filetype;
}

/**
 * get file type from file buffer
 * @param {string} buffer
 * @return {string|false}
 */
function readTypeFromBuffer(buffer) {
    
    let readableBuffer = buffer.toString('hex').toUpperCase();
    //console.log(readableBuffer)

    //Jpeg Img (SOI : Start of Image Hex) = FFD8 (Hex : x0FFD8)
    let SOIMarker = readableBuffer.substring(0, 4);
    if(SOIMarker == "FFD8") {
      return 'jpeg';
    }

    // PNG img : Signature Hex = 89504E470D0A1A0A
    let PNGMarker = readableBuffer.substring(0, 16);
    if(PNGMarker == "89504E470D0A1A0A") {
      return 'png';
    }

    // GIF img : Signature Hex = GIF89a OR GIF87a
    let GIFMarker = buffer.toString('ascii', 0, 6);
    if(GIFMarker == "GIF89a" || GIFMarker == "GIF87a") {
      return 'gif';
    }

    // BMP img : Signature Hex = 4D42
    let BPMMarker = readableBuffer.substring(0, 4);
    if(BPMMarker == "4D42") {
      return 'bmp';
    }

    //SVG
    let SVGMarker = readableBuffer.substring(0, 10);
    if(SVGMarker == "3C3F786D6C") {
      return 'svg';
    }

    let WEBPMarker = readableBuffer.substring(0, 8);
    let WEBPMarker2 = readableBuffer.substring(16, 30);
    if(WEBPMarker == "52494646" && WEBPMarker2 == "57454250565038") {
      return 'webp';
    }

    // TIFF img : Signature Hex = 4D4D002A OR 49492A00
    let TIFFMarker = readableBuffer.substring(0, 8);
    if(TIFFMarker == "4D4D002A" || TIFFMarker == "49492A00") {
      
      //RAW CR2 file : TIFF base (Canon)
      let CR2Marker = readableBuffer.substring(16, 20);
      if(CR2Marker == "4352") {
        return "cr2";
      }

      //RAW ARW file : TIFF base (Sony)
      let ARWMarker = readableBuffer.substring(0, 17);
      if(ARWMarker == "49492A00080000001") {
        return "arw";
      }

      //RAW DNG file : TIFF base (Canon / Leica)
      let DNGMarker = readableBuffer.substring(0, 17);
      if(DNGMarker == "49492A00080000002") {
        return "dng";
      }

      //RAW DNG file : TIFF base (PENTAX / SAMSUNG)
      let DNGMarker2 = readableBuffer.substring(0, 19);
      if(DNGMarker2 == "4D4D002A00000008002") {
        return "dng";
      }

      //RAW DNG file : TIFF base (LEICA)
      let DNGMarker3 = readableBuffer.substring(0, 17);
      if(DNGMarker3 == "4D4D002A0000000C0") {
        return "dng";
      }

      //console.log(ARWMarker);

      return 'tiff';
    }

    // CIFF img : Signature Hex = 49491A
    let CIFFMarker = readableBuffer.substring(0, 6);
    if(CIFFMarker == "49491A") {
      
      //RAW CRW file : CIFF base (Canon)
      let CRWMarker = readableBuffer.substring(12, 16);
      if(CRWMarker == "4845") {
        return "crw";
      }
    }
  
    console.log('Image type is not supported, only jpeg, png, GIF, BMP, TIFF and RAW (arw, cr2, dng, crw)')
    
    return false;
}


/**
 * check if file is a PNG
 * @param {string} filepath
 * @return {boolean}
 */
function isPng(filepath) {
    
  return readType(filepath).then((filetype) => {
    if(filetype == "png") {
      return true
    }
    else return false

  }).catch(error => {
    return false
  });
}

/**
 * check if file is a Jpeg
 * @param {string} filepath
 * @return {boolean}
 */
function isJpeg(filepath) {
    
  return readType(filepath).then((filetype) => {
    if(filetype == "jpeg") {
      return true
    }
    else return false

  }).catch(error => {
    return false
  });
}

/**
 * check if file is a Gif
 * @param {string} filepath
 * @return {boolean}
 */
function isGif(filepath) {
    
  return readType(filepath).then((filetype) => {
    if(filetype == "gif") {
      return true
    }
    else return false

  }).catch(error => {
    return false
  });
}


/**
 * check if file is a bmp
 * @param {string} filepath
 * @return {boolean}
 */
function isBmp(filepath) {
    
  return readType(filepath).then((filetype) => {
    if(filetype == "bmp") {
      return true
    }
    else return false

  }).catch(error => {
    return false
  });
}


/**
 * check if file is a svg
 * @param {string} filepath
 * @return {boolean}
 */
function isSvg(filepath) {
    
  return readType(filepath).then((filetype) => {
    if(filetype == "svg") {
      return true
    }
    else return false

  }).catch(error => {
    return false
  });
}

/**
 * check if file is a webp
 * @param {string} filepath
 * @return {boolean}
 */
function isWebp(filepath) {
    
  return readType(filepath).then((filetype) => {
    if(filetype == "webp") {
      return true
    }
    else return false

  }).catch(error => {
    return false
  });
}

/**
 * check if file is a raw image
 * @param {string} filepath
 * @return {boolean}
 */
function isRaw(filepath) {
    
  return readType(filepath).then((filetype) => {
    
    switch(filetype) {
      case "cr2":
        return true
      case "crw":
        return true
      case "arw":
          return true
      case "dng":
          return true
      default:
        return false
    } 

  }).catch(error => {
    return false
  });
}

/**
 * check if file is a valid image
 * @param {string} filepath
 * @return {boolean}
 */
function isImg(filepath) {
    
  return readType(filepath).then((filetype) => {
    if(!filetype) {
      return false
    }
    
    return true

  }).catch(error => {
    return false
  });
}

module.exports = {
  getType: function(file) {
    return readType(file);
  },

  getTypeFromBuffer: function(buffer) {
    return readTypeFromBuffer(buffer);
  },
  
  isPng: function(file) {
    return isPng(file);
  },

  isJpeg: function(file) {
    return isJpeg(file);
  },

  isGif: function(file) {
    return isGif(file);
  },

  isBmp: function(file) {
    return isBmp(file);
  },

  isSvg: function(file) {
    return isSvg(file);
  },

  isWebp: function(file) {
    return isWebp(file);
  },

  isImg: function(file) {
    return isImg(file);
  },

  isRaw: function(file) {
    return isRaw(file);
  },
};