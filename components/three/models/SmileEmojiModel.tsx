/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.3 -t -s yacht_light.glb
Author: Sergei (https://sketchfab.com/sergeif)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/yacht-0dd451f295d049cea20c17d3ffa87ee3
Title: Yacht
*/
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useState } from "react";
import * as THREE from "three";
import { GLTF } from "three-stdlib";
import { useSpring, animated, config } from "@react-spring/three";

type GLTFResult = GLTF & {
  nodes: {
    ["Sphere001"]: THREE.Mesh;
    ["Sphere_1"]: THREE.Mesh;
    ["Sphere_2"]: THREE.Mesh;
    ["Sphere_3"]: THREE.Mesh;
  };
  materials: {
    [""]: THREE.MeshStandardMaterial;
    ["Material.001"]: THREE.MeshStandardMaterial;
    ["Material.002"]: THREE.MeshStandardMaterial;
  };
};

const yachtSrc = "/model/smile_emoji.glb";

export function SmileEmojiModel(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF(yachtSrc) as GLTFResult;

  const [isClicked, setClicked] = useState(false);

  const { rotation } = useSpring({
    rotation: !isClicked ? [0, 0, 0] : [0, -7.5, 0.2],
    config: config.wobbly,
  });

  const springs = useSpring({
    scale: isClicked ? 0.4 : 0.3,
    config: config.wobbly,
  });

  console.log("nodes: ", nodes);
  console.log("materials: ", materials);

  return (
    <group {...props} dispose={null} onClick={() => setClicked(!isClicked)}>
      {/* 머리통 */}
      <animated.mesh
        // @ts-ignore
        rotation={rotation}
        dispose={null}
        scale={springs.scale}
        material-roughness={1}
        castShadow
        geometry={nodes["Sphere_1"].geometry}
        material={materials["Material.001"]}
        position={[0, -0.1, 0]}
      ></animated.mesh>
      {/* 눈 */}
      <animated.mesh
        // @ts-ignore
        rotation={rotation}
        dispose={null}
        scale={springs.scale}
        material-roughness={1}
        castShadow
        geometry={nodes["Sphere_3"].geometry}
        material={materials["Material.002"]}
        position={[0, -0.1, 0]}
      ></animated.mesh>
      {/* 치아 */}
      <animated.mesh
        // @ts-ignore
        rotation={rotation}
        dispose={null}
        scale={springs.scale}
        castShadow
        geometry={nodes["Sphere001"].geometry}
        material={materials["Material.002"]}
        position={[0, -0.1, 0]}
      >
        <meshBasicMaterial color="white" />
      </animated.mesh>
      {/* 입안 */}
      <animated.mesh
        // @ts-ignore
        rotation={rotation}
        dispose={null}
        scale={springs.scale}
        material-roughness={1}
        castShadow
        geometry={nodes["Sphere_2"].geometry}
        material={materials["Material.002"]}
        position={[0, -0.1, 0]}
      ></animated.mesh>
    </group>
  );
}

useGLTF.preload(yachtSrc);
