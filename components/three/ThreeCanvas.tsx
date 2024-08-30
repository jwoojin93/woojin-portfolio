"use client";

import { Center, Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { SmileEmojiModel } from "./models/SmileEmojiModel";
import { MacbookLaptopModel } from "./models/MacbookLaptopModel";
import { AirplaneModel } from "./models/Airplane";

const ThreeCanvas = ({ name }: { name: String }) => {
  return (
    <>
      <Canvas shadows camera={{ fov: 25 }} gl={{ preserveDrawingBuffer: true }}>
        <Suspense fallback={null}>
          <ambientLight intensity={name === "airplane" ? 2 : 3} />
          <pointLight
            position={[0, 0, 3]}
            intensity={name === "airplane" ? 10 : 14}
          />
          <Center>
            {name === "smile-emoji" && <SmileEmojiModel />}
            {name === "macbook-laptop" && <MacbookLaptopModel />}
            {name === "airplane" && <AirplaneModel />}
          </Center>
        </Suspense>
      </Canvas>
      <Loader />
    </>
  );
};

export default ThreeCanvas;
