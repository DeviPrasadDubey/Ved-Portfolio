"use client";
import { useRef, useEffect, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { ALL_MARKETS, type Mode, type MarketEntry } from "@/lib/market-data";

/* ─── Helpers ──────────────────────────────────────────────────────────── */
const TEXTURE_LONGITUDE_OFFSET = 90;
const SHOW_DEBUG_TEST_MARKERS = false;
const GLOBE_RADIUS = 2.2;
const MARKER_RADIUS = 2.255;
const GRID_RADIUS = 2.212;
const CAMERA_DEFAULT_FOV = 40;
const CAMERA_FOCUSED_FOV = 28;
const CAMERA_FOV_LERP = 0.05;
const CAMERA_DEFAULT_DISTANCE = 8.0;
const CAMERA_FOCUSED_DISTANCE = 7.35;
const AUTO_ROTATE_SPEED = 0.1;
const AUTO_ROTATE_SPEED_VISIBLE = 0.055;
const FOCUS_SLERP_FACTOR = 0.18;
const MARKER_FRONT_VISIBILITY_THRESHOLD = -0.06;
const MARKER_OPACITY_LERP = 0.08;
const MARKER_SCALE_LERP = 0.2;
const MARKER_SELECTED_SCALE = 1.12;
const MARKER_HOVER_SCALE = 1.05;
const STAR_FIELD_POINT_COUNT = 2200;
const STAR_FIELD_MIN_RADIUS = 50;
const STAR_FIELD_RADIUS_RANGE = 100;
const STAR_FIELD_ROTATION_SPEED = 0.002;
const STARFIELD_SEED = 246813579;
const FOCUS_UNLOCK_ANGLE = 0.0025;
const BASE_GLOBE_TILT_X = 0.18;
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

/** Dominant highlighted side as a single front-facing direction vector. */
function getDenseClusterDirection(markets: MarketEntry[]): THREE.Vector3 | null {
  if (!markets.length) return null;
  const sum = new THREE.Vector3(0, 0, 0);
  for (const m of markets) {
    sum.add(latLngToVec3(m.lat, m.lng, 1).normalize());
  }
  if (sum.lengthSq() < 1e-8) return null;
  return sum.normalize();
}

function localNorthTangent(lat: number, lng: number): THREE.Vector3 {
  const delta = 0.2;
  const p = latLngToVec3(lat, lng, 1).normalize();
  const pNorth = latLngToVec3(Math.min(lat + delta, 89.9), lng, 1).normalize();
  return pNorth.sub(p).normalize();
}

/** Rotate unit vector `markerDir` (local) toward camera so the marker faces the viewer (front hemisphere). */
function quaternionFacingCamera(
  markerDir: THREE.Vector3,
  cameraPos: THREE.Vector3,
  tiltX: number,
): THREE.Quaternion {
  const from = markerDir.clone().normalize();
  const to = cameraPos.clone().normalize();
  if (from.dot(to) < -0.999) {
    from.x += 0.0001;
    from.normalize();
  }
  const qFace = new THREE.Quaternion().setFromUnitVectors(from, to);
  const qTilt = new THREE.Quaternion().setFromEuler(
    new THREE.Euler(tiltX, 0, 0, "YXZ"),
  );
  return qTilt.clone().multiply(qFace);
}

/** Focus orientation with north-up alignment at the selected marker point. */
function quaternionFacingCameraNorthUp(
  markerDir: THREE.Vector3,
  localNorth: THREE.Vector3,
  cameraPos: THREE.Vector3,
): THREE.Quaternion {
  const camDir = cameraPos.clone().normalize();

  // 1) Bring selected marker to the front (camera-facing direction).
  const qFace = new THREE.Quaternion().setFromUnitVectors(
    markerDir.clone().normalize(),
    camDir,
  );

  // 2) Roll around view axis so local north appears up on screen.
  const up = new THREE.Vector3(0, 1, 0);
  const n1 = localNorth.clone().applyQuaternion(qFace).normalize();
  const nProj = n1.clone().projectOnPlane(camDir).normalize();
  const upProj = up.clone().projectOnPlane(camDir).normalize();

  if (nProj.lengthSq() < 1e-8 || upProj.lengthSq() < 1e-8) {
    return qFace;
  }

  const dot = THREE.MathUtils.clamp(nProj.dot(upProj), -1, 1);
  const angle = Math.acos(dot);
  const cross = new THREE.Vector3().crossVectors(nProj, upProj);
  const signed = cross.dot(camDir) >= 0 ? angle : -angle;

  const qRoll = new THREE.Quaternion().setFromAxisAngle(camDir, signed);
  return qRoll.multiply(qFace);
}

function seededRandom(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
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
    const targetFov = focused ? CAMERA_FOCUSED_FOV : CAMERA_DEFAULT_FOV;
    const targetDistance = focused ? CAMERA_FOCUSED_DISTANCE : CAMERA_DEFAULT_DISTANCE;
    const currentDistance = cam.position.length();
    if (currentDistance > 0.0001) {
      const nextDistance = THREE.MathUtils.lerp(
        currentDistance,
        targetDistance,
        CAMERA_FOV_LERP,
      );
      cam.position.setLength(nextDistance);
    }
    cam.fov += (targetFov - cam.fov) * CAMERA_FOV_LERP;
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
      intensity={1.55}
      color="#fff4dc"
    />
  );
}

