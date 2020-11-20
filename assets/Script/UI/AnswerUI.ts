// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BaseUI from "./BaseUI";
import { UIManager, UIType } from "../UIManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class AnswerUI extends BaseUI {
  @property(cc.Animation)
  ani: cc.Animation = null;
  @property(cc.Node)
  win: cc.Node = null;
  @property(cc.Node)
  fail: cc.Node = null;

  private _isCorrect: boolean = false;

  onLoad() {
    this.ani.on("finished", this._onFinished, this);
  }

  init(isCorrent: boolean) {
    this._isCorrect = isCorrent;
    this.win.active = isCorrent;
    this.fail.active = !isCorrent;
  }

  _onFinished() {
    this.hide();
    if (this._isCorrect) {
      cc.director.emit("gameNextLevel");
    }
  }
  // clickGameStart() {
  //   UIManager.instance.showUI(UIType.SelectUI, null, () => {
  //     this.hide();
  //   });
  // }
}
