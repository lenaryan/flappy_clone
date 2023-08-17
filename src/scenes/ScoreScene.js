import BaseScene from "./BaseScene";

class ScoreScene extends BaseScene {
    constructor(config) {
        super('ScoreScene', config);
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
        )
    }

   
}

export default ScoreScene;