"use client";
import { useRef, useEffect, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { ALL_MARKETS, type Mode, type MarketEntry } from "@/lib/market-data";

/* ─── Helpers ──────────────────────────────────────────────────────────── */
const TEXTURE_LONGITUDE_OFFSET = 90;
const SHOW_DEBUG_TEST_MARKERS = false;
const DEBUG_TEST_MARKERS: readonly Pick<MarketEntry, "id" | "label" | "lat" | "lng" | "mode" | "color" | "region" | "brands">[] = [
  {
    id: "debug-india",
    label: "India",
    lat: 20.5937,
    lng: 78.9629,
    mode: "production",
    color: "#ff3b1f",
    region: "Debug",
    brands: [],
  },
  {
    id: "debug-china",
    label: "China",
    lat: 35.8617,
    lng: 104.1954,
    mode: "production",
    color: "#ff3b1f",
    region: "Debug",
    brands: [],
  },
  {
    id: "debug-uae",
    label: "UAE / Dubai",
    lat: 25.2048,
    lng: 55.2708,
    mode: "production",
    color: "#ff3b1f",
    region: "Debug",
    brands: [],
  },
  {
    id: "debug-uk",
    label: "United Kingdom",
    lat: 55.3781,
    lng: -3.436,
    mode: "production",
    color: "#ff3b1f",
    region: "Debug",
    brands: [],
  },
  {
    id: "debug-usa",
    label: "United States",
    lat: 37.0902,
    lng: -95.7129,
    mode: "production",
    color: "#ff3b1f",
    region: "Debug",
    brands: [],
  },
];

function latLngToVec3(lat: number, lng: number, r: number): THREE.Vector3 {
  const latRad = THREE.MathUtils.degToRad(lat);
  const lngRad = THREE.MathUtils.degToRad(lng + TEXTURE_LONGITUDE_OFFSET);
  return new THREE.Vector3(
    r * Math.cos(latRad) * Math.sin(lngRad),
    r * Math.sin(latRad),
    r * Math.cos(latRad) * Math.cos(lngRad),
  );
}

function calcTargetYawFromVector(
  markerPos: THREE.Vector3,
  currentRotY: number,
  cameraPos: THREE.Vector3,
): number {
  const markerYaw = Math.atan2(markerPos.x, markerPos.z);
  const cameraYaw = Math.atan2(cameraPos.x, cameraPos.z);
  const desired = cameraYaw - markerYaw;
  const diff = ((desired - currentRotY) % (Math.PI * 2) + Math.PI * 3) % (Math.PI * 2) - Math.PI;
  return currentRotY + diff;
}

function seededRandom(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function hashStringToUnit(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return ((hash >>> 0) % 10000) / 10000;
}

/* ─── Camera FOV zoom on marker focus ─────────────────────────────────── */
function CameraController({ focused }: { focused: boolean }) {
  const { camera } = useThree();
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      cameraRef.current = camera;
    }
  }, [camera]);

  useFrame(() => {
    const cam = cameraRef.current;
    if (!cam) return;
    const tgt = focused ? 30 : 40;
    cam.fov += (tgt - cam.fov) * 0.05;
    cam.updateProjectionMatrix();
  });
  return null;
}

function CameraFollowKeyLight() {
  const lightRef = useRef<THREE.DirectionalLight>(null);
  const targetRef = useRef<THREE.Object3D>(null);
  const { camera, scene } = useThree();

  useEffect(() => {
    const targetObj = targetRef.current;
    if (!targetObj) return;
    scene.add(targetObj);
    return () => {
      scene.remove(targetObj);
    };
  }, [scene]);

  useFrame(() => {
    if (!lightRef.current || !targetRef.current) return;
    const dir = camera.position.clone().normalize();
    lightRef.current.position.copy(dir.multiplyScalar(8));
    targetRef.current.position.set(0, 0, 0);
    lightRef.current.target = targetRef.current;
    lightRef.current.target.updateMatrixWorld();
  });

  return (
    <directionalLight
      ref={lightRef}
      intensity={1.28}
      color="#fff1d2"
    />
  );
}

