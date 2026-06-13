// GLSL Shaders for Neural Canvas elements

export const NODE_SHADER = {
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vPosition;

    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      vPosition = position;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vPosition;

    uniform vec3 uColor;
    uniform float uTime;
    uniform float uHover;
    uniform float uPulseFreq;

    void main() {
      // Normalizing vectors for lighting angle
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);

      // Volume glow based on viewing angle relative to normal (fresnel falloff)
      float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.5);

      // Pulsing effect based on frequency and time
      float pulse = 0.75 + 0.25 * sin(uTime * uPulseFreq);

      // Extra highlight factor when hovered
      float highlight = mix(1.0, 1.6, uHover);

      vec3 finalColor = uColor * pulse * highlight;
      float alpha = fresnel * (0.35 + 0.65 * uHover) * pulse;

      // Inner solid core glow
      float distToCenter = length(vPosition);
      float coreGlow = smoothstep(1.0, 0.0, distToCenter * 4.0);

      gl_FragColor = vec4(finalColor + vec3(coreGlow * 0.4), alpha + coreGlow * 0.9 * uHover);
    }
  `
};

export const LINE_SHADER = {
  vertexShader: `
    varying float vProgress;
    attribute float aProgress; // Progress coordinate along the curve line (0.0 to 1.0)

    void main() {
      vProgress = aProgress;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying float vProgress;

    uniform float uTime;
    uniform vec3 uColor;
    uniform float uIntensity;

    void main() {
      // Animate dashing pattern representing high velocity data packages
      // We use high frequency sine functions shifted by time in the negative progress direction
      float sigPattern = step(0.92, sin(vProgress * 100.0 - uTime * 12.0));

      // Dim baseline flow pathway connections
      vec3 baseColor = uColor * 0.18;
      // High luminous packets colors
      vec3 packColor = uColor * 2.2 * uIntensity;

      // Mix colors based on dash pattern
      vec3 finalColor = mix(baseColor, packColor, sigPattern);
      float finalAlpha = mix(0.12, 0.85 * uIntensity, sigPattern);

      gl_FragColor = vec4(finalColor, finalAlpha);
    }
  `
};
