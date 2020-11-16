// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Constants } from "../Config/Constants";
import { SendMsg } from "../Net/SendMsg";
import { UIManager, UIType } from "../UIManager";
import BaseUI from "./BaseUI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ResultUI extends BaseUI {
  @property(cc.Label)
  timeLabel: cc.Label = null;
  @property(cc.Node)
  titleNode: cc.Node = null;

  init(data) {
    cc.tween(this.titleNode)
      .repeatForever(
        cc.tween()
          .to(1.5, { angle: -5 })
          .to(1.5, { angle: 5 })
      ).start();
    this.timeLabel.string = `${data["gameTime"]}`;
    SendMsg.reqSaveAssessStatistics(Constants.AssessStatisticsJson);

  }

  clickAgainGame() {
    UIManager.instance.hideAll();
    cc.director.emit("gameStart");
  }
}