/* ─── Star field ───────────────────────────────────────────────────────── */
function StarField() {
  const ref = useRef<THREE.Points>(null);

  const geo = useMemo(() => {
    const count = 2200;
    const pos = new Float32Array(count * 3);
    const rand = seededRandom(246813579);
    for (let i = 0; i < count; i++) {
      const r = 50 + rand() * 100;
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);

  useFrame((_, d) => { if (ref.current) ref.current.rotation.y += d * 0.002; });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.35} color="#c8d8f0" transparent opacity={0.55} sizeAttenuation />
    </points>
  );
}

/* ─── Real Earth globe — texture-mapped sphere ─────────────────────────── */
function GlobeCore() {
  const matRef = useRef<THREE.MeshPhongMaterial>(null);

  useEffect(() => {
    const mat = matRef.current;
    if (!mat) return;

    const loader = new THREE.TextureLoader();
    const disposables: THREE.Texture[] = [];

    /* Day map — primary visual layer */
    loader.load(
      "/textures/earth/earth_daymap.jpg",
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        disposables.push(tex);
        if (!matRef.current) return;
        matRef.current.map = tex;
        matRef.current.color.set(0xffffff);   // show texture at full fidelity
        matRef.current.emissiveIntensity = 0;
        matRef.current.needsUpdate = true;
      },
      undefined,
      /* CDN fallback if local file not found */
      () => {
        loader.load(
          "https://cdn.jsdelivr.net/gh/mrdoob/three.js@r168/examples/textures/land_ocean_ice_cloud_2048.jpg",
          (tex) => {
            tex.colorSpace = THREE.SRGBColorSpace;
            disposables.push(tex);
            if (!matRef.current) return;
            matRef.current.map = tex;
            matRef.current.color.set(0xffffff);
            matRef.current.emissiveIntensity = 0;
            matRef.current.needsUpdate = true;
          },
        );
      },
    );

    /* Bump map — adds terrain depth (mountains, valleys) */
    loader.load("/textures/earth/earth_bump.jpg", (tex) => {
      disposables.push(tex);
      if (!matRef.current) return;
      matRef.current.bumpMap = tex;
      matRef.current.bumpScale = 0.06;
      matRef.current.needsUpdate = true;
    });

    /* Specular/water mask — ocean reflects light, land stays matte */
    loader.load("/textures/earth/earth_specular.jpg", (tex) => {
      disposables.push(tex);
      if (!matRef.current) return;
      matRef.current.specularMap = tex;
      matRef.current.needsUpdate = true;
    });

    return () => { disposables.forEach((t) => t.dispose()); };
  }, []);

  return (
    <mesh>
      <sphereGeometry args={[2.2, 80, 80]} />
      {/* Placeholder shown while textures load; replaced once map is set */}
      <meshPhongMaterial
        ref={matRef}
        color="#1a2535"
        emissive={new THREE.Color(0x060e1c)}
        emissiveIntensity={0.6}
        shininess={25}
        specular={new THREE.Color(0x223355)}
      />
    </mesh>
  );
}

/* ─── Subtle gold lat/lng navigation grid ──────────────────────────────── */
function GlobeGrid() {
  const R = 2.212;
  const primitives = useMemo(() => {
    const out: { obj: THREE.Object3D; key: string }[] = [];

    [-60, -30, 0, 30, 60].forEach((lat) => {
      const y = R * Math.sin((lat * Math.PI) / 180);
      const r = R * Math.cos((lat * Math.PI) / 180);
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 96; i++) {
        const a = (i / 96) * Math.PI * 2;
        pts.push(new THREE.Vector3(r * Math.cos(a), y, r * Math.sin(a)));
      }
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({
        color: "#D4AF37",
        transparent: true,
        opacity: lat === 0 ? 0.12 : 0.045,
      });
      out.push({ obj: new THREE.Line(geo, mat), key: `lat${lat}` });
    });

    for (let lng = 0; lng < 360; lng += 30) {
      const theta = (lng * Math.PI) / 180;
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 64; i++) {
        const phi2 = (i / 64) * Math.PI;
        pts.push(new THREE.Vector3(
          R * Math.sin(phi2) * Math.cos(theta),
          R * Math.cos(phi2),
          R * Math.sin(phi2) * Math.sin(theta),
        ));
      }
      const geo2 = new THREE.BufferGeometry().setFromPoints(pts);
      const mat2 = new THREE.LineBasicMaterial({
        color: "#D4AF37",
        transparent: true,
        opacity: 0.028,
      });
      out.push({ obj: new THREE.Line(geo2, mat2), key: `lng${lng}` });
    }

    return out;
  }, []);

  return (
    <>
      {primitives.map(({ obj, key }) => (
        <primitive key={key} object={obj} />
      ))}
    </>
  );
}

