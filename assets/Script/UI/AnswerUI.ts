// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BaseUI from "./BaseUI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class AnswerUI extends BaseUI {
  @property(cc.Node)
  win: cc.Node = null;
  @property(cc.Node)
  fail: cc.Node = null;
  @property(cc.Animation)
  winAni: cc.Animation = null;

  onLoad() {
    this.winAni.on("finished", () => {
      this._onNextLevel(true);
    }, this);
  }

  init(args: any[]) {
    const isCorrect = args[0];
    const haveWrong = args[1];

    this.win.active = isCorrect;
    this.fail.active = !isCorrect;

    if (isCorrect) {
      if (!haveWrong) {
        this.winAni.play();
      } else {
        this._onNextLevel(false);
      }
    } else {
      this.scheduleOnce(() => {
        this.hide();
      }, 1);
    }
  }

  _onNextLevel(isShowAni: boolean) {
    this.hide();
    this.scheduleOnce(() => {
      cc.director.emit("gameNextLevel", isShowAni);
    }, 0.3);
  }
}
