// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Constants } from "../Config/Constants";
import Game from "../Game";
import { SendMsg } from "../Net/SendMsg";
import { UIManager, UIType } from "../UIManager";
import BaseUI from "./BaseUI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ResultUI extends BaseUI {
  @property(cc.Node)
  titleNode: cc.Node = null;
  @property(cc.RichText)
  starNumLabel: cc.RichText = null;
  @property(cc.Node)
  starNode: cc.Node = null;

  private _starList: cc.Node[] = [];

  init(data) {
    for (let i = this._starList.length - 1; i >= 0; i--) {
      this._starList[i].destroy();
      this._starList.splice(i, 1);
    }

    const starListLength = Game.instance.level.starList.length;
    this.starNumLabel.string = `<color=#333333>你获得了<color=#DA6700><size=50>${starListLength}</size></c>颗星的奖励</color>`;
    for (let i = 0; i < starListLength; i++) {
      this._showStar();
    }

    this.titleNode.angle = 0;
    cc.tween(this.titleNode)
      .delay(1)
      .repeatForever(
        cc.tween()
          .to(1.5, { angle: -5 })
          .to(1.5, { angle: 5 })
      ).start();

    SendMsg.reqSaveAssessStatistics(Constants.AssessStatisticsJson);
  }

  _showStar() {
    if (this.starNode) {
      const star = cc.instantiate(this.starNode);
      star.parent = this.starNode.parent;
      this._starList.push(star);
      star.active = true;
    }
  }

  clickBackGame() {
    this.hide();
    Game.instance.reset();
    UIManager.instance.showUI(UIType.MenuUI);
  }
}