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