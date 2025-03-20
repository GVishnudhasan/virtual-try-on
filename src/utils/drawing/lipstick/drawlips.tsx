const lower_lips_points = [61, 146, 91, 181,84,17,314, 405, 321, 375, 291, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95, 78,146, 61 ]
const upper_lips_points = [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 191, 308, 415, 310, 311, 312, 13, 82, 81, 80, 185, 61]


function define(ctx: CanvasRenderingContext2D, cordinates: any[]){
    ctx.beginPath();
    let e = ctx.canvas
    ctx.moveTo(cordinates[0].x * e.width, cordinates[0].y * e.height);

    for(var i=0; i<cordinates.length;i++){
      ctx.lineTo(cordinates[i].x * e.width, cordinates[i].y * e.height);
    }
    ctx.closePath();
  }

export const drawlipstick = (
  results: { multiFaceLandmarks: any[][]; },
  canvasRef: HTMLCanvasElement,
  canvasCtx: CanvasRenderingContext2D,
  color: string
) => {
    if (results.multiFaceLandmarks) {
      results.multiFaceLandmarks.forEach((landmarks: any[]) => {
        // Reset any existing styles
        // canvasCtx.setTransform(1, 0, 0, 1, 0, 0);
        // canvasCtx.globalCompositeOperation = 'source-over';
        console.log(color)

        canvasCtx.fillStyle = color;
        canvasCtx.strokeStyle = "#ffffff08";
        // ctx.globalCompositeOperation = "lighter";
        canvasCtx.globalAlpha = 0.4;

        const lowerLips = lower_lips_points.map((index) => landmarks[index]);
        const upperLips = upper_lips_points.map((index) => landmarks[index]);

        // Draw lower lips
        define(canvasCtx, lowerLips);
        canvasCtx.stroke();
        canvasCtx.fill();

        // Draw upper lips
        define(canvasCtx, upperLips);
        canvasCtx.stroke();
        canvasCtx.fill();

        // Reset alpha
        canvasCtx.globalAlpha = 1;
    });
  }
}