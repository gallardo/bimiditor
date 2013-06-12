"use strict";

/**
 * @param {Number} n
 * @return {String} unsigned hexadecimal string representation
 */
function toHex(n) {
    return "0x" + (n >>> 0).toString(16);
}

/**
 * Array of bytes (unsigned char[]) to ArrayBuffer
 *
 * @param {unsigned char[]} n array of bytes <tt>(unsigned char[])</tt>
 * @return {ArrayBuffer}
 */
function ucatoab(n) {
    var buf = new ArrayBuffer(n.length);
    var view = new DataView(buf);
    for (var i = 0; i < n.length; ++i) {
        view.setUint8(i, n[i]);
    }
    return buf;
}

describe("Crc suite", function() {
    it("should calculate the CRC of an 'IEND' chunk", function() {
        // Example from a real png chunk:
        // 49 45 4E 44 (type/name)
        // AE 42 60 82 (CRC)
        var bytes = ucatoab([0x49, 0x45, 0x4E, 0x44]);
        var expectedCRC = 0xae426082;

        var calculatedCRC = Crc().calculate(bytes, 0, bytes.byteLength);
        expect(toHex(calculatedCRC)).toBe(toHex(expectedCRC));
    });
    it("should calculate the CRC of the ASCII representation of '1'", function() {
        // Example and result calculated with http://www.lammertbies.nl/comm/info/crc-calculation.html
        var bytes = ucatoab([0x31]);
        var expectedCRC = 0x83DCEFB7;

        var calculatedCRC = Crc().calculate(bytes, 0, bytes.byteLength);
        expect(toHex(calculatedCRC)).toBe(toHex(expectedCRC));
    });
    it("should calculate the CRC of the ASCII representation of '123456789'", function() {
        // Example and result calculated with http://www.lammertbies.nl/comm/info/crc-calculation.html
        var bytes = ucatoab([0x31,0x32,0x33,0x34,0x35,0x36,0x37,0x38,0x39]);
        var expectedCRC = 0xCBF43926;

        var calculatedCRC = Crc().calculate(bytes, 0, bytes.byteLength);
        expect(toHex(calculatedCRC)).toBe(toHex(expectedCRC));
    });
    it("should calculate the CRC of a subset of the buffer", function() {
        var bytes = new ArrayBuffer(16);
        var view = new Uint8Array(bytes);
        view[4] = 0x49;
        view[5] = 0x45;
        view[6] = 0x4e;
        view[7] = 0x44;
        var expectedCRC = 0xae426082;

        var calculatedCRC = Crc().calculate(bytes, 4, 4);
        expect(toHex(calculatedCRC)).toBe(toHex(expectedCRC));
    });

});