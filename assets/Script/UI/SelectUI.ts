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
  @property(cc.Label)
  bubbleLabels: cc.Label[] = [];

  private _gameInstance: Game = null;

  init() {
    this._gameInstance = Game.instance;
    this.showConetentByIndex(-1);
  }

  showConetentByIndex(index: number) {
    if (index === -1) {
      this.contentList[0].active = false;
      this.contentList[1].active = false;
      return;
    }

    const playerData = Constants.getPlayerById(index);
    if (playerData) {
      Game.instance.lastSelectPlayerIdList.push(index);

      for (let i = 0; i < this.bubbleLabels.length; i++) {
        if (i === index) {
          this.bubbleLabels[i].string = playerData.info;
          break;
        }
      }
    }

    this.contentList[0].active = index === 0;
    this.contentList[1].active = index === 1;
  }

  onClickEvent(evt, parm) {
    if (parm === "go") {
      UIManager.instance.hideAll();

      const lastSelectPlayerId = this._gameInstance.lastSelectPlayerIdList[this._gameInstance.lastSelectPlayerIdList.length - 1];
      cc.director.emit("gameStart", lastSelectPlayerId);
    } else if (parm === "0" || parm === "1") {
      evt.target.getComponent(cc.Button).interactable = false;

      this.showConetentByIndex(Number(parm));
    }
  }
}
