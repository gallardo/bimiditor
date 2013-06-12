/**
 * To synch the four-byte CRC (Cyclic Redundancy Code) calculated on the
 * preceding bytes in the chunk, including the chunk type field and chunk
 * data fields, but not including the length field.
 *
 * @see http://www.w3.org/TR/PNG/#D-CRCAppendix
 */

function Crc() {
	/**
	 * {Array of 256 unsigned long} Table of CRCs of all 8-bit messages.
	 */
	this._crcTable;

	/** CRC polynomial employed */
	var _POLYN = 0xedb88320;

	/* Make the table for a fast CRC. */
	function _makeCrcTable()
	{
		this._crcTable = [];
		for (var n = 0; n < 256; n++) {
			var c = n;
			for (var k = 0; k < 8; k++) {
				c = ((c & 1) === 1)
					? _POLYN ^ (c >>> 1)
					: c >>> 1;
			}
			this._crcTable[n] = c;
		}
	};

	function _printTable() {
			var hexValues = "";
			for (var i = 0; i < this._crcTable.length; ++i) {
				hexValues += "0x" + (this._crcTable[i] >>> 0).toString(16) + ", ";
			}
			console.log("table: " + hexValues);		
	}

	/*
	 * Update a running CRC with the bytes buf[0..len-1]--the CRC
	 * should be initialized to all 1's, and the transmitted value
	 * is the 1's complement of the final running CRC (see the
	 * crc() routine below).
	 *
	 * @param {unsigned long} crc
	 * @param {ArrayBuffer} buf
	 * @param {unsigned long} offset
	 * @param {unsigned long} len
	 * @return {unsigned long}
	 */
	function _updateCrc(crc, buf, offset, len) {
		var c = crc;
		var bufView = new DataView(buf, offset, len);

		if (!this._crcTable) {
			_makeCrcTable();
			console.log("CRC-32 table created");
			// _printTable();
		}
		for (var n = 0; n < len; n++) {
			c = this._crcTable[(c ^ bufView.getUint8(n)) & 0xff] ^ (c >>> 8);
		}
		return c;
	};

	var _that = {
		/*
		 * @param {ArrayBuffer} buf
		 * @param {unsigned long} offset
		 * @param {unsigned long} length
		 * @return {unsigned long} CRC of the bytes buf[0..len-1].
		 */
		calculate: function(buf, offset, len) {
			return _updateCrc(0xffffffff, buf, offset, len) ^ 0xffffffff;
		}
	};
	return _that;
}

