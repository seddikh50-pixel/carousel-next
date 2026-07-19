'use client'
import Image from "next/image";
import { images } from './utils/images'
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';



type Image = {
  src: string;
  scale: number;
  y: number
  x: number
};


export default function Home() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [imagesState, setImagesState] = useState<Image[]>(images);
  const animatingRef = useRef(false);
  const onMouseDown = useRef(false);



  const move = (numberOfmovement: number) => {
    if (animatingRef.current) return
    animatingRef.current = true
    let finished = 0;


    const wrapper = wrapperRef.current
    if (!wrapper) return
    const array = Array.from(wrapper.children)

    array.forEach((ele, index) => {
      const element = ele as HTMLElement;
      const target = array[
        (index + numberOfmovement + array.length) % array.length
      ] as HTMLElement;



      const style = getComputedStyle(target);

      const { transform, zIndex, opacity } = style;

      const matrix = new DOMMatrix(transform);

      gsap.to(element, {
        scale: matrix.a,
        scaleY: matrix.d, // استخدم d وليس b للـ scaleY
        x: matrix.m41,
        y: matrix.m42,
        zIndex,
        opacity,
        duration: 0.5,
        ease: "back",
        onComplete: () => {
          finished++;
          if (finished === array.length) {
            animatingRef.current = false;
          }
        },
      });
    });
  };








  return (
    <div className="w-full h-screen bg-amber-50  relative  flex justify-center items-center overflow-hidden">
      <button disabled={animatingRef.current} onClick={() => move(1)} className="absolute bottom-40 right-5 z-10 bg-yellow-50 px-2 font-bold text-gray-700 rounded-md ">next</button>
      <button disabled={animatingRef.current} onClick={() => move(-1)} className="absolute bottom-40 left-5 z-10 bg-yellow-50 px-2 font-bold text-gray-700 rounded-md ">prev</button>
      <button disabled={animatingRef.current} onClick={() => move(1)} className="absolute bottom-40 right-20 z-10 bg-yellow-50 px-2 font-bold text-gray-700 rounded-md ">two</button>

      <div ref={wrapperRef}
        style={{
          perspective: "1000px",
          transform: `translateX(${-210}px) `
        }}
        className="w-[99%]  bottom-5  bg-black   pt-10  h-150    absolute justify-between transition-all duration-500 ease-in-out">

        {imagesState.map((img, index) => {
          return <div

            style={{
              transform:
                `
               translateX(${img.x}px)
               translateY(${img.y}px)
                 scale(${img.scale})  
                  `, zIndex: imagesState.length - index, opacity: index === 0 || index === imagesState.length - 1 ? 0 : 1
            }}

            className="absolute w-110 bottom-0 h-120   "
            key={img.src}>
            <Image alt="" src={img.src} fill className="object-cover" />
          </div>
        })}
      </div>
    </div>
  );
}
