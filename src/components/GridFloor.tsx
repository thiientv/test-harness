import { Grid } from '@react-three/drei'

export default function GridFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
      <planeGeometry args={[100, 100]} />
      <meshBasicMaterial color="#03030b" />
      <Grid
        position={[0, 0.01, 0]}
        args={[30, 30]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor="#00f0ff"
        sectionSize={2.5}
        sectionThickness={1}
        sectionColor="#bd00ff"
        fadeDistance={15}
        infiniteGrid
      />
    </mesh>
  )
}
