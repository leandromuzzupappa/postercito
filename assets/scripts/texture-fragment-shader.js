export default /* glsl */ `

    varying vec2 vUv;
    uniform float time;

    void main() {
        vec3 color = vec3(1., 0., 0.);

        
        gl_FragColor = vec4(color, 1.);
    }


`;
