#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

// Plot a line on Y using a value between 0.0-1.0
float plot(vec2 st, float pct) {
    // Draw a line where x equals y (y=x)
    // Calculate the distance between current pixel and the y=x line
    // Returns 1.0 when distance is 0.0 (pixel is exactly on the line)
    // Returns 0.0 when distance > 0.01 (pixel is far from the line)
    // Returns interpolated value between 0-1 when distance is within [0, 0.01] range
    // The value 0.01 determines the line
    // return smoothstep(0.01, 0.0, abs(st.y - st.x));

    return smoothstep(pct - 0.02, pct, st.y) -
        smoothstep(pct, pct + 0.02, st.y);
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;

    // float y = pow(st.x, 5.0);
    // float y = exp(st.x);
    // float y = log(st.x);
    // float y = sqrt(st.x);
    // float y = step(0.5, st.x);
    // float y = smoothstep(0.1, 0.9, st.x);
    // float y = smoothstep(0.2, 0.5, st.x) - smoothstep(0.5, 0.8, st.x);
    // float y = sin(st.x + u_time);
    // float y = sin(st.x * PI);
    // float y = sin(st.x * u_time);
    // float y = sin(st.x) + 1.0;
    // float y = sin(st.x) * 2.0;
    // float y = abs(sin(st.x));
    // float y = fract(sin(st.x));
    float y = ceil(sin(st.x));

    vec3 color = vec3(y);

    // Plot a line
    float pct = plot(st, y);
    color = (1.0 - pct) * color + pct * vec3(0.0, 1.0, 0.0);

    gl_FragColor = vec4(color, 1.0);
}
