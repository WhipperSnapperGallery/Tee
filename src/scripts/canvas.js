document.addEventListener("DOMContentLoaded", () => {
    //Modal stuff
    //Initialize set of possible link destinations
    const iframeSources = ["https://www.google.com", "https://www.youtube.com", "https://www.amazon.ca"];
    const currentModals = [];

    function createModal() {
        const iframeChoice = iframeSources[Math.floor(Math.random() * iframeSources.length)];
        const modal = $('<div>', { class: 'custom-modal' }).appendTo('body');
        const modalHeader = $('<div>', { class: 'cmodal-header' }).appendTo(modal);
        const minimizeBtn = $('<button>', { class: 'minimize-btn', text: '-' }).appendTo(modalHeader);
        $('<span>', { text: 'Modal Header' }).appendTo(modalHeader);
        const modalBody = $('<div>', { class: 'modal-body' }).appendTo(modal);
        $('<iframe>', { src: iframeChoice }).appendTo(modalBody);

        minimizeBtn.on("click", function () {
            modalBody.toggle();
            $(this).text(modalBody.is(":visible") ? '-' : '+');
        });

        let mouseOffsetX = 0;
        let mouseOffsetY = 0;
        let isDragging = false;

        modalHeader.on("mousedown", function (e) {
            isDragging = true;
            mouseOffsetX = e.clientX - modal.offset().left;
            mouseOffsetY = e.clientY - modal.offset().top;
        });

        modalHeader.on("touchstart", function (e) {
            isDragging = true;
            mouseOffsetX = e.clientX - modal.offset().left;
            mouseOffsetY = e.clientY - modal.offset().top;
        });

        $(document).on("mousemove", function (e) {
            if (!isDragging) return;
            modal.css({
                left: e.clientX - mouseOffsetX + "px",
                top: e.clientY - mouseOffsetY + "px"
            });
        });

        $(document).on("touchmove", function (e) {
            if (!isDragging) return;
            modal.css({
                left: e.clientX - mouseOffsetX + "px",
                top: e.clientY - mouseOffsetY + "px"
            });
        });

        $(document).on("mouseup", function () {
            isDragging = false;
        });

        $(document).on("touchend", function () {
            isDragging = false;
        });
    }

    //Canvas stuff
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    const pencilBtn = document.getElementById('pencil');
    const eraserBtn = document.getElementById('eraser');
    const clearAllBtn = document.getElementById('clearAll');

    let isDragging = false;
    let drawing = false;
    let tool = null;

    function resizeCanvas() {
        canvas.width = window.innerWidth * 0.995;
        canvas.height = window.innerHeight * 0.995;
    }

    window.addEventListener('resize', resizeCanvas);

    function selectPencil() {
        if (tool === 'pencil') {
            tool = null;
            pencilBtn.classList.remove('active');
            canvas.classList.remove('cnvs-pencil');
        } else {
            tool = 'pencil';
            pencilBtn.classList.add('active');
            eraserBtn.classList.remove('active');
            canvas.classList.remove('cnvs-eraser');
            canvas.classList.add('cnvs-pencil')
            ctx.strokeStyle = '#14034e';
            ctx.lineWidth = 15;
        }
    }

    pencilBtn.addEventListener('click', selectPencil);

    eraserBtn.addEventListener('click', () => {
        if (tool == 'eraser') {
            tool = null;
            eraserBtn.classList.remove('active');
            canvas.classList.remove('cnvs-eraser');
        }
        else if (tool !== 'eraser') {
            tool = 'eraser';
            console.log(tool)
            eraserBtn.classList.add('active');
            pencilBtn.classList.remove('active');
            canvas.classList.remove('cnvs-pencil');
            canvas.classList.add('cnvs-eraser');
            ctx.strokeStyle = 'white';              
            ctx.lineWidth = 30;
        }
    });

    clearAllBtn.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (tool === 'eraser') {
            selectPencil();
        }
    });

    canvas.addEventListener('mousedown', (event) => {
        if (tool !== 'pencil' && tool != 'eraser') return;
        drawing = true;
        ctx.beginPath();
        ctx.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
    });

    canvas.addEventListener('touchstart', (event) => {
        if (tool !== 'pencil' && tool != 'eraser') return;
        drawing = true;
        ctx.beginPath();
        ctx.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
    });

    canvas.addEventListener('mousemove', (event) => {
        if (!drawing || isDragging || (tool !== 'pencil' && tool !== 'eraser')) return;
        ctx.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
        ctx.stroke();
    });

    canvas.addEventListener('touchmove', (event) => {
        if (!drawing || isDragging || (tool !== 'pencil' && tool !== 'eraser')) return;
        ctx.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
        ctx.stroke();
    });

    canvas.addEventListener('mouseup', () => {
        drawing = false;
    });

    canvas.addEventListener('mouseleave', () => {
        drawing = false;
    });

    canvas.addEventListener('touchend', () => {
        drawing = false;
    });

    canvas.addEventListener('mouseenter', (e) => {
        if (e.buttons === 1 && (tool === 'pencil' || tool === 'eraser')) {
            drawing = true;
        }
    });

    resizeCanvas();

    //Modal stuff
    const modal = $("#myModal");
    const modalHeader = modal.find(".modal-header");
    const minimizeBtn = $("#minimizeBtn");

    window.addEventListener('resize', () => {
        modal.css({
            left: 0 + "px",
            top: 50 + "%"
        });
    });

    minimizeBtn.on("click", function () {
        const body = modal.find(".modal-body");
        if (body.is(":visible")) {
            body.hide();
            $(this).text("+");
        } else {
            body.show();
            $(this).text("-");
        }
    });

    let mouseOffsetX = 0;
    let mouseOffsetY = 0;

    modalHeader.on("mousedown", function (e) {
        isDragging = true;
        mouseOffsetX = e.clientX - modal.offset().left;
        mouseOffsetY = e.clientY - modal.offset().top;
    });

    $(document).on("mousemove", function (e) {
        if (!isDragging) return;
        modal.css({
            left: e.clientX - mouseOffsetX + "px",
            top: e.clientY - mouseOffsetY + "px"
        });
    });

    $(document).on("mouseup", function () {
        isDragging = false;
    });
});