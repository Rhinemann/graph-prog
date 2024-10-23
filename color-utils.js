function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : null;
}

function colorGenerator(pointNumber) {
    const colors = new Array(pointNumber * 4);
    const samples = [
        ...hexToRgb("#FBFB7F"), 255,
        ...hexToRgb("#54BE02"), 255,
        ...hexToRgb("#4ACBEA"), 255,
        ...hexToRgb("#EA5906"), 255,
        ...hexToRgb("#D8D5EA"), 255,
        ...hexToRgb("#40423F"), 255,
    ]

    colors[0] = 0;
    colors[1] = 0;
    colors[2] = 0;
    colors[3] = 0;

    for (let i = 1; i < pointNumber - 1; i++) {
        colors[4 * i] = samples[4 * i % samples.length]
        colors[4 * i + 1] = samples[4 * i % samples.length + 1]
        colors[4 * i + 2] = samples[4 * i % samples.length + 2]
        colors[4 * i + 3] = samples[4 * i % samples.length + 3]
    }

    colors[colors.length - 4] = colors[4]
    colors[colors.length - 3] = colors[5]
    colors[colors.length - 2] = colors[6]
    colors[colors.length - 1] = colors[7]

    return colors;
}

function colorFill(color, pointNumber) {
    return Array.from({ length: color.length * pointNumber }, (_, i) => color[i % color.length])
}

export {colorFill, colorGenerator, hexToRgb};


