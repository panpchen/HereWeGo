import { Constants } from "./Config/Constants";
import { Utils } from "./Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Loading extends cc.Component {

  @property(cc.Node)
  progress: cc.Node = null;
  @property(cc.Label)
  label: cc.Label = null;
  @property(cc.Node)
  secondsArrow: cc.Node = null;

  onLoad() {
    cc.macro.ENABLE_MULTI_TOUCH = false;
    const manager = cc.director.getCollisionManager();
    manager.enabled = true;
    // manager.enabledDebugDraw = true;
    Constants.storeParmForAssessStatistics();
  }

  start() {
    this.preloadGameScene();
  }

  preloadGameScene() {
    cc.tween(this.secondsArrow)
      .repeatForever(
        cc.tween().by(0.1, { angle: 40 })
      ).start();

    cc.director.preloadScene('game', (completeCount, totalCount, item) => {
      let v = completeCount / totalCount;
      this.progress.getComponent("progressBarMoveEffect").updateProgress(v, (num) => {
        this.label.string = `已加载${Math.floor(v * 100)}%`;
      });
    }, () => {
      this.scheduleOnce(() => {
        cc.director.loadScene("game");
        cc.log('game scene preloaded');
      }, 0.3)
    });

  }
}
