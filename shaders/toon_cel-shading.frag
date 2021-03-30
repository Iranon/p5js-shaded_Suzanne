precision mediump float;

varying vec3 vNormal;
varying vec2 vTexCoord;
varying vec4 vPosition;

uniform vec3 mousePos;
uniform sampler2D AO;   //baked ambient occlusion texture

//Random function
float rand(vec2 st) {

    return fract( sin ( dot( st.xy, vec2(7.236, 11.549))) * 8719.2598);
}

//Noise 2D function
float noise(vec2 st) {

    vec2 i = floor(st); //integer part
    vec2 f = fract(st); //fractional part

    float a = rand(i + vec2(0.0, 0.0));
    float b = rand(i + vec2(1.0, 0.0));
    float c = rand(i + vec2(0.0, 1.0));
    float d = rand(i + vec2(1.0, 1.0));

    vec2 fac = smoothstep(0.0, 1.0, f);

    return mix(a, b, fac.x) + 
            (c - a) * fac.y * (1.0 - fac.x) +
            (d - b) * fac.x * fac.y;
}

//fBM function
float fBM (in vec2 st) {

    float val = 0.0;
    float amplitude = 0.5;
    float frequency = 0.0;
    
    // Loop of octaves
    for (int i = 0; i < 6; i++) {
        val += amplitude * noise(st);
        st *= 2.0;
        amplitude *= 0.5;
    }
    return val;
}

struct Light {
    vec3 position;
    vec3 direction;
    vec3 color;
    float intensity;
} ;


void main() {

    //UVs
    vec2 uv = vTexCoord;
    uv.y = 1.0 - uv.y;  //flip UV correctly

    //Normals and coordinates
    vec3 normal = normalize(vNormal);
    vec3 viewDirection = normalize(-vPosition.xyz);
    float viewIncidence = dot(viewDirection, normal);

    //Reading from samplers
    vec3 ao = texture2D(AO, uv).rgb;

    //Light
    Light light = Light(mousePos, (mousePos - vPosition.xyz), vec3(1.0), 1.0);

    float diffuseIntensity = dot(normal, normalize(light.direction));


    //Rim
    float rimIntensity = max(0.0, 1.0 - viewIncidence);
    //rimIntensity = pow(rimIntensity, 3.0);
    rimIntensity = smoothstep(0.6, 0.9, rimIntensity);
    float rimStrength = 0.46;

    //Cel-shading transitions
    float toonDiffuseIntensity = dot(normal, normalize(light.position));
    float celFactor;
    if (toonDiffuseIntensity >= 0.8) { celFactor = 1.0; }
    else if (toonDiffuseIntensity >= 0.5) { celFactor = 0.5; }
    else if (toonDiffuseIntensity >= 0.3) { celFactor = 0.3; }
    else { celFactor = 0.0; }
    vec3 col_0 = vec3(0.1, 0.2, 0.6);
    vec3 col_1 = vec3(0.4, 0.5, 0.8);
    vec3 col_2 = vec3(0.8, 0.5, 0.3);
    vec3 color = mix(col_0, col_1, celFactor * fBM(uv*256.0));
    color = mix(color, col_2, celFactor);
    ao = mix( vec3(1.0), ao, (1.0-toonDiffuseIntensity) );
    color = mix( color, (color * ao), (1.0-toonDiffuseIntensity) ); //apply ambient occlusion
    
    /* I like it
    ao = mix(vec3(0.0), ao, toonDiffuseIntensity);
    color = color * ao;
    */

    vec3 rimColor = rimIntensity * rimStrength * color;
    gl_FragColor = vec4( clamp( color + rimColor, 0.0, 1.0 ),  1.0);
}