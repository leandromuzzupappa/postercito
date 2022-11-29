export default /* glsl */ `
    varying vec2 vUv;
    uniform float uTime;

    void main( void ) {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }
`;
