import html2canvas from 'html2canvas';

export function captureScreenshot() {
    var element = document.documentElement; // Capture the whole window
    // Or, you can capture a specific element by selecting it with document.querySelector() or document.getElementById()

    html2canvas(element).then(function (canvas) {
        canvas.toBlob(function (blob) {
            var item = new ClipboardItem({ 'image/png': blob });
            navigator.clipboard.write([item]).then(function () {
                alert('Image copied to clipboard.');
            }).catch(function (error) {
                alert('Unable to copy image to clipboard:', error);
            });
        });
    });
}
