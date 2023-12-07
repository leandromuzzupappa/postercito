export default /* glsl */ `
    varying vec2 vUv;
    uniform sampler2D uTexture;
    uniform float uTime;
    uniform float uFrequency;
    uniform float uAmplitude;
    uniform vec3 uColor;

    float upDown(float v) {
        return sin(v) * .5 + .5;
      }

    void main() {
        vec2 pos = vUv;
        float t1 = uTime;
        float t2 = uTime * 0.37;

        float y = vUv.y;

        float off1 = sin((y + 0.5) * mix(20. + uAmplitude , 60. + uFrequency, upDown(t1))) * uAmplitude * 0.008;
        float off2 = tan((vUv.x + .5) * mix(10. + uFrequency, 3. * -uFrequency, upDown(t2 * uFrequency)) + 52.) * uAmplitude * 0.008;
        float off = off1 + off2;

        vec2 uv = vec2(
            vUv.x + off,
            1.1 - (y + off * uFrequency)
        );


        vec4 image = texture2D(uTexture, uv);

        if(
            vUv.x < upDown(off1) * .004 || vUv.x > uFrequency * 1. || 
            vUv.y < uFrequency * .1 || vUv.y > upDown(off2)
        ) { 
            discard;
        }


        image.a = off + 0.05;
        gl_FragColor = image;
    }
`;
