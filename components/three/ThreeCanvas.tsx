"use client";

import { globalState } from "@/store/globalState";
import { Center, Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { useSnapshot } from "valtio";
import CameraRig from "./CameraRig";
import { YachtModel } from "./models/YachtModel";
import { SmileEmojiModel } from "./models/SmileEmojiModel";

const ThreeCanvas = () => {
  const { activeModel } = useSnapshot(globalState);

  const onClickCanvas = () => (globalState.activePicker = null);

  return (
    <>
      <Canvas
        shadows
        camera={{ fov: 25 }}
        gl={{ preserveDrawingBuffer: true }}
        onClick={onClickCanvas}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={3} />
          <pointLight position={[0, 0, 3]} intensity={14} />
          <CameraRig>
            <Center>
              <SmileEmojiModel />
              {/* <YachtModel /> */}
            </Center>
          </CameraRig>
        </Suspense>
      </Canvas>
      <Loader />
    </>
  );
};

export default ThreeCanvas;
