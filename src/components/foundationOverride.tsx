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

  // Product information - enhanced with more details from Pure Mana Hawaii
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
    price: "$54.00",
    size: "30 ml / 1 fl oz",
    shopifyLink: "https://www.puremanahawaii.com/products/soul-serum",
  };

  // Check if on mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Preload all images
  useEffect(() => {
    const logoImage = new Image();
    logoImage.src = logo;
    logoImage.onload = () => {
      logoImageRef.current = logoImage;
      checkImagesLoaded();
    };

    const dropletImage = new Image();
    dropletImage.src = droplets;
    dropletImage.onload = () => {
      dropletImageRef.current = dropletImage;
      checkImagesLoaded();
    };

    const productImg = new Image();
    productImg.src = productImage;
    productImg.onload = () => {
      productImageRef.current = productImg;
      checkImagesLoaded();
    };

    function checkImagesLoaded() {
      if (
        logoImageRef.current &&
        dropletImageRef.current &&
        productImageRef.current
      ) {
        setImagesLoaded(true);
      }
    }
  }, []);

  // Main drawing function
  const drawSplitCanvas = (results: { multiFaceLandmarks: any[][] }) => {
    if (!canvasRef.current || !videoRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const splitPosition = (sliderPositionRef.current / 100) * canvas.width;

    // Clear the canvas and draw the video frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    // Draw the serum effect (right side) using foundation logic
    ctx.save();
    ctx.beginPath();
    ctx.rect(splitPosition, 0, canvas.width - splitPosition, canvas.height);
    ctx.clip();
    drawFoundation(results, canvas, ctx, selectedColorRef.current + "FF");
    ctx.restore();

    // Draw the before/after slider line
    ctx.beginPath();
    ctx.moveTo(splitPosition, 0);
    ctx.lineTo(splitPosition, canvas.height);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#FFFFFF";
    ctx.stroke();

    // Draw handle with shadow for better visibility
    const handleRadius = Math.min(15, canvas.width * 0.025);
    ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.beginPath();
    ctx.arc(splitPosition, canvas.height / 2, handleRadius, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.fill();
    ctx.shadowColor = "transparent";
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#F1C27D"; // Changed to match Soul Serum color
    ctx.stroke();

    // Draw slider arrows inside the handle
    ctx.beginPath();
    ctx.moveTo(splitPosition - 6, canvas.height / 2);
    ctx.lineTo(splitPosition - 2, canvas.height / 2 - 4);
    ctx.lineTo(splitPosition - 2, canvas.height / 2 + 4);
    ctx.moveTo(splitPosition + 6, canvas.height / 2);
    ctx.lineTo(splitPosition + 2, canvas.height / 2 - 4);
    ctx.lineTo(splitPosition + 2, canvas.height / 2 + 4);
    ctx.fillStyle = "#F1C27D"; // Changed to match Soul Serum color
    ctx.fill();

    // Draw responsive droplet watermark
    // if (dropletImageRef.current) {
    //   // More responsive sizing based on the smaller of width or height
    //   const minDimension = Math.min(canvas.width, canvas.height);
    //   const dropletSize = Math.max(minDimension * 0.1, 40); // Minimum size of 40px, scales with screen

    //   // Padding that scales with screen size, with minimum/maximum limits
    //   const padPercentage = 0.02; // 2% of canvas size
    //   const pad = Math.max(10, Math.min(20, canvas.width * padPercentage));

    //   ctx.save();
    //   ctx.globalAlpha = 0.85;
    //   ctx.drawImage(
    //     dropletImageRef.current,
    //     canvas.width - dropletSize - pad,
    //     pad,
    //     dropletSize,
    //     dropletSize
    //   );
    //   ctx.restore();
    // }
    // In your drawSplitCanvas function (foundationOverride.tsx or SoulSerumAR component)
    if (dropletImageRef.current) {
      const dropletSize = Math.min(canvas.width * 0.15, 120);
      const pad = Math.min(canvas.width * 0.02, 15);
      // Add an offset (e.g. 20px) to move the droplet image down
      const dropletYOffset = pad + 35;
      ctx.drawImage(
        dropletImageRef.current,
        canvas.width - dropletSize - pad,
        dropletYOffset,
        dropletSize,
        dropletSize
      );
    }
  };

  // Throttle slider updates with requestAnimationFrame
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
        const newPos = Math.max(
          0,
          Math.min(100, ((clientX - rect.left) / rect.width) * 100)
        );
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

  // Set up video, canvas dimensions, and face mesh processing
  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const handleMetadata = () => {
      if (!videoRef.current || !canvasRef.current) return;

      // Set canvas dimensions to match video dimensions exactly
      const vw = videoRef.current.videoWidth;
      const vh = videoRef.current.videoHeight;

      if (vw && vh) {
        canvasRef.current.width = vw;
        canvasRef.current.height = vh;

        // Update container styles to maintain aspect ratio
        updateCanvasContainerStyles(vw, vh);
        setVideoLoaded(true);
        setIsLoading(false);
      }
    };

    const processResults = (results: { multiFaceLandmarks: any[][] }) => {
      resultsRef.current = results;
      if (onResults) onResults(results);
      drawSplitCanvas(results);
    };

    // Listen for metadata to get video dimensions
    videoRef.current.addEventListener("loadedmetadata", handleMetadata);

    // Build face mesh
    const faceMesh = buildFaceMeshes(
      canvasRef.current,
      videoRef.current,
      processResults,
      drawFoundation,
      selectedColorRef.current
    );

    // Start camera
    startCamera(videoRef.current, faceMesh, cameraRef);

    return () => {
      if (videoRef.current)
        videoRef.current.removeEventListener("loadedmetadata", handleMetadata);
      if (cameraRef.current) cameraRef.current.stop();
    };
  }, []);

  // Update canvas container styles to maintain video aspect ratio
  const updateCanvasContainerStyles = (
    videoWidth: number,
    videoHeight: number
  ) => {
    if (!canvasContainerRef.current || !canvasRef.current) return;

    const container = canvasContainerRef.current;
    const containerWidth = container.clientWidth;

    // Calculate height based on video aspect ratio
    const aspectRatio = videoHeight / videoWidth;
    const heightValue = containerWidth * aspectRatio;

    // Set container height to maintain aspect ratio
    container.style.height = `${heightValue}px`;

    // Set canvas CSS dimensions to fill container while maintaining aspect ratio
    canvasRef.current.style.width = "100%";
    canvasRef.current.style.height = "100%";
    canvasRef.current.style.objectFit = "cover";
  };

  // Handle window resize responsively
  useEffect(() => {
    if (!videoLoaded) return;

    const handleResize = () => {
      if (
        videoRef.current &&
        videoRef.current.videoWidth &&
        videoRef.current.videoHeight
      ) {
        updateCanvasContainerStyles(
          videoRef.current.videoWidth,
          videoRef.current.videoHeight
        );
        if (resultsRef.current) drawSplitCanvas(resultsRef.current);
      }
    };

    // Initial sizing
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
            <span className="text-[#C09D7C] font-normal">Soul Serum</span>{" "}
            Virtual Try On
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-[#78624E] mt-2 max-w-2xl mx-auto font-light">
            Experience the illuminating effect of our Hawaiian botanical serum
            on your skin
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-10 w-full">
          {/* AR Card Section */}
          <div className="w-full lg:w-3/5 bg-white/95 backdrop-blur-sm rounded-2xl h-1/2 shadow-lg overflow-hidden">
            <div
              ref={canvasContainerRef}
              className="relative w-full"
              style={{ aspectRatio: videoLoaded ? "auto" : "16/9" }}
            >
              <canvas
                ref={canvasRef}
                className="absolute inset-0"
                style={{ zIndex: 2 }}
              />
              <div
                ref={sliderRef}
                className="absolute top-0 bottom-0 w-8 z-10 cursor-ew-resize"
                style={{
                  left: `calc(${sliderPosition}% - 16px)`,
                  touchAction: "none",
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
            </div>

            {/* Watermark overlay */}
            <div
              className="absolute bottom-2 left-2 z-40 flex items-center space-x-2 bg-white/55 px-2 py-1 rounded shadow-sm
                sm:px-3 sm:py-1 md:px-4 md:py-2"
            >
              <span className="text-xs sm:text-sm md:text-base font-medium text-gray-800">
                Powered by
              </span>
              <img
                src={logo}
                alt="Omnia Logo"
                className="h-6 sm:h-8 md:h-10 object-contain"
              />
            </div>

            {/* Hidden video element */}
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
            {/* Product Card with Image */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-4 sm:p-5 md:p-6 lg:p-7">
              <div className="flex flex-col sm:flex-row items-center mb-4 sm:mb-6">
                {/* Product Image */}
                <div className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 xl:w-48 xl:h-48 flex-shrink-0 bg-gradient-to-br from-[#f8f4ed] to-[#fcfaf5] rounded-xl flex items-center justify-center shadow-sm mb-4 sm:mb-0">
                  <img
                    src={productImage}
                    alt="Soul Serum Product"
                    className="w-full h-full object-contain p-2"
                  />
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

              {/* Tabs for Product Info */}
              <div className="mt-4 space-y-4">
                {/* <div>
                  <h3 className="font-medium text-sm sm:text-base md:text-lg text-[#78624E] mb-2 border-b border-[#E5D9CC] pb-1">
                    Key Benefits
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {productInfo.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start text-xs sm:text-sm md:text-base text-gray-700">
                        <span className="text-[#C09D7C] mr-2">✦</span> {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm sm:text-base md:text-lg text-[#78624E] mb-2 border-b border-[#E5D9CC] pb-1">
                    How To Use
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-gray-700">
                    {productInfo.howToUse}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm sm:text-base md:text-lg text-[#78624E] mb-2 border-b border-[#E5D9CC] pb-1">
                    Key Ingredients
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 italic">
                    {productInfo.ingredients}
                  </p>
                </div> */}
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

            {/* Additional Card for Testimonial */}
            {/* <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-4 sm:p-5 md:p-6 hidden sm:block">
              <div className="flex flex-col items-center text-center">
                <div className="text-[#C09D7C] text-2xl md:text-3xl mb-2">
                  ★★★★★
                </div>
                <p className="italic text-xs sm:text-sm md:text-base text-gray-700 mb-3">
                  "This serum gives my skin the most beautiful natural glow. The
                  Hawaiian botanicals make such a difference in my complexion!"
                </p>
                <p className="text-xs sm:text-sm text-[#78624E] font-medium">
                  — Sarah K., Verified Customer
                </p>
              </div>
            </div> */}
          </div>
        </div>

        {/* Footer with additional information */}
        <div className="mt-6 md:mt-8 lg:mt-10 text-center">
          <p className="text-xs sm:text-sm text-gray-500 max-w-3xl mx-auto">
            Pure Mana Hawaii products are crafted with care using Hawaiian-grown
            ingredients. Our Soul Serum is made in small batches to ensure the
            highest quality. Cruelty-free, vegan, and clean beauty.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SoulSerumAR;
