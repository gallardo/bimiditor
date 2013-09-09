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
 * ArrayBuffer to data:URL
 * 
 * @param {ArrayBiffer} arrayBuffer
 * @param {String} fileType mime type (e.g. 'image/png', 'image/jpeg', ...)
 * @returns {String} Data URLs allow you to completely define an image as a
 *       Base64 encoded string of characters directly in your code. eg:
 *       <tt>var img_src = 'data:image/gif;base64,R0lGODlhCwALAIAAAAAA3pn/ZiH5BAEAAAEALAAAAAALAAsAAAIUhA+hkcuO4lmNVindo7qyrIXiGBYAOw==';</tt>
 */
function abtodataURL(arrayBuffer, fileType) {
        var _bytes = new Uint8Array(arrayBuffer);
        var _encodedBytes = batobase64(_bytes);
        return 'data:' + fileType + ';base64,' + _encodedBytes;
}

/**
 * Reads the file as data:URL and call back <tt>setDataURL</tt>
 * with it as parameter.
 * 
 * @param {File} file
 * @param {String} fileType mime type
 * @param {function(String)} setDataURL callback
 */
function readDataURL(file, fileType, setDataURL) {
    var _reader = new FileReader();
    var _setDataURL = setDataURL;

    _reader.onload = function(evt) {
        if (evt.target.readyState !== 2)
            return;
        if (evt.target.error) {
            alert('Error while reading file');
            return;
        }

        _setDataURL(abtodataURL(evt.target.result, fileType));
    };

    _reader.readAsArrayBuffer(file);
}
