"use client";
import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type { Group } from "three";
const GOLD = "#D4AF37";
const SEED = 7;

function pseudoRandom(i: number) {
  const x = Math.sin(i * 12.9898 + SEED) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * 3D abstract “nodes & threads” — quality graph / system mesh.
 * Gold + subtle lines; slow drift for a cinematic underlay.
 */
function NetworkMesh() {
  const groupRef = useRef<Group | null>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const { nodePositions, linePositions } = useMemo(() => {
    const n = 96;
    const pos: number[] = [];
    const r = 3.2;
    for (let i = 0; i < n; i++) {
      const a = pseudoRandom(i * 3) * Math.PI * 2;
      const b = (pseudoRandom(i * 3 + 1) - 0.5) * 1.8;
      const rad = 0.45 + pseudoRandom(i * 3 + 2) * r;
      const x = Math.cos(a) * Math.cos(b) * rad;
      const y = Math.sin(b) * rad * 0.85;
      const z = Math.sin(a) * Math.cos(b) * rad;
      pos.push(x, y, z);
    }
    const lines: number[] = [];
    const connectDist = 1.05;
    const cap = 420;
    for (let i = 0; i < n && lines.length < cap; i++) {
      for (let j = i + 1; j < n; j++) {
        const i3 = i * 3;
        const j3 = j * 3;
        const dx = pos[i3]! - pos[j3]!;
        const dy = pos[i3 + 1]! - pos[j3 + 1]!;
        const dz = pos[i3 + 2]! - pos[j3 + 2]!;
        if (Math.sqrt(dx * dx + dy * dy + dz * dz) < connectDist) {
          lines.push(
            pos[i3]!,
            pos[i3 + 1]!,
            pos[i3 + 2]!,
            pos[j3]!,
            pos[j3 + 1]!,
            pos[j3 + 2]!,
          );
        }
      }
    }
    return {
      nodePositions: new Float32Array(pos),
      linePositions: new Float32Array(lines),
    };
  }, []);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.getElapsedTime() * 0.08;
      groupRef.current.rotation.x = 0.18 + Math.sin(t * 0.3) * 0.04;
      groupRef.current.rotation.y = t * 0.12 + scrollY * 0.0008;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.1, 0]}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nodePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color={GOLD}
          size={0.05}
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>
      {linePositions.length > 0 && (
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[linePositions, 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color={GOLD}
            transparent
            opacity={0.09}
          />
        </lineSegments>
      )}
    </group>
  );
}

export function NetworkThreadsCanvas() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden
    >
      <Canvas
        camera={{ position: [0, 0, 7.2], fov: 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 1.75]}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.55} />
        <pointLight color="#22d3ee" position={[4, 3, 6]} intensity={6} />
        <pointLight color={GOLD} position={[-5, -2, 4]} intensity={3} />
        <NetworkMesh />
      </Canvas>
    </div>
  );
}
