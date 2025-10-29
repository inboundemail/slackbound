================================================
FILE: apps/web/src/components/layout/landing/features.tsx
================================================
import { ModernCardDescription, ModernCardTitle } from "@/components/ui/modern-card";
import React from "react";

const Features = () => {
  return (
    <div className="grid grid-flow-row sm:h-[150px] sm:grid-cols-3">
      <div className="flex h-40 flex-col gap-3 border-b border-dashed p-4 sm:h-auto">
        <ModernCardTitle>Beautiful</ModernCardTitle>
        <ModernCardDescription>
          Professionally designed and visually appealing invoices can increase the chances of clients paying promptly.
        </ModernCardDescription>
      </div>
      <div className="flex h-40 flex-col gap-3 border-b border-dashed p-4 sm:h-auto sm:border-l">
        <ModernCardTitle>Free & Unlimited</ModernCardTitle>
        <ModernCardDescription>
          Create and send as many invoices as you need — no limits, no hidden costs, just seamless billing freedom.
        </ModernCardDescription>
      </div>
      <div className="flex h-40 flex-col gap-3 border-b border-dashed p-4 sm:h-auto sm:border-l">
        <ModernCardTitle>Safe & Open Source</ModernCardTitle>
        <ModernCardDescription>
          Your data stays yours — we never track, sell, or share it. Store everything locally or securely on our server
          — the choice is yours.
        </ModernCardDescription>
      </div>
    </div>
  );
};

export default Features;



================================================
FILE: apps/web/src/components/layout/landing/footer.tsx
================================================
"use client";

import { animate, motion, useMotionValue, useSpring } from "motion/react";
import React, { useEffect, useRef, useState } from "react";

