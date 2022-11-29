export default /* glsl */ `
    varying vec2 vUv;
    uniform float uTime;
    uniform float uFrequency;
    uniform float uAmplitude;

    void main( void ) {
        vUv = uv;

        vec3 pos = position.xyz;

        pos += min(normal * sin(uTime * uFrequency) * uAmplitude, .5) * .02;
        

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
`;
