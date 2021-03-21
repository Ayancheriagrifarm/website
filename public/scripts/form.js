File.prototype.convertToBase64 = function (callback) {
	const reader = new FileReader();
	reader.onloadend = function (e) {
		callback(e.target.result, e.target.error);
	};
	reader.readAsDataURL(this);
};

$('#image').change(function () {
	if (this.files && this.files[0]) {
		const selectedFile = this.files[0];
		const fileName = selectedFile.name.split('.')[0];
		selectedFile.convertToBase64((base64) => {
			$('#img-name').text(fileName);
			$('#img-preview').show().attr({ class: 'img-preview', src: base64, alt: fileName });
			$('input[type=hidden]').val(base64);
			$('.input-group-text').css({ 'border-bottom-left-radius': '0' });
			$('.custom-file-label').css({ 'border-bottom-right-radius': '0' });
		});
	}
});
