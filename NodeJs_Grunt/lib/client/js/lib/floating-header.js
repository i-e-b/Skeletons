;(function (exports) {

	function pageTop() {
		return $('.navbar').height();
	}

	function applyFixedHeaderSizes() {
		$('table').floatThead({
			scrollingTop: pageTop,
			useAbsolutePositioning: false
		});
	}

	$(applyFixedHeaderSizes);

})(window);