/* ─── Sharp pinpoint marker with radar-ping blink ───────────────────────── */
function Marker({
  market,
  color,
  isSelected,
  onClick,
}: {
  market: MarketEntry;
  color: string;
  isSelected: boolean;
  onClick: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const pulse1Ref = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { camera } = useThree();

  const BASE_R = 2.255;
  const basePos = useMemo(() => latLngToVec3(market.lat, market.lng, BASE_R), [market.lat, market.lng]);
  const col = useMemo(() => new THREE.Color(color), [color]);

  const opacity = useRef(0);
  const targetOp = useRef(1);
  const ph1 = useRef(0);
  const tmpPos = useMemo(() => new THREE.Vector3(), []);
  const tmpToCamera = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    ph1.current = hashStringToUnit(market.id);
  }, [market.id]);

  useFrame((_, dt) => {
    if (!groupRef.current) return;

    groupRef.current.getWorldPosition(tmpPos);
    tmpToCamera.copy(camera.position).sub(tmpPos).normalize();
    const normalWorld = tmpPos.clone().normalize();
    const facing = normalWorld.dot(tmpToCamera); // > 0 means marker on front hemisphere
    const frontFactor = THREE.MathUtils.clamp((facing + 0.1) / 1.1, 0, 1);
    groupRef.current.visible = facing > -0.18;

    opacity.current += ((targetOp.current * frontFactor) - opacity.current) * 0.08;
    groupRef.current.position.copy(basePos);
    const targetScale = isSelected ? 1.26 : isHovered ? 1.12 : 1;
    groupRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.2,
    );

    if (coreRef.current) {
      (coreRef.current.material as THREE.MeshBasicMaterial).opacity = opacity.current * (isSelected ? 1 : 0.9);
    }

    if (haloRef.current) {
      const mat = haloRef.current.material as THREE.MeshBasicMaterial;
      const pulse = 0.5 + Math.sin(performance.now() * 0.006) * 0.5;
      mat.opacity = opacity.current * (isSelected ? 0.62 : 0.35) * (0.7 + pulse * 0.5);
      haloRef.current.scale.setScalar(isSelected ? 2.4 + pulse * 0.9 : 1.8 + pulse * 0.55);
    }

    if (pulse1Ref.current) {
      const spd = isSelected ? 0.75 : 0.55;
      ph1.current = (ph1.current + dt * spd) % 1;
      const maxScale = isSelected ? 6.4 : 4.8;
      pulse1Ref.current.scale.setScalar(1 + ph1.current * maxScale);
      (pulse1Ref.current.material as THREE.MeshBasicMaterial).opacity =
        opacity.current * (1 - ph1.current) * (isSelected ? 0.68 : 0.48);
    }
  });

  const cR = isSelected ? 0.034 : 0.027;

  return (
    <group
      ref={groupRef}
      onPointerOver={(e) => {
        e.stopPropagation();
        setIsHovered(true);
      }}
      onPointerOut={() => setIsHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <mesh ref={coreRef}>
        <sphereGeometry args={[cR, 14, 14]} />
        <meshBasicMaterial color={col} transparent opacity={0.92} depthWrite={false} />
      </mesh>

      <mesh ref={haloRef}>
        <sphereGeometry args={[cR * 2, 14, 14]} />
        <meshBasicMaterial color={col} transparent opacity={0.35} depthWrite={false} />
      </mesh>

      <mesh ref={pulse1Ref}>
        <ringGeometry args={[cR * 1.8, cR * 2.35, 24]} />
        <meshBasicMaterial
          color={col}
          transparent
          opacity={0.45}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {(isHovered || isSelected) && (
        <Html distanceFactor={10} center style={{ pointerEvents: "none" }}>
          <div
            className="rounded border px-2 py-1 text-[10px] uppercase tracking-[0.2em]"
            style={{
              background: "rgba(8,8,12,0.92)",
              borderColor: `${color}66`,
              color: "#f7f7f7",
              boxShadow: `0 0 24px ${color}55`,
              transform: "translateY(-24px)",
              whiteSpace: "nowrap",
            }}
          >
            {market.label}
          </div>
        </Html>
      )}
    </group>
  );
}

