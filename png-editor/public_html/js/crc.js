/**
 * @see http://www.w3.org/TR/PNG/#D-CRCAppendix
 */

/*
 * {Array of 256 unsigned long} Table of CRCs of all 8-bit messages.
 */
var crcTable;

/* Make the table for a fast CRC. */
function makeCrcTable()
{
	crcTable = [];
	for (var n = 0; n < 256; n++) {
		var c = n;
		for (var k = 0; k < 8; k++) {
			if (c & 1)
				c = 0xedb88320 ^ (c >> 1);
			else
				c = c >> 1;
		}
		crcTable[n] = c;
	}
}

/*
 * Update a running CRC with the bytes buf[0..len-1]--the CRC
 * should be initialized to all 1's, and the transmitted value
 * is the 1's complement of the final running CRC (see the
 * crc() routine below).
 *
 * @param {unsigned long} crc
 * @param {unsigned char *} buf
 * @param {int} len
 * @return {unsigned long}
 */
function updateCrc(crc, buf, len) {
	var c = crc;

	if (!crcTable)
		makeCrcTable();
	for (var n = 0; n < len; n++) {
		c = crcTable[(c ^ buf[n]) & 0xff] ^ (c >> 8);
	}
	return c;
}

/*
 * @param {unsigned char *} buf
 * @param {int} len
 * @return {unsigned long} CRC of the bytes buf[0..len-1].
 */
function crc(buf, len) {
	return updateCrc(0xffffffff, buf, len) ^ 0xffffffff;
}
