// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Constants } from "../Config/Constants";
import Game from "../Game";
import { UIManager } from "../UIManager";
import BaseUI from "./BaseUI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SelectUI extends BaseUI {
  @property(cc.Node)
  contentList: cc.Node[] = [];
  @property(cc.Node)
  manList: cc.Node[] = [];
  @property(cc.Label)
  titleLabel: cc.Label = null;
  @property(cc.Button)
  btnList: cc.Button[] = [];

  private _gameInstance: Game = null;

  init() {
    this._gameInstance = Game.instance;
    this.contentList[0].active = true;
    this.contentList[1].active = false;
    this.manList.forEach(man => {
      man.active = true;
    });
    this.btnList.forEach((btn, index) => {
      if (Game.instance.lastSelectPlayerIdList.includes(index)) {
        btn.interactable = false;
      } else {
        btn.interactable = true;
      }
    });
  }

  onClickEvent(evt, parm) {
    if (parm === "go") {
      UIManager.instance.hideAll();
      const lastSelectPlayerId = this._gameInstance.lastSelectPlayerIdList[this._gameInstance.lastSelectPlayerIdList.length - 1];
      cc.director.emit("gameStart", lastSelectPlayerId);
    } else if (parm === "0" || parm === "1") {
      const index = Number(parm);
      const playerData = Constants.getPlayerById(index);
      Game.instance.lastSelectPlayerIdList.push(index);
      evt.target.getComponent(cc.Button).interactable = false;
      this.titleLabel.string = playerData.info;
      this.contentList[0].active = false;
      this.manList.forEach((man, id) => {
        man.active = false;
        if (index == id) {
          man.active = true;
          cc.tween(man)
            .to(0.7, { scale: 1.2, position: cc.v3(-137, -90) })
            .call(() => {
              this.contentList[1].active = true;
            })
            .start()
        }
      })
    }
  }
}
