const WaveBackground = () => {
  return (
    <div className="fixed bottom-0 left-0 w-full h-[300px] -z-10 overflow-hidden pointer-events-none select-none">
      <svg
        className="w-full h-full"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#9333ea"
          fillOpacity="0.2"
          d="M0,96L40,117.3C80,139,160,181,240,197.3C320,213,400,203,480,192C560,181,640,171,720,170.7C800,171,880,181,960,170.7C1040,160,1120,128,1200,106.7C1280,85,1360,75,1400,69.3L1440,64L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
        />
      </svg>
    </div>
  );
};

export default WaveBackground;
