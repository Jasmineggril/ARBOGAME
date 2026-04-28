import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Float } from "@react-three/drei";
import { Component, ErrorInfo, ReactNode, useEffect, useState } from "react";
import * as THREE from "three";

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl2") || canvas.getContext("webgl"))
    );
  } catch {
    return false;
  }
}

function Mosquito() {
  return (
    <Float speed={3.5} rotationIntensity={0.4} floatIntensity={1.2}>
      <group position={[1.2, 1.6, 0.5]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.08, 0.32, 8, 16]} />
          <meshStandardMaterial color="#0B0A12" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.18, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.18, 8]} />
          <meshStandardMaterial color="#0B0A12" roughness={0.6} />
        </mesh>
        {/* Wings */}
        <mesh position={[0.18, 0.08, 0]} rotation={[0, 0, Math.PI / 5]}>
          <planeGeometry args={[0.45, 0.14]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.45} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[-0.18, 0.08, 0]} rotation={[0, 0, -Math.PI / 5]}>
          <planeGeometry args={[0.45, 0.14]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.45} side={THREE.DoubleSide} />
        </mesh>
        {/* Long proboscis */}
        <mesh position={[0, -0.22, 0]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.18, 6]} />
          <meshStandardMaterial color="#0B0A12" />
        </mesh>
      </group>
    </Float>
  );
}

function House() {
  return (
    <group position={[-1.4, 0, -0.8]}>
      {/* Body */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 1, 1.4]} />
        <meshStandardMaterial color="#F1ECE4" roughness={0.85} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 1.25, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[1.25, 0.7, 4]} />
        <meshStandardMaterial color="#5B21B6" roughness={0.6} />
      </mesh>
      {/* Door */}
      <mesh position={[0, 0.3, 0.71]}>
        <planeGeometry args={[0.35, 0.6]} />
        <meshStandardMaterial color="#3B1872" />
      </mesh>
      {/* Window */}
      <mesh position={[0.5, 0.6, 0.71]}>
        <planeGeometry args={[0.3, 0.3]} />
        <meshStandardMaterial color="#9F7AEA" emissive="#9F7AEA" emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
}

function Puddle() {
  return (
    <group position={[0.9, 0.02, 1.1]}>
      <mesh receiveShadow>
        <cylinderGeometry args={[0.85, 0.85, 0.04, 32]} />
        <meshStandardMaterial color="#5EEAD4" transparent opacity={0.55} roughness={0.05} metalness={0.4} />
      </mesh>
      {/* Highlight */}
      <mesh position={[-0.2, 0.025, -0.1]}>
        <cylinderGeometry args={[0.25, 0.25, 0.01, 32]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

function Ground() {
  return (
    <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[14, 14]} />
      <meshStandardMaterial color="#E8E4DC" roughness={1} />
    </mesh>
  );
}

function Vegetation() {
  return (
    <group>
      {/* Bush 1 */}
      <mesh position={[1.8, 0.3, -1.4]} castShadow>
        <sphereGeometry args={[0.4, 12, 12]} />
        <meshStandardMaterial color="#2F855A" roughness={0.8} />
      </mesh>
      {/* Bush 2 */}
      <mesh position={[2.1, 0.25, -1.0]} castShadow>
        <sphereGeometry args={[0.3, 12, 12]} />
        <meshStandardMaterial color="#276749" roughness={0.8} />
      </mesh>
      {/* Tree trunk */}
      <mesh position={[-2.5, 0.4, 1.0]} castShadow>
        <cylinderGeometry args={[0.1, 0.12, 0.8, 12]} />
        <meshStandardMaterial color="#5C3A21" roughness={0.9} />
      </mesh>
      <mesh position={[-2.5, 1.0, 1.0]} castShadow>
        <sphereGeometry args={[0.55, 12, 12]} />
        <meshStandardMaterial color="#2F855A" roughness={0.8} />
      </mesh>
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 6, 4]} intensity={1.1} castShadow shadow-mapSize={[1024, 1024]} />
      <Ground />
      <House />
      <Puddle />
      <Vegetation />
      <Mosquito />
      <Environment preset="sunset" />
      <OrbitControls
        autoRotate
        autoRotateSpeed={0.6}
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.2}
      />
      <fog attach="fog" args={["#F4EFE8", 6, 16]} />
    </>
  );
}

class WebGLBoundary extends Component<{ children: ReactNode }, { error: boolean }> {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn("HeroScene WebGL error:", error.message, info.componentStack?.split("\n")[1]);
  }
  render() {
    if (this.state.error) return <FallbackArt />;
    return this.props.children;
  }
}

function FallbackArt() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/10">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-2xl">
            <svg viewBox="0 0 24 24" fill="none" className="h-12 w-12" stroke="currentColor" strokeWidth={1.5}>
              <path d="M3 21h18M5 21V8l7-5 7 5v13M9 21V12h6v9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="text-sm font-medium text-foreground/70">Cenário 3D — proteja sua casa</p>
        </div>
      </div>
    </div>
  );
}

export function HeroScene() {
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null);
  useEffect(() => {
    setHasWebGL(detectWebGL());
  }, []);

  return (
    <div className="h-[400px] w-full overflow-hidden rounded-3xl bg-gradient-to-br from-[#F4EFE8] via-[#EFE9DF] to-[#E8E0D2] ring-1 ring-border/60 lg:h-[520px]">
      {hasWebGL === false ? (
        <FallbackArt />
      ) : hasWebGL ? (
        <WebGLBoundary>
          <Canvas shadows camera={{ position: [4.5, 3.5, 5.5], fov: 42 }} dpr={[1, 1.5]}>
            <Scene />
          </Canvas>
        </WebGLBoundary>
      ) : null}
    </div>
  );
}

export default HeroScene;
