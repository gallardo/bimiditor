/**
 * Byte Array to hexadecimal string
 * @param {ByteArray} bytes
 * @returns {String} white-spaces padded hexadecimal representation
 *          of the input array
 */
function batohexs(bytes) {
    var result = '';
    if (bytes) {
        var hexDigits = '0123456789ABCDEF';
        var length = bytes.length;
        for (var i = 0; i < length; ++i) {
            result += hexDigits[bytes[i] >> 4] + hexDigits[bytes[i] & 0x0f] + ' ';
        }
    }
    return result;
}

/**
 * String with hexadecimal number to ByteArray
 * @param {String} hexs String containing number in white-spaces
 *       padded hexadecimal notation
 * @returns {ByteArray} bytes
 */
function hexstoba(hexs) {
    var bytes = [];
    if (hexs) {
        var i = 0; // index in the string
        var j = 0; // index in the array
        while (i < hexs.length) {
            bytes[j++] = parseInt(hexs.substring(i, i + 2), 16);
            i += 3;
        }
    }
    return new Uint8Array(bytes);
}

// Not needed if using DataView ??
//            /**
//             *  ByteArray to 32 bit integer
//             *  @param {ByteArray} bytes 4 bytes in network order
//             *  @return {Number} 32 bit integer
//             */
//            function batoi(bytes) {
//                var val = 0;
//                for (var i = 0; i < 4; ++i) {
//                    val *= 256;
//                    val += bytes[i];
//                }
//                return val;
//            }

/**
 *  ByteArray to String interpreting each byte as char codes
 *  @param {ByteArray} bytes in network order
 *  @return {String}
 */
function batos(bytes) {
    var result = '';
    for (var i = 0; i < bytes.length; ++i) {
        result += String.fromCharCode(bytes[i]);
    }
    return result;
}

/**
 * Byte array to base64-encoded string
 * @see <a href="http://stackoverflow.com/a/5370394/413020">Convert
 *      array of byte values to base64 encoded string and break long
 *      lines, Javascript (code golf)</a>
 * @param {ByteArray} input
 * @returns {String} base64-encoded input buffer
 */
function batobase64(input) {
    var str = "";
    for (var i = 0; i < input.length; i++) {
        str += String.fromCharCode(input[i]);
    }
    return btoa(str).replace(/.{76}(?=.)/g, '$&\n');
}

/**
 * @see <a href="http://stackoverflow.com/a/2117523/413020">How to
 *      create a GUID / UUID in Javascript?</a>
 * @returns {String} rfc4122 ver 4 compliant guid
 */
function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * @class 
 * @param {ArrayBuffer} buffer raw image data
 * @param {Number} start pointer to the start of the chunk in the
 *       ArrayBuffer
 */
