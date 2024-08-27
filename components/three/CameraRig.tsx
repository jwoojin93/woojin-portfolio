import { useFrame } from "@react-three/fiber";
import { damp3 } from "maath/easing";
import { PropsWithChildren, useRef } from "react";
import * as THREE from "three";

const CameraRig = ({ children }: PropsWithChildren) => {
  const cameraGroupRef = useRef<THREE.Group>(null);
  useFrame(({ camera, pointer }, delta) => {
    let targetPosition: [x: number, y: number, z: number] = [0, 0, 2.5]; // 삼항 연산자는 깨끗한 코드의 옵션이 아닙니다
    damp3(camera.position, targetPosition, 0, delta);
    cameraGroupRef.current!.rotation.y += 0.02;
  });

  return <group ref={cameraGroupRef}>{children}</group>;
};

export default CameraRig;