/* ─── Rotating globe group ─────────────────────────────────────────────── */
function GlobeGroup({
  mode, selectedId, isRotating, sectionVisible, focusTick, onMarkerClick,
}: {
  mode: Mode;
  selectedId: string | null;
  isRotating: boolean;
  sectionVisible: boolean;
  focusTick: number;
  onMarkerClick: (id: string) => void;
}) {
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const rotY = useRef(0.4);
  const rotX = useRef(0.18);
  const baseTiltX = useRef(0.18);
  const targetRotY = useRef<number | null>(null);
  const targetRotX = useRef<number | null>(null);
  const targetQuat = useRef(new THREE.Quaternion());
  const isLocked = useRef(false);
  const selectedIdRef = useRef(selectedId);
  const rotatingRef = useRef(isRotating);

  useEffect(() => { selectedIdRef.current = selectedId; }, [selectedId]);
  useEffect(() => { rotatingRef.current = isRotating; }, [isRotating]);

  useEffect(() => {
    if (selectedId) {
      const m = ALL_MARKETS.find((x) => x.id === selectedId);
      if (m) {
        const markerPos = latLngToVec3(m.lat, m.lng, 1);
        targetRotY.current = calcTargetYawFromVector(markerPos, rotY.current, camera.position);
        targetRotX.current = baseTiltX.current;
        targetQuat.current.setFromEuler(
          new THREE.Euler(targetRotX.current, targetRotY.current, 0, "YXZ"),
        );
        isLocked.current = true;
      }
    } else {
      isLocked.current = false;
      targetRotY.current = null;
      targetRotX.current = null;
    }
  }, [selectedId, focusTick, camera.position.x, camera.position.z, camera.position]);

  useEffect(() => {
    const activeMarkets = ALL_MARKETS.filter((m) => m.mode === mode);
    if (!activeMarkets.length || selectedIdRef.current || !sectionVisible) return;

    const mean = activeMarkets.reduce(
      (acc, m) => {
        acc.lat += m.lat;
        acc.lng += m.lng;
        return acc;
      },
      { lat: 0, lng: 0 },
    );

    const targetLat = mean.lat / activeMarkets.length;
    const targetLng = mean.lng / activeMarkets.length;
    const markerPos = latLngToVec3(targetLat, targetLng, 1);
    targetRotY.current = calcTargetYawFromVector(markerPos, rotY.current, camera.position);
    targetRotX.current = baseTiltX.current;
    targetQuat.current.setFromEuler(
      new THREE.Euler(targetRotX.current, targetRotY.current, 0, "YXZ"),
    );
    isLocked.current = true;
  }, [mode, sectionVisible, camera.position.x, camera.position.z, camera.position]);

  useFrame((state, dt) => {
    if (!groupRef.current) return;
    if (isLocked.current) {
      groupRef.current.quaternion.slerp(targetQuat.current, 0.18);
      const euler = new THREE.Euler().setFromQuaternion(groupRef.current.quaternion, "YXZ");
      rotY.current = euler.y;
      rotX.current = euler.x;
      if (groupRef.current.quaternion.angleTo(targetQuat.current) < 0.0025) {
        isLocked.current = false;
        groupRef.current.quaternion.copy(targetQuat.current);
      }
    } else if (rotatingRef.current) {
      const t = state.clock.elapsedTime;
      rotY.current += dt * 0.1;
      rotX.current += (baseTiltX.current + Math.sin(t * 0.75) * 0.16 - rotX.current) * 0.045;
      const rotZ = Math.sin(t * 0.42) * 0.045;
      groupRef.current.quaternion.setFromEuler(
        new THREE.Euler(rotX.current, rotY.current, rotZ, "YXZ"),
      );
    }
  });

  const activeMarkets = useMemo(() => {
    if (SHOW_DEBUG_TEST_MARKERS) {
      return DEBUG_TEST_MARKERS as MarketEntry[];
    }
    return ALL_MARKETS.filter((m) => m.mode === mode);
  }, [mode]);
  const markerColor = mode === "production" ? "#ff3b1f" : "#ff5a1f";

  return (
    <group ref={groupRef}>
      <GlobeCore />
      <GlobeGrid />
      {activeMarkets.map((m: MarketEntry) => (
        <Marker
          key={m.id}
          market={m}
          color={selectedId === m.id ? m.color : markerColor}
          isSelected={m.id === selectedId}
          onClick={() => onMarkerClick(m.id)}
        />
      ))}
    </group>
  );
}

