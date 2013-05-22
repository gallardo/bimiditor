"use strict";

describe("PngImage suite", function() {
    it("should decode the Hello world", function() {
        var HELLO_WORLD = "Hello, world!";
        var HELLO_WORLD_BASE64 = window.btoa(HELLO_WORLD);
        expect(base64toba(HELLO_WORLD_BASE64).byteLength)
                .toBe(HELLO_WORLD.length);
    });
    it("should decode the Lenna png image", function() {
        expect(base64toba(LENNA_BASE64).byteLength).toBe(473831);
    });
    it("should read the Lenna png image", function() {
        var pngImage = PngImage(LENNA);
        expect(pngImage.getWidth()).toBe(LENNA.width);
        expect(pngImage.getHeight()).toBe(LENNA.height);
        expect(Object.keys(pngImage.getChunks()).length)
                .toBe(LENNA.chunksLength);
        expect(pngImage.getSignatureHex()).toBe(PNG_SIGNATURE_HEX);
    });
});