/* ─── Star field ───────────────────────────────────────────────────────── */
function StarField() {
  const ref = useRef<THREE.Points>(null);

  const geo = useMemo(() => {
    const pos = new Float32Array(STAR_FIELD_POINT_COUNT * 3);
    const rand = seededRandom(STARFIELD_SEED);
    for (let i = 0; i < STAR_FIELD_POINT_COUNT; i++) {
      const r = STAR_FIELD_MIN_RADIUS + rand() * STAR_FIELD_RADIUS_RANGE;
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

  useFrame((_, deltaTime) => {
    if (ref.current) ref.current.rotation.y += deltaTime * STAR_FIELD_ROTATION_SPEED;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.42} color="#d8e6ff" transparent opacity={0.68} sizeAttenuation />
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
        matRef.current.color.set(0xffffff);
        matRef.current.emissive = new THREE.Color(0x2a1810);
        matRef.current.emissiveIntensity = 0.09;
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
            matRef.current.emissive = new THREE.Color(0x2a1810);
            matRef.current.emissiveIntensity = 0.09;
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
      <sphereGeometry args={[GLOBE_RADIUS, 80, 80]} />
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
  const gridRadius = GRID_RADIUS;
  const primitives = useMemo(() => {
    const out: { obj: THREE.Object3D; key: string }[] = [];

    [-60, -30, 0, 30, 60].forEach((lat) => {
      const y = gridRadius * Math.sin((lat * Math.PI) / 180);
      const r = gridRadius * Math.cos((lat * Math.PI) / 180);
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 96; i++) {
        const a = (i / 96) * Math.PI * 2;
        pts.push(new THREE.Vector3(r * Math.cos(a), y, r * Math.sin(a)));
      }
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({
        color: "#D4AF37",
        transparent: true,
        opacity: lat === 0 ? 0.2 : 0.065,
      });
      out.push({ obj: new THREE.Line(geo, mat), key: `lat${lat}` });
    });

    for (let lng = 0; lng < 360; lng += 30) {
      const theta = (lng * Math.PI) / 180;
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 64; i++) {
        const phi2 = (i / 64) * Math.PI;
        pts.push(new THREE.Vector3(
          gridRadius * Math.sin(phi2) * Math.cos(theta),
          gridRadius * Math.cos(phi2),
          gridRadius * Math.sin(phi2) * Math.sin(theta),
        ));
      }
      const geo2 = new THREE.BufferGeometry().setFromPoints(pts);
      const mat2 = new THREE.LineBasicMaterial({
        color: "#D4AF37",
        transparent: true,
        opacity: 0.045,
      });
      out.push({ obj: new THREE.Line(geo2, mat2), key: `lng${lng}` });
    }

    return out;
  }, [gridRadius]);

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
  const haloRef = useRef<THREE.Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { camera } = useThree();

  const markerPosition = useMemo(
    () => latLngToVec3(market.lat, market.lng, MARKER_RADIUS),
    [market.lat, market.lng],
  );
  const col = useMemo(() => new THREE.Color(color), [color]);

  const opacity = useRef(0);
  const targetOp = useRef(1);
  const tmpPos = useMemo(() => new THREE.Vector3(), []);
  const tmpToCamera = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    if (!groupRef.current) return;

    groupRef.current.getWorldPosition(tmpPos);
    tmpToCamera.copy(camera.position).sub(tmpPos).normalize();
    const normalWorld = tmpPos.clone().normalize();
    const facing = normalWorld.dot(tmpToCamera); // > 0 means marker on front hemisphere
    const frontFactor = THREE.MathUtils.clamp((facing + 0.1) / 1.1, 0, 1);
    groupRef.current.visible = facing > MARKER_FRONT_VISIBILITY_THRESHOLD;

    opacity.current += ((targetOp.current * frontFactor) - opacity.current) * MARKER_OPACITY_LERP;
    groupRef.current.position.copy(markerPosition);
    const targetScale = isSelected ? MARKER_SELECTED_SCALE : isHovered ? MARKER_HOVER_SCALE : 1;
    groupRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      MARKER_SCALE_LERP,
    );

    if (coreRef.current) {
      (coreRef.current.material as THREE.MeshBasicMaterial).opacity = opacity.current * (isSelected ? 1 : 0.85);
    }

    if (haloRef.current) {
      const blink = 0.5 + Math.sin(performance.now() * 0.0065) * 0.5;
      const pulseScale = isSelected ? 1.3 + blink * 0.22 : 1.12 + blink * 0.16;
      haloRef.current.scale.setScalar(pulseScale);
      (haloRef.current.material as THREE.MeshBasicMaterial).opacity =
        opacity.current * (isSelected ? 0.55 : 0.36) * (0.55 + blink * 0.45);
    }
  });

  const markerDotRadius = isSelected ? 0.056 : 0.046;
  const clickRadius = markerDotRadius * 2.35;

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
      <mesh>
        <sphereGeometry args={[clickRadius, 10, 10]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <mesh ref={coreRef}>
        <sphereGeometry args={[markerDotRadius, 14, 14]} />
        <meshBasicMaterial color={col} transparent opacity={0.95} depthWrite={false} />
      </mesh>

      <mesh ref={haloRef}>
        <sphereGeometry args={[markerDotRadius * 1.9, 14, 14]} />
        <meshBasicMaterial
          color={col}
          transparent
          opacity={0.42}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
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
              boxShadow: `0 0 36px ${color}88, 0 0 12px ${color}66`,
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
  const rotX = useRef(BASE_GLOBE_TILT_X);
  const baseTiltX = useRef(BASE_GLOBE_TILT_X);
  const targetQuat = useRef(new THREE.Quaternion());
  const isLocked = useRef(false);
  const selectedIdRef = useRef(selectedId);

  useEffect(() => {
    selectedIdRef.current = selectedId;
  }, [selectedId]);

  useEffect(() => {
    if (selectedId) {
      const m = ALL_MARKETS.find((x) => x.id === selectedId);
      if (m) {
        const markerDir = latLngToVec3(m.lat, m.lng, 1).normalize();
        const north = localNorthTangent(m.lat, m.lng);
        targetQuat.current.copy(
          quaternionFacingCameraNorthUp(markerDir, north, camera.position),
        );
        isLocked.current = true;
      }
    } else {
      isLocked.current = false;
    }
  }, [selectedId, focusTick, camera.position.x, camera.position.y, camera.position.z, camera.position]);

  useEffect(() => {
    const activeMarkets = ALL_MARKETS.filter((m) => m.mode === mode);
    if (!activeMarkets.length || selectedIdRef.current || !sectionVisible) return;
    const clusterDir = getDenseClusterDirection(activeMarkets);
    if (!clusterDir) return;
    targetQuat.current.copy(
      quaternionFacingCamera(clusterDir, camera.position, baseTiltX.current),
    );
    isLocked.current = true;
  }, [mode, sectionVisible, camera.position.x, camera.position.y, camera.position.z, camera.position]);

  useFrame((state, dt) => {
    if (!groupRef.current) return;
    if (isLocked.current) {
      groupRef.current.quaternion.slerp(targetQuat.current, FOCUS_SLERP_FACTOR);
      const euler = new THREE.Euler().setFromQuaternion(groupRef.current.quaternion, "YXZ");
      rotY.current = euler.y;
      rotX.current = euler.x;
      if (groupRef.current.quaternion.angleTo(targetQuat.current) < FOCUS_UNLOCK_ANGLE) {
        isLocked.current = false;
        groupRef.current.quaternion.copy(targetQuat.current);
      }
    } else if (isRotating) {
      const t = state.clock.elapsedTime;
      const speed = sectionVisible ? AUTO_ROTATE_SPEED_VISIBLE : AUTO_ROTATE_SPEED;
      rotY.current += dt * speed;
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
  const markerColor = mode === "exposure" ? "#ff3b1f" : "#2d6bff";

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
      <mesh>
        <sphereGeometry args={[2.34, 64, 64]} />
        <meshPhongMaterial
          color={new THREE.Color("#4a7aff")}
          transparent
          opacity={0.16}
          side={THREE.BackSide}
          emissive={new THREE.Color("#1a3066")}
          emissiveIntensity={0.35}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[2.52, 64, 64]} />
        <meshPhongMaterial
          color={new THREE.Color("#2244cc")}
          transparent
          opacity={0.055}
          side={THREE.BackSide}
          emissive={new THREE.Color("#0a1538")}
          emissiveIntensity={0.25}
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
      camera={{ position: [0, 0, CAMERA_DEFAULT_DISTANCE], fov: CAMERA_DEFAULT_FOV }}
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
      <ambientLight intensity={0.52} color="#eef2ff" />
      <hemisphereLight
        intensity={0.58}
        color="#f2f6ff"
        groundColor="#0c1018"
      />
      <CameraFollowKeyLight />
      <directionalLight position={[-6, 4, 2]} intensity={0.35} color="#ffd9a8" />
      <pointLight position={[5.5, 1.5, 6.5]} intensity={0.26} color="#ffccaa" distance={28} decay={2} />
      <pointLight position={[-4, -2, -4]} intensity={0.2} color="#5a78d8" />
      <pointLight position={[0, 0, -6]} intensity={0.12} color="#4a62a8" />

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
