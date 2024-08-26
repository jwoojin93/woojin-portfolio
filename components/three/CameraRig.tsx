import { useFrame } from "@react-three/fiber";
import { damp3, dampE } from "maath/easing";
import { useSearchParams } from "next/navigation";
import { PropsWithChildren, useRef } from "react";
import * as THREE from "three";

const CameraRig = ({ children }: PropsWithChildren) => {
  const cameraGroupRef = useRef<THREE.Group>(null);
  const searchParams = useSearchParams();

  const isCustomizer = searchParams.get("main") === "customizer";

  useFrame(({ camera, pointer }, delta) => {
    const isTablet =
      !isCustomizer && typeof window && window.innerWidth <= 1440;
    const isMobile = !isCustomizer && typeof window && window.innerWidth <= 600;

    // 삼항 연산자는 깨끗한 코드의 옵션이 아닙니다
    let targetPosition: [x: number, y: number, z: number] = [0, 0, 2.5];

    // if (isCustomizer) {
    //   targetPosition = [0, 0, 2];
    // }

    // if (isTablet) {
    //   targetPosition = [Math.min(0, window.innerWidth / -4800), 0, 2];
    // }

    // if (isMobile) {
    //   targetPosition = [0, 0.2, 2.5];
    // }
    // damp3(camera.position, targetPosition, 0.25, delta);
    damp3(camera.position, targetPosition, 0, delta);

    // dampE(
    //   cameraGroupRef.current!.rotation,
    //   [-pointer.y / 3, pointer.x / 3, 0],
    //   0.25,
    //   delta
    // );

    cameraGroupRef.current!.rotation.y += 0.02;
    // cameraGroupRef.current!.rotation.x += 0.05;
  });

  return <group ref={cameraGroupRef}>{children}</group>;
};

export default CameraRig;
