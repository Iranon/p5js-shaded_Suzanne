attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aTexCoord;

uniform mat4 uProjectionMatrix;
uniform mat4 uModelViewMatrix;
uniform mat4 uNormalMatrix;

varying vec3 vNormal;
varying vec2 vTexCoord;
varying vec4 vPosition;


void main() {

    vNormal = normalize((uModelViewMatrix * vec4(aNormal, 0.0)).xyz);
    vTexCoord = aTexCoord;

    vec4 posVec4 = vec4(aPosition, 1.0);
    posVec4.xy = posVec4.xy * 2.0 - 1.0;

    vPosition = uModelViewMatrix * posVec4;
    gl_Position = uProjectionMatrix * uModelViewMatrix * posVec4;
}