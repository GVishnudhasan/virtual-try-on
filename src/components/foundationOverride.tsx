import React, { useEffect, useRef, useState } from "react";
import { Camera } from "@mediapipe/camera_utils";
import { startCamera } from "../utils/cam";
import { buildFaceMeshes } from "../utils/buildMesh";
import { drawFoundation } from "../utils/drawing/foundationOverride/draw";
import logo from "../images/omnia_logo.png";
import droplets from "../images/droplets.png";
import productImage from "../images/soul_serum.png";

interface FaceMeshProps {
  onResults?: (results: any) => void;
}

const SoulSerumAR: React.FC<FaceMeshProps> = ({ onResults }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const selectedColorRef = useRef("#E8BE93");
  const [isLoading, setIsLoading] = useState(true);
  const [sliderPosition, setSliderPosition] = useState(50);
  const sliderPositionRef = useRef(50);
  const [isDragging, setIsDragging] = useState(false);
  const resultsRef = useRef<any>(null);
  const logoImageRef = useRef<HTMLImageElement | null>(null);
  const dropletImageRef = useRef<HTMLImageElement | null>(null);
  const productImageRef = useRef<HTMLImageElement | null>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  
  // Offscreen watermark canvas (cached)
  const watermarkCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Product information
  const productInfo = {
    name: "Soul Serum",
    subtitle: "Illuminating Facial Serum",
    description:
      "A lightweight, hydrating formula that evens skin tone and provides a natural glow. Infused with Hawaiian botanicals and antioxidants.",
    fullDescription:
      "Our Soul Serum is a lightweight, illuminating facial serum formulated with Hawaiian-grown botanicals. This multi-tasking serum hydrates, brightens, and delivers powerful antioxidants to protect against environmental stressors.",
    benefits: [
      "Instant Natural Glow",
      "Even Skin Tone & Texture",
      "Deeply Hydrating Formula",
      "Hawaiian Botanical Ingredients",
      "Cruelty-Free & Vegan",
    ],
    ingredients:
      "Aqua, Aloe Barbadensis Leaf Juice*, Glycerin*, Niacinamide, Propanediol, Sodium Hyaluronate, Hawaiian Sandalwood Extract*, Kukui Nut Oil*, Hawaiian Honey*, Vitamin E...",
    howToUse:
      "Apply 2-3 drops to cleansed skin morning and night. Gently press into face, neck, and décolletage. Follow with moisturizer.",
    price: "$138.00",
    size: "30 ml / 1 fl oz",
    shopifyLink: "https://www.puremanahawaii.com/products/soul-serum",
  };

  // Check mobile device
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Preload images
  useEffect(() => {
    const loadImage = (src: string, ref: React.MutableRefObject<HTMLImageElement | null>) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        ref.current = img;
        checkImagesLoaded();
      };
    };

    loadImage(logo, logoImageRef);
    loadImage(droplets, dropletImageRef);
    loadImage(productImage, productImageRef);

    function checkImagesLoaded() {
      if (logoImageRef.current && dropletImageRef.current && productImageRef.current) {
        setImagesLoaded(true);
      }
    }
  }, []);

  // Create or update the offscreen watermark canvas based on current logical dimensions
  const updateWatermarkCanvas = (logicalWidth: number, logicalHeight: number) => {
    if (!logoImageRef.current) return;
    const padding = Math.max(10, Math.min(logicalWidth * 0.02, 18));
    const logoHeight = Math.round(Math.max(20, Math.min(logicalHeight * 0.06, 36)));
    const aspectRatio = logoImageRef.current.width / logoImageRef.current.height;
    const logoWidth = Math.round(logoHeight * aspectRatio);
    const fontSize = Math.round(Math.max(10, Math.min(logicalWidth * 0.02, 14)));

    // Create a temporary canvas to measure text
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");
    if (!tempCtx) return;
    tempCtx.font = `bold ${fontSize}px sans-serif`;
    const textWidth = Math.round(tempCtx.measureText("Powered by").width);

    // Calculate background dimensions
    const bgWidth = Math.round(textWidth + logoWidth + padding * 3);
    const bgHeight = Math.round(Math.max(logoHeight, fontSize) + padding * 1.5);

    // Create offscreen canvas with the watermark area dimensions
    const offCanvas = document.createElement("canvas");
    offCanvas.width = bgWidth;
    offCanvas.height = bgHeight;
    const offCtx = offCanvas.getContext("2d");
    if (!offCtx) return;

    // Set image smoothing for crisp rendering
    offCtx.imageSmoothingEnabled = true;
    offCtx.imageSmoothingQuality = "high";
    offCtx.font = `bold ${fontSize}px sans-serif`;
    offCtx.textBaseline = "middle";

    // Draw rounded background
    offCtx.fillStyle = "rgba(255, 255, 255, 0.85)";
    offCtx.beginPath();
    if (offCtx.roundRect) {
      offCtx.roundRect(0, 0, bgWidth, bgHeight, 10);
    } else {
      // Fallback if roundRect is not available
      offCtx.moveTo(10, 0);
      offCtx.lineTo(bgWidth - 10, 0);
      offCtx.quadraticCurveTo(bgWidth, 0, bgWidth, 10);
      offCtx.lineTo(bgWidth, bgHeight - 10);
      offCtx.quadraticCurveTo(bgWidth, bgHeight, bgWidth - 10, bgHeight);
      offCtx.lineTo(10, bgHeight);
      offCtx.quadraticCurveTo(0, bgHeight, 0, bgHeight - 10);
      offCtx.lineTo(0, 10);
      offCtx.quadraticCurveTo(0, 0, 10, 0);
    }
    offCtx.fill();

    // Draw watermark text
    offCtx.fillStyle = "#222";
    offCtx.fillText("Powered by", padding, bgHeight / 2);

    // Draw logo image
    const logoX = padding + textWidth + Math.round(padding / 2);
    const logoY = Math.round((bgHeight - logoHeight) / 2);
    offCtx.drawImage(logoImageRef.current, logoX, logoY, logoWidth, logoHeight);

    // Cache the offscreen canvas
    watermarkCanvasRef.current = offCanvas;
  };

  // Main drawing function
  const drawSplitCanvas = (results: { multiFaceLandmarks: any[][] }) => {
    if (!canvasRef.current || !videoRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Logical dimensions (scaled by devicePixelRatio)
    const dpr = window.devicePixelRatio || 1;
    const logicalWidth = canvas.width / dpr;
    const logicalHeight = canvas.height / dpr;
    const splitPosition = (sliderPositionRef.current / 100) * logicalWidth;

    // Clear canvas and draw video frame (using logical dimensions)
    ctx.clearRect(0, 0, logicalWidth, logicalHeight);
    ctx.drawImage(videoRef.current, 0, 0, logicalWidth, logicalHeight);

    // Draw the serum effect on the right side
    ctx.save();
    ctx.beginPath();
    ctx.rect(splitPosition, 0, logicalWidth - splitPosition, logicalHeight);
    ctx.clip();
    drawFoundation(results, canvas, ctx, selectedColorRef.current + "FF");
    ctx.restore();

    // Draw before/after slider line
    ctx.beginPath();
    ctx.moveTo(splitPosition, 0);
    ctx.lineTo(splitPosition, logicalHeight);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#FFFFFF";
    ctx.stroke();

    // Draw slider handle with shadow
    const handleRadius = Math.min(15, logicalWidth * 0.025);
    ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.beginPath();
    ctx.arc(splitPosition, logicalHeight / 2, handleRadius, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.fill();
    ctx.shadowColor = "transparent";
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#F1C27D";
    ctx.stroke();

    // Draw slider arrows inside the handle
    ctx.beginPath();
    ctx.moveTo(splitPosition - 6, logicalHeight / 2);
    ctx.lineTo(splitPosition - 2, logicalHeight / 2 - 4);
    ctx.lineTo(splitPosition - 2, logicalHeight / 2 + 4);
    ctx.moveTo(splitPosition + 6, logicalHeight / 2);
    ctx.lineTo(splitPosition + 2, logicalHeight / 2 - 4);
    ctx.lineTo(splitPosition + 2, logicalHeight / 2 + 4);
    ctx.fillStyle = "#F1C27D";
    ctx.fill();

    // Draw the pre-rendered watermark (if available)
    if (watermarkCanvasRef.current) {
      const padding = Math.max(10, Math.min(logicalWidth * 0.02, 18));
      const wmWidth = watermarkCanvasRef.current.width;
      const wmHeight = watermarkCanvasRef.current.height;
      const bgX = padding;
      const bgY = logicalHeight - wmHeight - padding;
      ctx.drawImage(watermarkCanvasRef.current, bgX, bgY);
    }
  };

  // Throttle slider updates using requestAnimationFrame
  useEffect(() => {
    let animationFrameId: number | null = null;
    const handleMouseDown = () => setIsDragging(true);
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging || !canvasRef.current) return;
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        const rect = canvasRef.current!.getBoundingClientRect();
        const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
        const newPos = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
        sliderPositionRef.current = newPos;
        setSliderPosition(newPos);
        if (resultsRef.current) drawSplitCanvas(resultsRef.current);
        animationFrameId = null;
      });
    };

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchend", handleMouseUp);
    document.addEventListener("mousemove", handleMouseMove as any);
    document.addEventListener("touchmove", handleMouseMove as any);
    const sliderEl = sliderRef.current;
    if (sliderEl) {
      sliderEl.addEventListener("mousedown", handleMouseDown);
      sliderEl.addEventListener("touchstart", handleMouseDown);
    }
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchend", handleMouseUp);
      document.removeEventListener("mousemove", handleMouseMove as any);
      document.removeEventListener("touchmove", handleMouseMove as any);
      if (sliderEl) {
        sliderEl.removeEventListener("mousedown", handleMouseDown);
        sliderEl.removeEventListener("touchstart", handleMouseDown);
      }
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
    };
  }, [isDragging]);

  // Setup video, canvas dimensions, and face mesh processing
  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const handleMetadata = () => {
      if (!videoRef.current || !canvasRef.current) return;

      const vw = videoRef.current.videoWidth;
      const vh = videoRef.current.videoHeight;
      const dpr = window.devicePixelRatio || 1;

      if (vw && vh) {
        // Set actual pixel dimensions for high‑DPI rendering
        canvasRef.current.width = vw * dpr;
        canvasRef.current.height = vh * dpr;
        // Set CSS dimensions to logical size
        canvasRef.current.style.width = `${vw}px`;
        canvasRef.current.style.height = `${vh}px`;

        const ctx = canvasRef.current.getContext("2d");
        if (ctx) {
          ctx.scale(dpr, dpr);
        }
        // Update container styles for aspect ratio
        updateCanvasContainerStyles(vw, vh);
        // Update watermark canvas (cache) for current dimensions
        updateWatermarkCanvas(vw, vh);
        setVideoLoaded(true);
        setIsLoading(false);
      }
    };

    videoRef.current.addEventListener("loadedmetadata", handleMetadata);

    const faceMesh = buildFaceMeshes(
      canvasRef.current,
      videoRef.current,
      (results) => {
        resultsRef.current = results;
        if (onResults) onResults(results);
        drawSplitCanvas(results);
      },
      drawFoundation,
      selectedColorRef.current
    );

    startCamera(videoRef.current, faceMesh, cameraRef);

    return () => {
      if (videoRef.current)
        videoRef.current.removeEventListener("loadedmetadata", handleMetadata);
      if (cameraRef.current) cameraRef.current.stop();
    };
  }, []);

  // Update canvas container styles to maintain aspect ratio
  const updateCanvasContainerStyles = (videoWidth: number, videoHeight: number) => {
    if (!canvasContainerRef.current || !canvasRef.current) return;
    const container = canvasContainerRef.current;
    const containerWidth = container.clientWidth;
    const aspectRatio = videoHeight / videoWidth;
    const heightValue = containerWidth * aspectRatio;
    container.style.height = `${heightValue}px`;
    canvasRef.current.style.width = "100%";
    canvasRef.current.style.height = "100%";
    canvasRef.current.style.objectFit = "cover";
  };

  // Handle window resize
  useEffect(() => {
    if (!videoLoaded) return;
    const handleResize = () => {
      if (videoRef.current && videoRef.current.videoWidth && videoRef.current.videoHeight) {
        updateCanvasContainerStyles(videoRef.current.videoWidth, videoRef.current.videoHeight);
        updateWatermarkCanvas(videoRef.current.videoWidth, videoRef.current.videoHeight);
        if (resultsRef.current) drawSplitCanvas(resultsRef.current);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [videoLoaded]);

  return (
    <div className="bg-gradient-to-b from-[#fdfaf5] to-[#f4efe7] h-screen w-full py-4 md:py-6 lg:py-8 xl:py-10 2xl:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 flex flex-col">
        {/* Header */}
        <div className="text-center mb-4 md:mb-6 lg:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light tracking-tight">
            <span className="text-[#C09D7C] font-normal">Soul Serum</span> Virtual Try On
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-[#78624E] mt-2 max-w-2xl mx-auto font-light">
            Experience the illuminating effect of our Hawaiian botanical serum on your skin
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-10 w-full">
          {/* AR Card Section */}
          <div className="w-full lg:w-3/5 bg-white/95 backdrop-blur-sm rounded-2xl h-1/2 shadow-lg overflow-hidden">
            <div ref={canvasContainerRef} className="relative w-full h-full" style={{ aspectRatio: videoLoaded ? "auto" : "16/9" }}>
              <canvas ref={canvasRef} className="absolute inset-0 object-cover z-20" />
              <div
                ref={sliderRef}
                className="absolute top-0 bottom-0 w-8 z-50 cursor-ew-resize select-none"
                style={{
                  left: `calc(${sliderPosition}% - 16px)`,
                  touchAction: "none",
                  WebkitUserSelect: "none",
                  WebkitTouchCallout: "none",
                }}
              />
              {(isLoading || !imagesLoaded) && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-xl">
                  <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-2 border-b-2 border-[#C09D7C]"></div>
                </div>
              )}
              <div className="absolute top-2 sm:top-3 md:top-4 left-2 sm:left-3 md:left-4 right-2 sm:right-3 md:right-4 flex justify-between z-20">
                <div className="bg-black/70 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm md:text-base font-light tracking-wide">
                  Before
                </div>
                <div className="bg-black/70 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm md:text-base font-light tracking-wide">
                  After
                </div>
              </div>
              <img src={droplets} alt="Droplet Overlay" className="absolute top-10 sm:top-12 md:top-16 right-4 z-30 w-10 sm:w-16 md:w-24 lg:w-32" />
            </div>
            <video
              ref={videoRef}
              className="hidden"
              autoPlay
              muted
              playsInline
              style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}
            />
          </div>

          {/* Product Info Section */}
          <div className="w-full lg:w-2/5 flex flex-col gap-4 sm:gap-5 md:gap-6">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-4 sm:p-5 md:p-6 lg:p-7">
              <div className="flex flex-col sm:flex-row items-center mb-4 sm:mb-6">
                <div className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 xl:w-48 xl:h-48 flex-shrink-0 bg-gradient-to-br from-[#f8f4ed] to-[#fcfaf5] rounded-xl flex items-center justify-center shadow-sm mb-4 sm:mb-0">
                  <img src={productImage} alt="Soul Serum Product" className="w-full h-full object-contain p-2" />
                </div>
                <div className="sm:ml-5 text-center sm:text-left">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-light text-[#78624E]">
                    {productInfo.name}
                  </h2>
                  <p className="text-sm sm:text-base md:text-lg text-[#C09D7C] font-light">
                    {productInfo.subtitle}
                  </p>
                  <p className="text-sm md:text-base text-gray-600 mt-2 font-light">
                    {productInfo.description}
                  </p>
                  <div className="flex flex-col sm:flex-row items-center gap-2 mt-3">
                    <p className="text-lg sm:text-xl md:text-2xl font-medium text-[#78624E]">
                      {productInfo.price}
                    </p>
                    <span className="text-xs sm:text-sm text-gray-500">
                      {productInfo.size}
                    </span>
                  </div>
                </div>
              </div>

              <a
                href={productInfo.shopifyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-[#C09D7C] hover:bg-[#A88B6E] text-white text-center py-3 sm:py-3.5 md:py-4 rounded-xl font-normal text-sm sm:text-base md:text-lg tracking-wide transition-colors shadow-md mt-6"
              >
                Add To Cart
              </a>
              <a
                href={productInfo.shopifyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-[#C09D7C] hover:bg-[#A88B6E] text-white text-center py-3 sm:py-3.5 md:py-4 rounded-xl font-normal text-sm sm:text-base md:text-lg tracking-wide transition-colors shadow-md mt-6"
              >
                Buy Now
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 md:mt-8 lg:mt-10 text-center">
          <p className="text-xs sm:text-sm text-gray-500 max-w-3xl mx-auto">
            Pure Mana Hawaii products are crafted with care using Hawaiian-grown ingredients. Our Soul Serum is made in small batches to ensure the highest quality. Cruelty-free, vegan, and clean beauty.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SoulSerumAR;
