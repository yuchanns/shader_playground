#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

const float SPHERE_RADIUS = 0.3;
const vec3 SPHERE_CENTER = vec3(0.0, 0.0, 0.0);
const int MAX_STEPS = 100;
const float MAX_DIST = 20.0;
const float EPSILON = 0.001;

vec3 getLightDir() {
    vec2 mousePos = u_mouse / u_resolution;
    vec2 mouseToCenterVec = mousePos - vec2(0.5);
    float distToCenter = length(mouseToCenterVec);

    vec2 mouseDir = normalize(mouseToCenterVec);
    float zValue = smoothstep(-SPHERE_RADIUS, SPHERE_RADIUS, distToCenter - SPHERE_RADIUS);
    float adjustedZ = -1.0 + zValue * 2.0;

    vec3 lightDir = vec3(mouseDir * (1.0 + adjustedZ), adjustedZ);
    float intensity = 1.0 - smoothstep(0.0, SPHERE_RADIUS * 2.0, distToCenter);

    return normalize(lightDir) * max(intensity, 0.001);
}

float sphereSDF(vec3 p) {
    return length(p - SPHERE_CENTER) - SPHERE_RADIUS;
}

vec3 calcNormal(vec3 p) {
    const vec2 e = vec2(EPSILON, 0);
    return normalize(vec3(
            sphereSDF(p + e.xyy) - sphereSDF(p - e.xyy),
            sphereSDF(p + e.yxy) - sphereSDF(p - e.yxy),
            sphereSDF(p + e.yyx) - sphereSDF(p - e.yyx)
        ));
}

vec3 render(vec3 ro, vec3 rd) {
    float t = 0.0;
    for (int i = 0; i < MAX_STEPS; i++) {
        vec3 p = ro + rd * t;
        float d = sphereSDF(p);
        if (d < EPSILON) {
            vec3 normal = calcNormal(p);
            vec3 lightDir = getLightDir();

            // Main light source (mouse-controlled sunset light)
            float diff = max(dot(normal, lightDir), 0.0);

            // Ambient light (soft light filling the entire scene)
            float ambientStrength = 0.12; // Slightly reduced ambient light for more contrast
            vec3 ambient = vec3(0.7, 0.7, 0.8) * ambientStrength; // Cooler and darker ambient light

            // Base sphere color (slightly warm white)
            vec3 sphereColor = vec3(1.0, 0.98, 0.95);
            // Intense fiery sunset color (deep orange-red)
            vec3 sunsetColor = vec3(1.0, 0.3, 0.1);

            // Combine ambient and main light
            vec3 mainLight = sphereColor * sunsetColor * diff;

            // Calculate smooth bloom effect
            float bloomThreshold = 0.6; // Threshold to start bloom effect
            float bloomSoftness = 0.3; // Controls the smoothness of the bloom transition
            float bloomIntensity = 3.0; // Intensity of the bloom

            // Smooth transition for bloom using smoothstep
            float bloomAmount = smoothstep(bloomThreshold - bloomSoftness,
                    bloomThreshold + bloomSoftness,
                    diff) * bloomIntensity;

            // Add some variation based on light direction for more natural look
            float edgeGlow = pow(1.0 - abs(dot(normal, lightDir)), 2.0);
            bloomAmount = bloomAmount + edgeGlow * 0.5;

            vec3 bloomColor = sunsetColor * bloomAmount; // Bloom takes on the color of the light

            // Combine everything: base lighting + ambient + bloom
            vec3 finalColor = mainLight + (sphereColor * ambient) + bloomColor;

            return finalColor;
        }
        t += d;
        if (t > MAX_DIST) break;
    }
    return vec3(0.0);
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec3 ro = vec3(0.0, 0.0, -3.0);
    vec3 rd = normalize(vec3(uv * 2.0 - 1.0, 1.0));

    vec3 color = render(ro, rd);

    color = color / (color + vec3(1.0));
    color = pow(color, vec3(1.0 / 2.2));

    gl_FragColor = vec4(color, 1.0);
}
