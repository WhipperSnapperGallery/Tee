window.addEventListener("load", () => {
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
        canvas.width = window.innerWidth*0.995;
        canvas.height = window.innerHeight*0.995;
    }

    window.addEventListener('resize', resizeCanvas);

    pencilBtn.addEventListener('click', () => {
        if (tool === 'pencil') {
            tool = null;
            pencilBtn.classList.remove('selected');
            canvas.classList.remove('cnvs-pencil');
        } else {
            tool = 'pencil';
            pencilBtn.classList.add('selected');
            eraserBtn.classList.remove('selected');
            canvas.classList.remove('cnvs-eraser');
            canvas.classList.add('cnvs-pencil')
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 1;
        }
    });

    eraserBtn.addEventListener('click', () => {
        if (tool == 'eraser') {
            tool = null;
            eraserBtn.classList.remove('selected');
            canvas.classList.remove('cnvs-eraser');
        }
        else if (tool !== 'eraser') {
            tool = 'eraser';
            console.log(tool)
            eraserBtn.classList.add('selected');
            pencilBtn.classList.remove('selected');
            canvas.classList.remove('cnvs-pencil');
            canvas.classList.add('cnvs-eraser');
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 15;
        }
    });

    clearAllBtn.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    canvas.addEventListener('mousedown', (event) => {
        if (tool !== 'pencil' && tool != 'eraser') return;
        drawing = true;
        ctx.beginPath();
        ctx.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
    });

    canvas.addEventListener('mousemove', (event) => {
        if (!drawing || isDragging ||(tool !== 'pencil' && tool !=='eraser')) return;
        ctx.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
        ctx.stroke();
    });

    canvas.addEventListener('mouseup', () => {
        drawing = false;
    });

    canvas.addEventListener('mouseleave', () => {
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
    
    minimizeBtn.on("click", function() {
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

    modalHeader.on("mousedown", function(e) {
      isDragging = true;
      mouseOffsetX = e.clientX - modal.offset().left;
      mouseOffsetY = e.clientY - modal.offset().top;
    });

    $(document).on("mousemove", function(e) {
      if (!isDragging) return;
      modal.css({
        left: e.clientX - mouseOffsetX + "px",
        top: e.clientY - mouseOffsetY + "px"
      });
    });

    $(document).on("mouseup", function() {
      isDragging = false;
    });
});