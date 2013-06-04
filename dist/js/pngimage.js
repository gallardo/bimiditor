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
    var _listeners = [];
    var _notifyListeners = function() {
        for (var i = 0; i < _listeners.length; i++) {
            _listeners[i]();
        }
    };
    /**
     * @returns {Number} length of data block
     */
    var _getDataLength = function() {
        return _dataView.getUint32(_chunkStartPtr);
    };
    return {
        /**
         * @param {function} l listener that will be notified on
         *       changes
         */
        addListener: function(l) {
            _listeners.push(l);
        },
        /**
         * @returns {String}
         */
        getLengthHex: function() {
            return batohexs(_bytes.subarray(_chunkStartPtr, _chunkStartPtr + 4));
        },
        /**
         * Overwrites the corresponding bytes of the original image.
         * Changing the bytes notifies all listeners
         * @param {String} hex string containing number in
         *       hexadecimal notation
         * @returns {Chunk} this for method chaining
         */
        setLengthHex: function(hex) {
            var hexBytes = hexstoba(hex);
            var _ptr = _chunkStartPtr;
            for (var i = 0; i < hexBytes.length; ++i, ++_ptr) {
                _bytes[_ptr] = hexBytes[i];
            }
            _notifyListeners();
            return this;
        },
        /**
         * @returns {String}
         */
        getLengthDec: function() {
            return _dataView.getInt32(_chunkStartPtr);
        },
        /**
         * Overwrites the corresponding bytes of the original image.
         * Changing the bytes notifies all listeners
         * @param {Number} length length of the chunk in bytes
         * @returns {Chunk} this for method chaining
         */
        setLengthDec: function(length) {
            _dataView.setUint32(_chunkStartPtr, length);
            _notifyListeners();
            return this;
        },
        /**
         * @returns {Number} chunk's length in bytes
         */
        getChunksLength: function() {
            return _getDataLength() + 4 + 4 + 4; // length + name + crc
        },
        /**
         * @returns {String}
         */
        getNameHex: function() {
            return batohexs(_bytes.subarray(_chunkStartPtr + 4, _chunkStartPtr + 8));
        },
        /**
         * @returns {String}
         */
        getName: function() {
            return batos(_bytes.subarray(_chunkStartPtr + 4, _chunkStartPtr + 8));
        },
        /**
         * @returns {String}
         */
        getDataHex: function() {
            return batohexs(_bytes.subarray(_chunkStartPtr + 8, _chunkStartPtr + 8 + _getDataLength()));
        },
        /**
         * @returns {String}
         */
        getCrcHex: function() {
            return batohexs(_bytes.subarray(_chunkStartPtr + 8 + _getDataLength(), _chunkStartPtr + 8 + _getDataLength() + 4));
        },
        /**
         * @returns {Number}
         */
        getCrc: function() {
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
    var _chunks = {};
    var _listeners = [];
    // pointer to the index in the byte array of the next chunk to read
    var _ptr = 8;
    var _nChunks = 0;
    var _that = {
        /**
         * 
         * @param {function} l will be called on image changes
         * @returns {PngImage} this for method chaining
         */
        addListener: function(l) {
            _listeners.push(l);
            return this;
        },
        /**
         * 
         * @returns {PngImage} this for method chaining
         */
        notifyListeners: function() {
            for (var i = 0; i < _listeners.length; ++i) {
                _listeners[i]();
            }
            return this;
        },
        /**
         * @param {Element} tag where to render the image
         */
        renderInImg: function(tag) {
            var encodedBytes = batobase64(_bytes);
            tag.setAttribute('src', 'data:image/png;base64,' + encodedBytes);
            tag.setAttribute('width', '' + this.getWidth());
            tag.setAttribute('height', '' + this.getHeight());
        },
        /**
         * @returns {String}
         */
        getSignatureHex: function() {
            return batohexs(_signature);
        },
        /**
         * @returns {Number}
         */
        getWidth: function() {
            return _width;
        },
        /**
         * @returns {Number}
         */
        getHeight: function() {
            return _height;
        },
        /**
         * @returns {Array} map of chunks
         */
        getChunks: function() {
            return _chunks;
        },
        // TODO:
        getDownloadUrl: function() {
            return 'data:application/octet-stream;base64,' + 'SG9sYSwgbXVuZG8hCg==';
        }
    };
    // read chunks
    console.log('Reading chunks...');
    while (_ptr < _bytes.length) {
        var c = Chunk(buffer, _ptr);
        c.addListener(_that.notifyListeners);
        console.log('Read chunk named "' + c.getName() + '" of length ' + c.getChunksLength() + ' bytes.');
        _chunks[c.getName()] = c;
        _ptr += c.getChunksLength();
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

//        // Re-create GUI editor and refresh image
        PngGUI($('#PNGEditorDiv')[0], pngImage)
                .setImageViewport($('#edited-image-img')[0])
                .refresh();
    };

    _reader.readAsArrayBuffer(file);
}
