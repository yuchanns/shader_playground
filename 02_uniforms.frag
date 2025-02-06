#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
    // Basic time-based color animation
    // gl_FragColor = vec4(abs(sin(u_time)),0.0,0.0,1.0);

    // Slowing down the animation by reducing the time factor
    // gl_FragColor = vec4(abs(sin(0.001 * u_time)),0.0,0.0,1.0);

    // Gradual speed increase followed by a static color after 5 seconds
    // gl_FragColor = vec4(u_time > 5.0 ? 1.0 : abs(sin(mix(1.0, 20.0, smoothstep(0.0, 5.0, u_time)) * u_time)), 0.0, 0.0, 1.0);

    // Normalized fragment coordinates
    // vec2 st = gl_FragCoord.xy/u_resolution;
    // gl_FragColor = vec4(st.x,st.y,0.0,1.0);

    // Coordinate System Reference:
    // - (0.0, 0.0): Bottom-left corner of the canvas
    // - (1.0, 0.0): Bottom-right corner
    // - (0.0, 1.0): Top-left corner
    // - (0.5, 0.5): Center of the canvas
    // - (1.0, 1.0): Top-right corner

    // Mouse position-based color mapping
    // vec2 mouse = u_mouse/u_resolution;
    // gl_FragColor = vec4(mouse.x, mouse.y, 0.0, 1.0);

    vec2 st = gl_FragCoord.xy / u_resolution;
    vec2 mouse = u_mouse / u_resolution;

    // Generate an interactive ripple effect
    float pattern = length(st - mouse) * 10.0 + u_time;
    float wave = abs(sin(pattern));

    // Create a dynamic color palette based on:
    // - Mouse position (red and green channels)
    // - Time-varying wave effect (blue channel)
    vec3 color = vec3(
            wave * mouse.x, // Red: modulated by horizontal mouse position
            wave * mouse.y, // Green: modulated by vertical mouse position
            wave * sin(u_time) // Blue: animated over time
        );
    gl_FragColor = vec4(color, 1.0);
}
