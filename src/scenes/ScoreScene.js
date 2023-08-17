import BaseScene from "./BaseScene";

class ScoreScene extends BaseScene {
    constructor(config) {
        super('ScoreScene', {...config, canGoBack: true});
    }

    create() {
        super.create();
        this.add.text(
            ...this.screenCenter,
            `Best Score: ${localStorage.getItem('best-score') || 0}`,
            {
                fontSize: this.fontSize,
                fill: '#fff'
            }
        ).setOrigin(0.5, 1);
    }

   
}

export default ScoreScene;