function Chunk(buffer, start) {
    var _chunkStartPtr = start; // Points to the start of the chunk
    var _bytes = new Uint8Array(buffer);
    var _dataView = new DataView(buffer);
    /**
     * @returns {Number} length of data block
     */
    var _getDataLength = function() {
        return _dataView.getUint32(_chunkStartPtr);
    };
    return {
        /**
         * @returns {String}
         */
        get lengthHex() {
            return batohexs(_bytes.subarray(_chunkStartPtr, _chunkStartPtr + 4));
        },
        /**
         * Overwrites the corresponding bytes of the original image.
         * @param {String} hex string containing number in
         *       hexadecimal notation
         * @returns {Chunk} 'this' for method chaining
         */
        set lengthHex(hex) {
            var hexBytes = hexstoba(hex);
            var _ptr = _chunkStartPtr;
            for (var i = 0; i < hexBytes.length; ++i, ++_ptr) {
                _bytes[_ptr] = hexBytes[i];
            }
            return this;
        },
        /**
         * @returns {String}
         */
        get lengthDec() {
            return _dataView.getInt32(_chunkStartPtr);
        },
        /**
         * Overwrites the corresponding bytes of the original image.
         * @param {Number} length length of the chunk in bytes
         * @returns {Chunk} 'this' for method chaining
         */
        set lengthDec(length) {
            _dataView.setUint32(_chunkStartPtr, length);
            return this;
        },
        /**
         * @returns {Number} chunk's length in bytes
         */
        get chunksLength() {
            return _getDataLength() + 4 + 4 + 4; // length + name + crc
        },
        /**
         * @returns {String}
         */
        get nameHex() {
            return batohexs(_bytes.subarray(_chunkStartPtr + 4, _chunkStartPtr + 8));
        },
        /**
         * Overwrites the corresponding bytes of the original image.
         * @param {String} hex string containing name in
         *       hexadecimal notation
         * @returns {Chunk} 'this' for method chaining
         */
        set nameHex(hex) {
            var hexBytes = hexstoba(hex);
            var _ptr = _chunkStartPtr + 4;
            for (var i = 0; i < hexBytes.length; i++, ++_ptr) {
                _bytes[_ptr] = hexBytes[i];
            }
            return this;
        },
        /**
         * @returns {String}
         */
        get name() {
            return batos(_bytes.subarray(_chunkStartPtr + 4, _chunkStartPtr + 8));
        },
        /**
         * Overwrites the corresponding bytes of the original image.
         * @param {String} name name of the chunk
         * @returns {Chunk} 'this' for method chaining
         */
        set name(newName) {
            var _ptr = _chunkStartPtr + 4;
            for (var i = 0; i < newName.length; i++, ++_ptr) {
                console.debug("setting char " + i + " with charCodeAt: " + newName.charCodeAt(i) + " (" + (newName.charCodeAt(i) & 0x7f) + ")");
                _bytes[_ptr] = (newName.charCodeAt(i) & 0x7f);
            }
            return this;
        },
        get nameMeaning() {
            var _meanings = {
                // Critial chunks
                IHDR: {tooltip:"Image Header", href:"http://www.w3.org/TR/PNG/#11IHDR"},
                PLTE: {tooltip:"Palette", href:"http://www.w3.org/TR/PNG/#11PLTE"},
                IDAT: {tooltip:"Image data", href:"http://www.w3.org/TR/PNG/#11IDAT"},
                IEND: {tooltip:"Image trailer", href:"http://www.w3.org/TR/PNG/#11IEND"},
                // Ancillary chunks
                // Ancillary - Transparency
                TRNS: {tooltip:"Transparency", href:"http://www.w3.org/TR/PNG/#11tRNS"},
                // Ancillary - Colour space information
                CHRM: {tooltip:"Colour space information", href:"http://www.w3.org/TR/PNG/#11cHRM"},
                GAMA: {tooltip:"Image gamma", href:"http://www.w3.org/TR/PNG/#11gAMA"},
                ICCP: {tooltip:"Embedded ICC profile", href:"http://www.w3.org/TR/PNG/#11iCCP"},
                SBIT: {tooltip:"Significant bits", href:"http://www.w3.org/TR/PNG/#11sBIT"},
                SRGB: {tooltip:"Standard RGB colour space", href:"http://www.w3.org/TR/PNG/#11sRGB"},
                // Ancillary - Textual information
                TEXT: {tooltip:"Textual data", href:"http://www.w3.org/TR/PNG/#11tEXt"},
                ZTXT: {tooltip:"Compressed textual data", href:"http://www.w3.org/TR/PNG/#11zTXt"},
                ITXT: {tooltip:"International textual data", href:"http://www.w3.org/TR/PNG/#11iTXt"},
                // Ancillary - Miscellaneous information
                BKGD: {tooltip:"Background colour", href:"http://www.w3.org/TR/PNG/#11bKGD"},
                HIST: {tooltip:"Image histogram", href:"http://www.w3.org/TR/PNG/#11hIST"},
                PHYS: {tooltip:"Physical pixel dimensions", href:"http://www.w3.org/TR/PNG/#11pHYs"},
                SPLT: {tooltip:"Suggested palette", href:"http://www.w3.org/TR/PNG/#11sPLT"},
                TIME: {tooltip:"Image last-modification time", href:"http://www.w3.org/TR/PNG/#11tIME"},
            };
            return _meanings[this.name.toUpperCase()];
        },
        /**
         * @returns {String}
         */
        get dataHex() {
            return batohexs(_bytes.subarray(_chunkStartPtr + 8, _chunkStartPtr + 8 + _getDataLength()));
        },
        /**
         * @returns {String}
         */
        get crcHex() {
            return batohexs(_bytes.subarray(_chunkStartPtr + 8 + _getDataLength(), _chunkStartPtr + 8 + _getDataLength() + 4));
        },
        /**
         * @returns {Number}
         */
        get crc() {
            return _dataView.getInt32(_chunkStartPtr + 8 + _getDataLength());
        }
    };
}

