import * as PIXI from "pixi.js";
import { getHypotenuse } from "../utilities/math-utilities";

export default class WeightParticle extends PIXI.Graphics {
    constructor(
        stage,
        timeline,
        from,
        to,
        animationSpeed = 2,
        particleWidth = 4,
        particleColor = 0x3fffff
    ) {
        super();

        this.stage = stage;

        this.timeline = timeline;
        this.from = from;
        this.to = to;
        this.animationSpeed = animationSpeed;
        this.particleWidth = particleWidth;
        this.particleColor = particleColor;

        this.renderComponent();
        this.animate();
    }

    _getDist() {
        return {
            x: this.to.x - this.from.x,
            y: this.to.y - this.from.y
        };
    }

    animate() {
        let dist = this._getDist();
        const hypotenuse = Math.sqrt(Math.pow(dist.x, 2) + Math.pow(dist.y, 2));
        dist = {
            x: dist.x - (25 * dist.x) / hypotenuse,
            y: dist.y - (25 * dist.y) / hypotenuse
        };

        this.timeline
            .to(this, { duration: 2, pixi: { alpha: 0.75 } }, "fadingIn")
            .to(
                this,
                {
                    duration: 5,
                    pixi: { ...dist }
                },
                "beginForwardPass"
            )
            .to(
                this,
                {
                    duration: 1,
                    onComplete: () => this.destroy(),
                    pixi: { alpha: 0 }
                },
                "fadingOut"
            );
    }

    getDegree(x, y) {
        return Math.sinh(y / x) * (180 / Math.PI);
    }

    renderComponent() {
        this.clear();

        console.log(this.angle);
        this.alpha = 0;

        /**
         * TODO: kalo pake ini mau bkin panjang ada shadow nya jadi keliatan kek neon jalan
         */
        const dist = this._getDist();
        const hypotenuse = getHypotenuse(dist.x, dist.y);

        const distScaledDown = {
            x: (25 * dist.x) / hypotenuse,
            y: (25 * dist.y) / hypotenuse
        };

        this.lineStyle(this.particleWidth, this.particleColor)
            .moveTo(this.from.x, this.from.y)
            .lineTo(
                this.from.x + distScaledDown.x,
                this.from.y + distScaledDown.y
            );

        // const container = new PIXI.Container();
        // container.addChild(this);
        // container.rotation = Math.asin(this.from.y / this.from.x);

        // this.beginFill(0xff00ff);
        // this.drawCircle(this.from.x, this.from.y, 3);
        // this.endFill();

        this.stage.addChild(this);
    }
}
