/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.3 -t -s yacht_light.glb
Author: Sergei (https://sketchfab.com/sergeif)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/yacht-0dd451f295d049cea20c17d3ffa87ee3
Title: Yacht
*/

import { globalState } from "@/store/globalState";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { dampC } from "maath/easing";
import { useState } from "react";
import * as THREE from "three";
import { GLTF } from "three-stdlib";
import { useSnapshot } from "valtio";
import { useSpring, animated, config } from "@react-spring/three";

type GLTFResult = GLTF & {
  nodes: {
    ["korpus1_01_-_Default_0"]: THREE.Mesh;
  };
  materials: {
    ["01_-_Default"]: THREE.MeshStandardMaterial;
  };
};

const yachtSrc = "/model/yacht_light.glb";
// const yachtSrc = "/model/smile_emoji.glb";

export function YachtModel(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF(yachtSrc) as GLTFResult;
  const { themeColor } = useSnapshot(globalState);

  console.log("nodes: ", nodes);
  console.log("materials: ", materials);

  useFrame((_state, delta) =>
    dampC(materials["01_-_Default"].color, themeColor, 0.25, delta)
  );

  const [isClicked, setClicked] = useState(false);

  const { rotation } = useSpring({
    rotation: !isClicked ? [1, -2, 1] : [0, -7.5, 0.2],
    config: config.wobbly,
  });

  const springs = useSpring({
    scale: isClicked ? 0.0003 : 0.00025,
    config: config.wobbly,
  });

  return (
    <group {...props} dispose={null}>
      <animated.mesh
        castShadow
        geometry={nodes["korpus1_01_-_Default_0"].geometry}
        material={materials["01_-_Default"]}
        position={[0, -0.1, 0]}
        // @ts-ignore
        rotation={rotation}
        scale={springs.scale}
        onClick={() => setClicked(!isClicked)}
        material-roughness={1}
        dispose={null}
      ></animated.mesh>
    </group>
  );
}

useGLTF.preload(yachtSrc);