/**
 * @class  API to access png data
 * @param {ArrayBuffer} buffer raw png data
 */
function PngImage(buffer) {
    var _bytes = new Uint8Array(buffer);
    var _dataView = new DataView(buffer);
    var WIDTH_PTR = 8 + 4 + 4; // Signature + IHDR's length + Chunks' name
    var HEIGHT_PTR = WIDTH_PTR + 4;
    var _signature = _bytes.subarray(0, 8);
    var _width = _dataView.getUint32(WIDTH_PTR);
    var _height = _dataView.getUint32(HEIGHT_PTR);
    var _chunks = [];
    // pointer to the index in the byte array of the next chunk to read
    var _ptr = 8;
    var _nChunks = 0;
    // caches the base64 encoded image
    var _encodedBytes = {};
    var _that = {
        /**
         * @returns {String}
         */
        get signatureHex() {
            return batohexs(_signature);
        },
        /**
         * @returns {Number}
         */
        get width() {
            return _width;
        },
        /**
         * @returns {Number}
         */
        get height() {
            return _height;
        },
        /**
         * @returns {Array} map of chunks
         */
        get chunks() {
            return _chunks;
        },
        /**
         * To quick detect changes in the data
         * @return {Number}
         */
        get hash() {
            var _hash = 0;
            for (var i = 0; i < _chunks.length; ++i) {
                _hash += _chunks[i].crc;
            }
            return _hash;
        },
        get imgSrc() {
            if (!_encodedBytes.hash || _encodedBytes.hash != this.hash) {
                _encodedBytes = { bytes: batobase64(_bytes), hash: this.hash};
            }
            // return 'data:application/octet-stream;base64,' + 'SG9sYSwgbXVuZG8hCg==';
            return 'data:image/png;base64,' + _encodedBytes.bytes;
        }
    };
    // read chunks
    console.log('Reading chunks...');
    while (_ptr < _bytes.length) {
        var c = Chunk(buffer, _ptr);
        console.log('Read chunk ' + _nChunks + ' named "' + c.name + '": ' + c.chunksLength + ' bytes.');
        _chunks[_nChunks] = c;
        _ptr += c.chunksLength;
        ++_nChunks;
    }
    console.log(_nChunks + ' chunks read');
    return _that;
}

/**
 * Reads the image file into a <tt>PngImage</tt> and calls <tt>setPngImage</tt>
 * with it as parameter.
 * 
 * @param {File} file
 * @param {function(PngImage)} callback will be called with the fresh-built
 *       pngImage as parameter
 */
function readImage(file, setPngImage) {
    var _reader = new FileReader();
    var _setPngImage = setPngImage;

    _reader.onload = function(evt) {
        if (evt.target.readyState !== 2)
            return;
        if (evt.target.error) {
            alert('Error while reading file');
            return;
        }

        var pngImage = PngImage(evt.target.result);
        _setPngImage(pngImage);
    };

    _reader.readAsArrayBuffer(file);
}