const Footer = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const svgViewBox = { width: 932, height: 213 };

  const x = useMotionValue(svgViewBox.width / 2);
  const y = useMotionValue(svgViewBox.height / 2);

  const springConfig = { damping: 200, stiffness: 300, mass: 0.5 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const loopingAnimX = useRef<ReturnType<typeof animate> | null>(null);
  const loopingAnimY = useRef<ReturnType<typeof animate> | null>(null);

  useEffect(() => {
    let initialAnimX: ReturnType<typeof animate> | undefined;
    let initialAnimY: ReturnType<typeof animate> | undefined;

    if (!isHovered) {
      const fromX = x.get();
      const toX = svgViewBox.width;
      const fullDurationX = 10;
      const durationX = fullDurationX * (Math.abs(toX - fromX) / svgViewBox.width);

      initialAnimX = animate(x, toX, {
        duration: durationX,
        ease: "linear",
        onComplete: () => {
          loopingAnimX.current = animate(x, [toX, 0], {
            duration: fullDurationX,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          });
        },
      });

      const fromY = y.get();
      const toY = svgViewBox.height * 0.8;
      const waypointA = svgViewBox.height * 0.8;
      const waypointB = svgViewBox.height * 0.2;
      const fullDurationY = 8;
      const durationY = fullDurationY * (Math.abs(toY - fromY) / Math.abs(waypointA - waypointB));

      initialAnimY = animate(y, toY, {
        duration: durationY,
        ease: "linear",
        onComplete: () => {
          loopingAnimY.current = animate(y, [toY, waypointB], {
            duration: fullDurationY,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          });
        },
      });
    }

    return () => {
      initialAnimX?.stop();
      initialAnimY?.stop();
      loopingAnimX.current?.stop();
      loopingAnimX.current = null;
      loopingAnimY.current?.stop();
      loopingAnimY.current = null;
    };
  }, [isHovered, x, y, svgViewBox.width, svgViewBox.height]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const svgX = (mouseX / rect.width) * svgViewBox.width;
      const svgY = (mouseY / rect.height) * svgViewBox.height;

      x.set(svgX);
      y.set(svgY);
    }
  };

  const handleMouseOver = () => {
    setIsHovered(true);
  };

  const handleMouseOut = () => {
    setIsHovered(false);
  };

  return (
    <div
      ref={containerRef}
      className="flex h-[130px] items-center overflow-hidden px-4 sm:h-auto sm:px-0"
      onMouseMove={handleMouseMove}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      <svg width="100%" height="213" viewBox="0 0 932 213" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g stroke="#2C2C2C" strokeLinejoin="round">
          <path
            d="M33.375 43V171H14.0625V43H33.375ZM164.813 43V171H147.062L82 77.125H80.8125V171H61.5V43H79.375L144.5 137H145.687V43H164.813ZM204.172 43L239.797 147.25H241.234L276.859 43H297.734L251.672 171H229.359L183.297 43H204.172ZM421.047 107C421.047 120.667 418.547 132.417 413.547 142.25C408.547 152.042 401.693 159.583 392.984 164.875C384.318 170.125 374.464 172.75 363.422 172.75C352.339 172.75 342.443 170.125 333.734 164.875C325.068 159.583 318.234 152.021 313.234 142.187C308.234 132.354 305.734 120.625 305.734 107C305.734 93.3333 308.234 81.6042 313.234 71.8125C318.234 61.9792 325.068 54.4375 333.734 49.1875C342.443 43.8958 352.339 41.25 363.422 41.25C374.464 41.25 384.318 43.8958 392.984 49.1875C401.693 54.4375 408.547 61.9792 413.547 71.8125C418.547 81.6042 421.047 93.3333 421.047 107ZM401.922 107C401.922 96.5833 400.234 87.8125 396.859 80.6875C393.526 73.5208 388.943 68.1042 383.109 64.4375C377.318 60.7292 370.755 58.875 363.422 58.875C356.047 58.875 349.464 60.7292 343.672 64.4375C337.88 68.1042 333.297 73.5208 329.922 80.6875C326.589 87.8125 324.922 96.5833 324.922 107C324.922 117.417 326.589 126.208 329.922 133.375C333.297 140.5 337.88 145.917 343.672 149.625C349.464 153.292 356.047 155.125 363.422 155.125C370.755 155.125 377.318 153.292 383.109 149.625C388.943 145.917 393.526 140.5 396.859 133.375C400.234 126.208 401.922 117.417 401.922 107ZM464.438 43V171H445.125V43H464.438ZM598.875 84.625H579.375C578.625 80.4583 577.229 76.7917 575.188 73.625C573.146 70.4583 570.646 67.7708 567.688 65.5625C564.729 63.3542 561.417 61.6875 557.75 60.5625C554.125 59.4375 550.271 58.875 546.188 58.875C538.813 58.875 532.208 60.7292 526.375 64.4375C520.583 68.1458 516 73.5833 512.625 80.75C509.292 87.9167 507.625 96.6667 507.625 107C507.625 117.417 509.292 126.208 512.625 133.375C516 140.542 520.604 145.958 526.437 149.625C532.271 153.292 538.833 155.125 546.125 155.125C550.167 155.125 554 154.583 557.625 153.5C561.292 152.375 564.604 150.729 567.563 148.562C570.521 146.396 573.021 143.75 575.062 140.625C577.146 137.458 578.583 133.833 579.375 129.75L598.875 129.812C597.833 136.104 595.813 141.896 592.813 147.187C589.854 152.438 586.042 156.979 581.375 160.812C576.75 164.604 571.458 167.542 565.5 169.625C559.542 171.708 553.042 172.75 546 172.75C534.917 172.75 525.042 170.125 516.375 164.875C507.708 159.583 500.875 152.021 495.875 142.187C490.917 132.354 488.438 120.625 488.438 107C488.438 93.3333 490.938 81.6042 495.938 71.8125C500.938 61.9792 507.771 54.4375 516.438 49.1875C525.104 43.8958 534.958 41.25 546 41.25C552.792 41.25 559.125 42.2292 565 44.1875C570.917 46.1042 576.229 48.9375 580.938 52.6875C585.646 56.3958 589.542 60.9375 592.625 66.3125C595.708 71.6458 597.792 77.75 598.875 84.625ZM621.984 171V43H702.234V59.625H641.297V98.625H698.047V115.187H641.297V154.375H702.984V171H621.984ZM728.031 171V43H747.344V154.375H805.344V171H728.031ZM808.047 43H829.984L863.422 101.187H864.797L898.234 43H920.172L873.734 120.75V171H854.484V120.75L808.047 43Z"
            fill="url(#text-gradient)"
            stroke="#2C2C2C"
          />
          <path d="M87 35H68L61 42.5H79.5L87 35ZM87 35L145.5 121" />
          <path d="M81 171.5L89 165V88" />
          <path d="M145 42.5L151 35H172M172 35L165.5 42.5M172 35V166L165 171.5" />
          <path d="M40 36H21L13.5 42.5H34M40 36L34 42.5M40 36V164L34 171.5V42.5" />
          <path d="M182.5 42.5L189 35H211.5M211.5 35L204.5 42.5M211.5 35L245.5 134M276.5 42.5L283 35H307.5M307.5 35L298.5 42.5M307.5 35L261 166L252 171.5" />
          <path d="M327.5 52.9999C334.333 43.9999 355.9 27.8999 387.5 35.4999C427 44.9999 430.949 95.7487 427.5 112.5C424 129.5 419.5 138.5 409 151M339 69C331.5 85.8333 323.7 124.1 352.5 142.5C358.5 146 381 151 393.5 139" />
          <path d="M470.5 36H451.5L444.618 42.5H465M470.5 36L465 42.5M470.5 36V164L465 171.5V42.5" />
          <path d="M506 57C514.833 44.3334 542 23.2 580 40C591.5 45.5 602.5 57 606.5 78L599.5 85M606.5 122.5H586L579 129.5H599L606.5 122.5ZM606.5 122.5C604.5 138.9 593.333 150.667 588 154.5M525 66C516.167 84.3333 506.9 126 540.5 146C553 152 573 145.5 577.5 135" />
          <path d="M709.5 35.5H628.5L621.5 42.5H702.5M709.5 35.5L702.5 42.5M709.5 35.5V53L702.5 60V42.5M649 115.5V147M649 147H710.5M649 147L642 154M710.5 147L703.5 154M710.5 147V164.5L703.5 172M649 60V91M649 91L641.5 98.5M649 91H705.5M705.5 91L698.5 98.5M705.5 91V108.5L698.5 116" />
          <path d="M727.5 42.5L734.5 35.5H755M755 35.5L748 42.5M755 35.5V147M755 147L748 154M755 147H813M813 147L805.5 154.5M813 147V164.5L806 171.5" />
          <path d="M807 42.5L814 35.5H837M837 35.5L830 42.5M837 35.5L869.5 91.5M898 42.5L907.5 35.5H931.5M931.5 35.5L921 42.5M931.5 35.5L881.5 120.5V164.5L874.5 171.5" />
        </g>
        <g mask="url(#stroke-mask)">
          <motion.circle
            id="animation-circle"
            animate={{
              rotate: 360,
            }}
            transition={{
              rotate: {
                duration: 8,
                repeat: Infinity,
                ease: "linear",
              },
            }}
            cx={smoothX}
            cy={smoothY}
            r="90"
            fill="url(#circle-rgb-gradient)"
            filter="url(#blur-filter)"
            overflow="visible"
          />
        </g>
        <defs>
          <filter id="blur-filter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="25" />
          </filter>
          <mask id="stroke-mask">
            <g stroke="white" strokeLinejoin="round" fill="none" opacity="0.6">
              <path
                d="M33.375 43V171H14.0625V43H33.375ZM164.813 43V171H147.062L82 77.125H80.8125V171H61.5V43H79.375L144.5 137H145.687V43H164.813ZM204.172 43L239.797 147.25H241.234L276.859 43H297.734L251.672 171H229.359L183.297 43H204.172ZM421.047 107C421.047 120.667 418.547 132.417 413.547 142.25C408.547 152.042 401.693 159.583 392.984 164.875C384.318 170.125 374.464 172.75 363.422 172.75C352.339 172.75 342.443 170.125 333.734 164.875C325.068 159.583 318.234 152.021 313.234 142.187C308.234 132.354 305.734 120.625 305.734 107C305.734 93.3333 308.234 81.6042 313.234 71.8125C318.234 61.9792 325.068 54.4375 333.734 49.1875C342.443 43.8958 352.339 41.25 363.422 41.25C374.464 41.25 384.318 43.8958 392.984 49.1875C401.693 54.4375 408.547 61.9792 413.547 71.8125C418.547 81.6042 421.047 93.3333 421.047 107ZM401.922 107C401.922 96.5833 400.234 87.8125 396.859 80.6875C393.526 73.5208 388.943 68.1042 383.109 64.4375C377.318 60.7292 370.755 58.875 363.422 58.875C356.047 58.875 349.464 60.7292 343.672 64.4375C337.88 68.1042 333.297 73.5208 329.922 80.6875C326.589 87.8125 324.922 96.5833 324.922 107C324.922 117.417 326.589 126.208 329.922 133.375C333.297 140.5 337.88 145.917 343.672 149.625C349.464 153.292 356.047 155.125 363.422 155.125C370.755 155.125 377.318 153.292 383.109 149.625C388.943 145.917 393.526 140.5 396.859 133.375C400.234 126.208 401.922 117.417 401.922 107ZM464.438 43V171H445.125V43H464.438ZM598.875 84.625H579.375C578.625 80.4583 577.229 76.7917 575.188 73.625C573.146 70.4583 570.646 67.7708 567.688 65.5625C564.729 63.3542 561.417 61.6875 557.75 60.5625C554.125 59.4375 550.271 58.875 546.188 58.875C538.813 58.875 532.208 60.7292 526.375 64.4375C520.583 68.1458 516 73.5833 512.625 80.75C509.292 87.9167 507.625 96.6667 507.625 107C507.625 117.417 509.292 126.208 512.625 133.375C516 140.542 520.604 145.958 526.437 149.625C532.271 153.292 538.833 155.125 546.125 155.125C550.167 155.125 554 154.583 557.625 153.5C561.292 152.375 564.604 150.729 567.563 148.562C570.521 146.396 573.021 143.75 575.062 140.625C577.146 137.458 578.583 133.833 579.375 129.75L598.875 129.812C597.833 136.104 595.813 141.896 592.813 147.187C589.854 152.438 586.042 156.979 581.375 160.812C576.75 164.604 571.458 167.542 565.5 169.625C559.542 171.708 553.042 172.75 546 172.75C534.917 172.75 525.042 170.125 516.375 164.875C507.708 159.583 500.875 152.021 495.875 142.187C490.917 132.354 488.438 120.625 488.438 107C488.438 93.3333 490.938 81.6042 495.938 71.8125C500.938 61.9792 507.771 54.4375 516.438 49.1875C525.104 43.8958 534.958 41.25 546 41.25C552.792 41.25 559.125 42.2292 565 44.1875C570.917 46.1042 576.229 48.9375 580.938 52.6875C585.646 56.3958 589.542 60.9375 592.625 66.3125C595.708 71.6458 597.792 77.75 598.875 84.625ZM621.984 171V43H702.234V59.625H641.297V98.625H698.047V115.187H641.297V154.375H702.984V171H621.984ZM728.031 171V43H747.344V154.375H805.344V171H728.031ZM808.047 43H829.984L863.422 101.187H864.797L898.234 43H920.172L873.734 120.75V171H854.484V120.75L808.047 43Z"
                fill="none"
              />
              <path d="M87 35H68L61 42.5H79.5L87 35ZM87 35L145.5 121" />
              <path d="M81 171.5L89 165V88" />
              <path d="M145 42.5L151 35H172M172 35L165.5 42.5M172 35V166L165 171.5" />
              <path d="M40 36H21L13.5 42.5H34M40 36L34 42.5M40 36V164L34 171.5V42.5" />
              <path d="M182.5 42.5L189 35H211.5M211.5 35L204.5 42.5M211.5 35L245.5 134M276.5 42.5L283 35H307.5M307.5 35L298.5 42.5M307.5 35L261 166L252 171.5" />
              <path d="M327.5 52.9999C334.333 43.9999 355.9 27.8999 387.5 35.4999C427 44.9999 430.949 95.7487 427.5 112.5C424 129.5 419.5 138.5 409 151M339 69C331.5 85.8333 323.7 124.1 352.5 142.5C358.5 146 381 151 393.5 139" />
              <path d="M470.5 36H451.5L444.618 42.5H465M470.5 36L465 42.5M470.5 36V164L465 171.5V42.5" />
              <path d="M506 57C514.833 44.3334 542 23.2 580 40C591.5 45.5 602.5 57 606.5 78L599.5 85M606.5 122.5H586L579 129.5H599L606.5 122.5ZM606.5 122.5C604.5 138.9 593.333 150.667 588 154.5M525 66C516.167 84.3333 506.9 126 540.5 146C553 152 573 145.5 577.5 135" />
              <path d="M709.5 35.5H628.5L621.5 42.5H702.5M709.5 35.5L702.5 42.5M709.5 35.5V53L702.5 60V42.5M649 115.5V147M649 147H710.5M649 147L642 154M710.5 147L703.5 154M710.5 147V164.5L703.5 172M649 60V91M649 91L641.5 98.5M649 91H705.5M705.5 91L698.5 98.5M705.5 91V108.5L698.5 116" />
              <path d="M727.5 42.5L734.5 35.5H755M755 35.5L748 42.5M755 35.5V147M755 147L748 154M755 147H813M813 147L805.5 154.5M813 147V164.5L806 171.5" />
              <path d="M807 42.5L814 35.5H837M837 35.5L830 42.5M837 35.5L869.5 91.5M898 42.5L907.5 35.5H931.5M931.5 35.5L921 42.5M931.5 35.5L881.5 120.5V164.5L874.5 171.5" />
            </g>
          </mask>
          <linearGradient id="text-gradient" x1="463" y1="4.18174e-06" x2="463" y2="171" gradientUnits="userSpaceOnUse">
            <stop stopColor="#2C2C2C" stopOpacity="0" />
            <stop offset="1" stopColor="#2C2C2C" stopOpacity="0.25" />
          </linearGradient>
          <linearGradient id="circle-rgb-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0.125" stopColor="#FF0000" />
            <stop offset="0.26" stopColor="#FFA500" />
            <stop offset="0.39" stopColor="#FFFF00" />
            <stop offset="0.52" stopColor="#008000" />
            <stop offset="0.65" stopColor="#0000FF" />
            <stop offset="0.78" stopColor="#4B0082" />
            <stop offset="0.91" stopColor="#EE82EE" />
            <stop offset="1" stopColor="#FF0000" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default Footer;



================================================
FILE: apps/web/src/components/layout/landing/header.tsx
================================================
import ThemeSwitch from "@/components/table-columns/theme-switch";
import { Button } from "@/components/ui/button";
import { CircleOpenArrowRight } from "@/icons";
import { LINKS } from "@/constants/links";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <div className="flex h-16 items-center justify-between border-b border-dashed px-4">
      <Link className="flex flex-row items-center gap-2" href={LINKS.HOME}>
        <Image src="/official/logo-icon.png" alt="logo" width={32} height={32} />
        <span className="instrument-serif text-xl font-semibold">Invoicely</span>
      </Link>
      <div className="flex flex-row items-center gap-3">
        <ThemeSwitch />
        <Link href={LINKS.CREATE.INVOICE}>
          <Button variant="secondary">
            <span>Invoice It</span>
            <CircleOpenArrowRight className="text-muted-foreground -rotate-45" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Header;



================================================
FILE: apps/web/src/components/layout/landing/hero.tsx
================================================
"use client";

import { CircleOpenArrowRight, GithubIcon, Star } from "@/assets/icons";
import { PostHogAnalytics } from "@/components/ui/posthog-analytics";
import { useGithubStars } from "@/hooks/use-github-stars";
import { ScribbledArrowToRight } from "@/assets/svgs";
import { Button } from "@/components/ui/button";
import NumberFlow from "@number-flow/react";
import { LINKS } from "@/constants/links";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Hero = () => {
  const { stars } = useGithubStars();

  return (
    <div className="relative flex h-[calc(100svh-64px-150px)] flex-row items-center overflow-hidden border-b border-dashed">
      <div className="absolute inset-0 h-full w-full overflow-hidden">
        <Image
          className="h-full min-h-full w-full object-cover object-left invert dark:invert-0"
          src="/official/invoicely-masked-background.png"
          alt="Hero"
          width={1920}
          height={1080}
        />
      </div>
      <div className="z-10 flex flex-col gap-4">
        <div className="flex flex-row items-center gap-2 px-6">
          <div className="bg-muted/20 relative flex h-7 w-16 flex-row items-center gap-2 rounded-md border px-2">
            <Star className="size-4 text-yellow-500" />
            <span className="urbanist absolute right-3 text-sm font-semibold">
              <NumberFlow value={stars} />
            </span>
          </div>
          <div className="flex flex-row items-center">
            <div className="bg-muted/20 h-1.5 w-1.5 border"></div>
            <div className="from-muted h-px w-40 bg-gradient-to-r to-transparent"></div>
          </div>
        </div>
        <div className="instrument-serif flex flex-col gap-2 px-6 text-6xl">
          <h1 className="dark:text-primary-foreground/30 text-secondary-foreground/50">
            Create <span className="dark:text-primary-foreground text-secondary-foreground">Beautiful</span> Invoices
          </h1>
          <h2 className="dark:text-primary-foreground/30 text-secondary-foreground/50">
            Not <span className="dark:text-primary-foreground text-secondary-foreground">Ugly</span> Ones
          </h2>
        </div>
        <div className="mt-4 flex flex-row gap-4 px-6">
          <Link href={LINKS.CREATE.INVOICE}>
            <Button>
              <span>Get Started</span>
              <CircleOpenArrowRight className="-rotate-45" />
            </Button>
          </Link>
          <div className="relative">
            <PostHogAnalytics
              analytics={{
                name: "github-open-source-click",
                group: "landing-page",
              }}
            >
              <Link target="_blank" href={LINKS.SOCIALS.GITHUB}>
                <Button variant="secondary">
                  <span>Open Source</span>
                  <GithubIcon />
                </Button>
              </Link>
            </PostHogAnalytics>
            <span className="jetbrains-mono text-muted-foreground/20 pointer-events-none absolute -top-10 left-40 size-full -rotate-[34deg] text-[10px]">
              Give Star <br /> please :3 <br /> for cookie
            </span>
            <ScribbledArrowToRight className="text-muted-foreground/20 pointer-events-none absolute top-2 left-22 size-full rotate-[190deg]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;



================================================
FILE: apps/web/src/components/layout/landing/our-sponser.tsx
================================================
import { ModernCardContainer, ModernCardDescription, ModernCardTitle } from "@/components/ui/modern-card";
import { FancyBadgeWithBorders } from "@/components/ui/fancy-badges";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Sponser {
  name: string;
  image: string | null;
  description: string;
  imageClass: string;
  invert?: boolean;
  label?: string;
  link?: string;
}

const sponsers: Sponser[] = [
  {
    name: "Vercel",
    label: "Open Source Program",
    invert: true,
    imageClass: "h-20 w-40",
    image: "https://assets.invoicely.gg/vercel-logo.png",
    description:
      "Vercel is a platform for building modern web applications. It provides a seamless development experience with a focus on performance and scalability. Vercel provides the developer tools and cloud infrastructure to build, scale, and secure a faster, more personalized web.",
  },
  {
    name: "NeonDB",
    label: "Best Database Service",
    imageClass: "h-20 w-40",
    image: "/social/neondb.svg",
    description:
      "NeonDB is a modern, open-source database that provides a seamless database. The database developers trust, on a serverless platform designed to help you build reliable and scalable applications faster.",
  },
  {
    name: "Cloudflare",
    label: "Open Source Program",
    imageClass: "h-20 w-40",
    image: "https://assets.invoicely.gg/cloudflare-logo.png",
    description:
      "Cloudflare is a global CDN that provides a secure and fast way to deliver content to your users. Cloudflare make websites, apps, and networks faster and more secure. Our developer platform is the best place to build modern apps and deliver AI initiatives.",
  },
  // {
  //   name: "v0.Dev",
  //   label: "#1 Design Tool",
  //   invert: true,
  //   imageClass: "h-20 w-22",
  //   image: "https://assets.invoicely.gg/v0-logo.png",
  //   description:
  //     "Generate UI, build full-stack apps, ask questions, and more. v0.Dev is the best way to build your next project. ",
  // },
  // Add Company Here
  {
    name: "Your Company Here",
    label: "Free Sponser",
    imageClass: "h-20 w-40",
    image: null,
    description:
      "Invoicely is free for everyone—forever. If you'd like to sponsor us with a service that benefits our platform and users, contact us below.",
    link: "mailto:admin@legions.dev",
  },
];

const OurSponser = () => {
  return (
    <div className="flex w-full flex-col">
      <div className="flex flex-col items-center border-b border-dashed py-4">
        <FancyBadgeWithBorders>Our Sponsers</FancyBadgeWithBorders>
      </div>
      <div className="flex flex-col">
        {sponsers.map((sponser, index) => (
          <div
            key={sponser.name}
            className={cn("grid grid-flow-row grid-cols-1 border-b border-dashed sm:grid-cols-3 md:h-[150px]")}
          >
            <ModernCardContainer className={cn("flex flex-col p-6 sm:col-span-2", index % 2 === 0 && "sm:order-1")}>
              <ModernCardTitle label={sponser.label}>{sponser.name}</ModernCardTitle>
              <ModernCardDescription>{sponser.description}</ModernCardDescription>
              {sponser.link && (
                <Link className="mt-1" href={sponser.link}>
                  <Button variant="white" size="xs">
                    Contact Us
                  </Button>
                </Link>
              )}
            </ModernCardContainer>
            <ModernCardContainer
              className={cn(
                index === sponsers.length - 1 && "!p-2",
                index % 2 === 0 ? "sm:border-r" : "sm:border-l",
                "flex flex-col items-center justify-center border-none p-6 sm:border-dashed",
              )}
            >
              {sponser.image ? (
                <Image
                  className={cn("object-contain", sponser.invert && "invert dark:invert-0", sponser.imageClass)}
                  src={sponser.image}
                  alt={sponser.name}
                  width={254}
                  height={254}
                />
              ) : (
                <div className="bg-dashed flex h-full w-full items-center justify-center rounded-md px-10 py-5">
                  <span className="jetbrains-mono bg-background text-muted-foreground rounded-sm px-2 py-1 text-center text-xs">
                    Your Image Here
                  </span>
                </div>
              )}
            </ModernCardContainer>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurSponser;


@import "tailwindcss";
@import "tw-animate-css";
@import "fumadocs-ui/css/shadcn.css";
@import "fumadocs-ui/css/preset.css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
  --color-sidebar-ring: var(--sidebar-ring);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar: var(--sidebar);
  --color-chart-5: var(--chart-5);
  --color-chart-4: var(--chart-4);
  --color-chart-3: var(--chart-3);
  --color-chart-2: var(--chart-2);
  --color-chart-1: var(--chart-1);
  --color-ring: var(--ring);
  --color-input: var(--input);
  --color-border: var(--border);
  --color-destructive: var(--destructive);
  --color-accent-foreground: var(--accent-foreground);
  --color-accent: var(--accent);
  --color-muted-foreground: var(--muted-foreground);
  --color-muted: var(--muted);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-secondary: var(--secondary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary: var(--primary);
  --color-light-primary: var(--light-primary);
  --color-dark-primary: var(--dark-primary);
  --color-popover-foreground: var(--popover-foreground);
  --color-popover: var(--popover);
  --color-card-foreground: var(--card-foreground);
  --color-card: var(--card);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}

:root {
  --radius: 0.6rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.141 0.005 285.823);
  --card: oklch(0.98 0 0);
  --card-foreground: oklch(0.141 0.005 285.823);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.141 0.005 285.823);
  --primary: oklch(0.58 0.2346 278.29);
  --light-primary: oklch(0.76 0.1256 276.97);
  --dark-primary: oklch(0.45 0.2433 276.73);
  --primary-foreground: oklch(0.971 0.013 17.38);
  --secondary: oklch(0.967 0.001 286.375);
  --secondary-foreground: oklch(0.21 0.006 285.885);
  --muted: oklch(0.967 0.001 286.375);
  --muted-foreground: oklch(0.552 0.016 285.938);
  --accent: oklch(0.967 0.001 286.375);
  --accent-foreground: oklch(0.21 0.006 285.885);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.92 0.004 286.32);
  --input: oklch(0.92 0.004 286.32);
  --ring: oklch(0.58 0.2346 278.29);
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
  --sidebar: oklch(0.98 0 0);
  --sidebar-foreground: oklch(0.141 0.005 285.823);
  --sidebar-primary: oklch(0.58 0.2346 278.29);
  --sidebar-primary-foreground: oklch(0.971 0.013 17.38);
  --sidebar-accent: oklch(0.967 0.001 286.375);
  --sidebar-accent-foreground: oklch(0.21 0.006 285.885);
  --sidebar-border: oklch(0.92 0.004 286.32);
  --sidebar-ring: oklch(0.58 0.2346 278.29);
}

.dark {
  --background: oklch(0.141 0.005 285.823);
  --foreground: oklch(0.98 0 0);
  --card: oklch(0.21 0.006 285.885);
  --card-foreground: oklch(0.98 0 0);
  --popover: oklch(0.21 0.006 285.885);
  --popover-foreground: oklch(0.98 0 0);
  --primary: oklch(0.58 0.2346 278.29);
  --light-primary: oklch(0.76 0.1256 276.97);
  --dark-primary: oklch(0.45 0.2433 276.73);
  --primary-foreground: oklch(0.971 0.013 17.38);
  --secondary: oklch(0.274 0.006 286.033);
  --secondary-foreground: oklch(0.98 0 0);
  --muted: oklch(0.274 0.006 286.033);
  --muted-foreground: oklch(0.51 0.015 286.067);
  --accent: oklch(0.274 0.006 286.033);
  --accent-foreground: oklch(0.98 0 0);
  --destructive: oklch(0.58 0.2383 25.05);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.58 0.2346 278.29);
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
  --sidebar: oklch(0.21 0.006 285.885);
  --sidebar-foreground: oklch(0.98 0 0);
  --sidebar-primary: oklch(0.58 0.2346 278.29);
  --sidebar-primary-foreground: oklch(0.971 0.013 17.38);
  --sidebar-accent: oklch(0.274 0.006 286.033);
  --sidebar-accent-foreground: oklch(0.98 0 0);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.58 0.2346 278.29);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground overscroll-none;
  }
}

/* Transition For Theme */

body {
  transition: background-color var(--transition-duration) ease;
}

img,
button {
  user-select: none;
}

.h-screen {
  height: 100dvh;
}

.button-highlighted-shadow {
  @apply shadow-[inset_0px_1.5px_0px_rgba(255,255,255,0.15)];
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}

::selection {
  @apply bg-primary/80 text-primary-foreground;
}

.dash-page {
  @apply flex w-full flex-col;
}

.dash-layout-page-content-height {
  @apply h-[calc(100svh-50px)] md:h-[calc(100svh-48px-18px)];
}

.scroll-bar-hidden::-webkit-scrollbar {
  display: none;
}

.scroll-bar-hidden {
  scrollbar-width: none;
}

.blog-hero-gradient {
  background: linear-gradient(
    165deg,
    #3a3a3a,
    #373737,
    #353535,
    #323232,
    #303030,
    #2d2d2d,
    #2a2a2a,
    #282828,
    #252525,
    #232323,
    #202020,
    #1e1e1e
  );
}

code,
pre {
  font-family: var(--font-jetbrains-mono) !important;
}

li::marker {
  @apply !text-secondary-foreground;
}

.text-fd-muted-foreground {
  font-family: var(--font-jetbrains-mono) !important;
  font-size: 13px !important;
  letter-spacing: -0.02em !important;
}

.text-fd-muted-foreground {
  @apply !text-secondary-foreground font-semibold;
}

.new-container {
  @apply mx-auto flex max-w-[1000px] flex-col border-x border-dashed;
}

.bg-dashed {
  background-image: linear-gradient(
    45deg,
    var(--border) 12.5%,
    transparent 12.5%,
    transparent 50%,
    var(--border) 50%,
    var(--border) 62.5%,
    transparent 62.5%,
    transparent 100%
  );
  background-size: 0.25rem 0.25rem;
}