"use client";
import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { motion, useScroll, useTransform } from "framer-motion";
import * as THREE from "three";

function GlobePoints() {
  const pointsRef = useRef<THREE.Points>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const positions = useMemo(() => {
    const count = 900;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      arr[i * 3] = 2.8 * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = 2.8 * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = 2.8 * Math.cos(phi);
    }
    return arr;
  }, []);

  // Supply chain arc lines
  const linePositions = useMemo(() => {
    const routes = [
      // Bangladesh → USA
      [23.68, 90.36, 37.77, -122.42],
      // India → UK
      [20.59, 78.96, 51.5, -0.12],
      // Sri Lanka → Germany
      [7.87, 80.77, 52.52, 13.4],
      // India → Japan
      [20.59, 78.96, 35.68, 139.69],
    ];

    const pts: number[] = [];
    routes.forEach(([lat1, lon1, lat2, lon2]) => {
      const r = 2.85;
      const toRad = (d: number) => (d * Math.PI) / 180;
      const p1 = new THREE.Vector3(
        r * Math.cos(toRad(lat1)) * Math.cos(toRad(lon1)),
        r * Math.sin(toRad(lat1)),
        r * Math.cos(toRad(lat1)) * Math.sin(toRad(lon1)),
      );
      const p2 = new THREE.Vector3(
        r * Math.cos(toRad(lat2)) * Math.cos(toRad(lon2)),
        r * Math.sin(toRad(lat2)),
        r * Math.cos(toRad(lat2)) * Math.sin(toRad(lon2)),
      );
      const mid = p1.clone().lerp(p2, 0.5).multiplyScalar(1.35);
      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      const curvePts = curve.getPoints(24);
      curvePts.forEach((p) => pts.push(p.x, p.y, p.z));
    });
    return new Float32Array(pts);
  }, []);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y =
        clock.getElapsedTime() * 0.04 + scrollY * 0.00115;
    }
  });

  return (
    <group rotation={[0.3, 0, 0]}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.022}
          color="#c9a44c"
          transparent
          opacity={0.35}
          sizeAttenuation
        />
      </points>

      {/* Route arcs */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#c9a44c" transparent opacity={0.12} />
      </line>
    </group>
  );
}

export function CinematicGlobe() {
  const { scrollY } = useScroll();
  const rotateZ = useTransform(scrollY, [0, 1400], [0, 8]);
  const scale = useTransform(scrollY, [0, 1200], [1, 1.05]);
  const orbitX = useTransform(scrollY, [0, 1600], ["-8%", "16%"]);
  const orbitXSlow = useTransform(scrollY, [0, 1600], ["-4%", "8%"]);

  return (
    <motion.div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <motion.div style={{ rotateZ, scale }} className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 6.5], fov: 55 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          <ambientLight intensity={0.36} />
          <pointLight color="#22d3ee" position={[2, 2, 5]} intensity={1.2} />
          <GlobePoints />
        </Canvas>
      </motion.div>

      <motion.div
        style={{ x: orbitX }}
        className="absolute left-[-20%] top-[12%] flex gap-5 opacity-35"
      >
        <div className="h-16 w-28 rounded-xl border border-accent/25 bg-gradient-to-br from-accent/25 via-transparent to-black/60" />
        <div className="h-16 w-28 rounded-xl border border-cyan-200/20 bg-gradient-to-br from-cyan-200/20 via-transparent to-black/70" />
        <div className="h-16 w-28 rounded-xl border border-accent/25 bg-gradient-to-br from-accent/20 via-transparent to-black/70" />
      </motion.div>

      <motion.div
        style={{ x: orbitXSlow }}
        className="absolute left-[-16%] top-[70%] flex gap-5 opacity-30"
      >
        <div className="h-14 w-24 rounded-xl border border-accent/25 bg-gradient-to-br from-accent/25 via-transparent to-black/70" />
        <div className="h-14 w-24 rounded-xl border border-cyan-200/20 bg-gradient-to-br from-cyan-200/20 via-transparent to-black/70" />
        <div className="h-14 w-24 rounded-xl border border-accent/25 bg-gradient-to-br from-accent/20 via-transparent to-black/70" />
      </motion.div>
    </motion.div>
  );
}