/* ─── Atmospheric rim glow (BackSide sphere, fixed in world space) ──────── */
function Atmosphere() {
  return (
    <>
      {/* Inner blue atmosphere — creates rim glow at Earth's edge */}
      <mesh>
        <sphereGeometry args={[2.34, 64, 64]} />
        <meshPhongMaterial
          color={new THREE.Color("#3a6fff")}
          transparent
          opacity={0.10}
          side={THREE.BackSide}
        />
      </mesh>
      {/* Outer diffuse haze */}
      <mesh>
        <sphereGeometry args={[2.52, 64, 64]} />
        <meshPhongMaterial
          color={new THREE.Color("#1a44cc")}
          transparent
          opacity={0.035}
          side={THREE.BackSide}
        />
      </mesh>
    </>
  );
}

/* ─── Exported component ───────────────────────────────────────────────── */
export interface Globe3DProps {
  mode: Mode;
  selectedId: string | null;
  isRotating: boolean;
  sectionVisible: boolean;
  focusTick: number;
  onMarkerClick: (id: string) => void;
  onBackgroundClick: () => void;
}

export function Globe3D({
  mode,
  selectedId,
  isRotating,
  sectionVisible,
  focusTick,
  onMarkerClick,
  onBackgroundClick,
}: Globe3DProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 8.0], fov: 40 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%" }}
      onPointerMissed={onBackgroundClick}
    >
      <CameraController focused={!!selectedId} />

      {/*
        Lighting design:
        - Very low ambient → night side of Earth is nearly black (realistic)
        - Warm directional "sun" from upper-right → dramatic day/night terminator
        - Front soft fill → prevent the facing side from being completely dark
        - Cool blue back-fill → subtle night-side lift
      */}
      <ambientLight intensity={0.42} color="#f0f4ff" />
      <hemisphereLight
        intensity={0.48}
        color="#e8f0ff"
        groundColor="#10141f"
      />
      <CameraFollowKeyLight />
      <pointLight position={[-4, -2, -4]} intensity={0.14} color="#4a67c9" />
      <pointLight position={[0, 0, -6]} intensity={0.08} color="#3e5ba8" />

      <StarField />
      <Atmosphere />

      <GlobeGroup
        mode={mode}
        selectedId={selectedId}
        isRotating={isRotating}
        sectionVisible={sectionVisible}
        focusTick={focusTick}
        onMarkerClick={onMarkerClick}
      />

      <OrbitControls
        enabled={isRotating}
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.38}
        makeDefault
      />
    </Canvas>
  );
}
