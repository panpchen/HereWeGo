// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import LevelBase from "./LevelBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {
  @property(cc.Prefab)
  levelPrefab: cc.Prefab = null;
  @property(cc.Node)
  levelParent: cc.Node = null;

  public static instance: Game = null;
  private _level: LevelBase = null;
  public lastSelectPlayerIdList: number[] = [];

  onLoad() {
    Game.instance = this;
    cc.director.on("gameStart", this._startGame, this);
  }

  _startGame(playerId: number) {
    if (!this._level) {
      this._level = cc.instantiate(this.levelPrefab).getComponent(LevelBase);
      this._level.node.parent = this.levelParent;
    }
    this._level.init(playerId);
  }

  reset() {
    this.lastSelectPlayerIdList = [];
  }
}
