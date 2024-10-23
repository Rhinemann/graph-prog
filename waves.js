class Waves {
    constructor({frequency, amplitude, curvature} = {}) {
        this.frequency = frequency || 1;
        this.amplitude = amplitude || 2;
        this.curvature = curvature || 2;
    }

    triangleWave(x) {
        const translationX = this.amplitude / 2;
        const translationY = Math.abs(this.amplitude / 2);
        return Math.abs(((x * this.frequency + translationX) % (2 * this.amplitude)) - this.amplitude) - translationY;
    }

    squareWave(x) {
        const translation = this.amplitude / 2;
        return (x * this.frequency) % 2 < 1 ? translation : -translation;
    }

    sineWave(x) {
        const translation = this.amplitude / 2;
        return translation * Math.sin(x * this.frequency);
    }

    sawtoothWave(x) {
        const translationX = this.amplitude / 2;
        const translationY = Math.abs(this.amplitude / 2);
        return Math.abs((x * this.frequency + translationX) % this.amplitude) - translationY;
    }

    concaveTriangularWave(x) {
        const translation = Math.abs(this.amplitude / 2);
        const normalisedAmplitude = Math.pow(this.amplitude, 1 / this.curvature);
        const straightWave = Math.abs((x * this.frequency) % (2 * normalisedAmplitude) - normalisedAmplitude)
        return Math.pow(straightWave, this.curvature) - translation;
    }

    convexTriangularWave(x) {
        const translation = Math.abs(this.amplitude / 2);
        const normalisedAmplitude = Math.pow(this.amplitude, this.curvature);
        const straightWave = Math.abs((x * this.frequency) % (2 * normalisedAmplitude) - normalisedAmplitude)
        return Math.pow(straightWave, 1 / this.curvature) - translation;
    }
}

export {Waves};