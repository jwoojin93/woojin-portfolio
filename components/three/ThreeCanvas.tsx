"use client";

import { globalState } from "@/store/globalState";
import { Center, Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { useSnapshot } from "valtio";
import CameraRig from "./CameraRig";
import { YachtModel } from "./models/YachtModel";

const ThreeCanvas = () => {
  const { activeModel } = useSnapshot(globalState);

  const onClickCanvas = () => (globalState.activePicker = null);

  return (
    <>
      <Canvas
        shadows
        camera={{
          fov: 25,
        }}
        gl={{
          preserveDrawingBuffer: true,
        }}
        onClick={onClickCanvas}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={0.75} />
          <CameraRig>
            <Center>{activeModel === "yacht" ? <YachtModel /> : null}</Center>
          </CameraRig>
        </Suspense>
      </Canvas>
      <Loader />
    </>
  );
};

export default ThreeCanvas;
