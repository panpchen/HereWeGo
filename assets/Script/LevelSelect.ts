// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Constants } from "./Config/Constants";
import Game from "./Game";
import LevelBase from "./LevelBase";
import { UIManager, UIType } from "./UIManager";
import { Utils } from "./Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LevelSelect extends LevelBase {
  @property(cc.SpriteFrame)
  listBgSpf: cc.SpriteFrame[] = [];
  @property(cc.Sprite)
  bgSp: cc.Sprite = null;
  @property(cc.Label)
  titleLabel: cc.Label = null;
  @property(cc.Node)
  titleNode: cc.Node = null;
  @property(cc.Node)
  listOption: cc.Node[] = [];
  @property(cc.SpriteFrame)
  listOptionSpf: cc.SpriteFrame[] = [];
  @property(cc.Label)
  timeLabel: cc.Label = null;
  @property(cc.Node)
  overPanel: cc.Node = null;
  @property(cc.Node)
  allOverPanel: cc.Node = null;
  @property(cc.Node)
  bubble: cc.Node = null;
  @property(cc.Node)
  playerList: cc.Node[] = [];
  @property(cc.Label)
  bubbleLabel: cc.Label = null;
  @property(cc.Label)
  btnLabel: cc.Label = null;

  private _topicId = 0;
  private _topicData = null;
  private _optionBtnList: cc.Button[] = [];
  private _selectOptions: number[] = [];
  private _countDownNum = 3;
  private _lastPlayerId: number = -1;

  onLoad() {
    cc.director.on("gameNextLevel", this._newLevel, this);
  }

  init(playerId?: number) {
    this._topicId = 0;
    this._topicData = null;
    this._lastPlayerId = playerId;
    this.overPanel.active = false;
    this.allOverPanel.active = false;
    this._loadTopic();
  }

  _loadTopic() {
    this._selectOptions = [];
    this.timeLabel.node.active = false;
    this._topicData = Constants.getConfigById(this._lastPlayerId)[this._topicId];
    this.titleLabel.string = this._topicData.title;
    this.listOption.forEach((option, i) => {
      this.listOption[i].active = i == this._topicData.optionId;
    });
    this._optionBtnList = this.listOption[this._topicData.optionId].getComponentsInChildren(cc.Button);
    this._optionBtnList.forEach((btn, i) => {
      btn.node.getComponent(cc.Sprite).spriteFrame = this.listOptionSpf[1];
      // btn.node.getChildByName("label").getComponent(cc.Label).string = this._topicData.options[i];
    });

    this.bgSp.spriteFrame = this.listBgSpf[this._topicData.bgId];
    this.bgSp.node.opacity = 0;
    cc.tween(this.bgSp.node)
      .to(0.5, { opacity: 255 })
      .start();

    this.titleNode.y = 756;
    cc.tween(this.titleNode)
      .to(1, { y: 472 }, { easing: "elasticInOut" })
      .start();
  }

  _loadNextTopic() {
    if (this._topicId === Constants.getConfigLength(this._lastPlayerId) - 1) {
      if (Game.instance.lastSelectPlayerIdList.length === 1) {
        this._topicId = 0;
        this.overPanel.active = true;
        this.bubble.scaleX = this._lastPlayerId == 0 ? 1 : -1;
        const otherPlayerData = Constants.getPlayerById(this._getOtherPlayerId());
        this.bubbleLabel.string = Utils.stringFormat(Constants.allGameString.str0, otherPlayerData.name);
        this.btnLabel.string = Utils.stringFormat(Constants.allGameString.str1, otherPlayerData.name);
        this.playerList.forEach((player, index) => {
          player.active = index == this._lastPlayerId;
        });
      } else if (Game.instance.lastSelectPlayerIdList.length === 2) {
        this.allOverPanel.active = true;
        this.scheduleOnce(() => {
          UIManager.instance.showUI(UIType.ResultUI);
        }, 1.5);
      }
      return;
    }
    this._topicId++;
    this._loadTopic();
  }

  _getOtherPlayerId() {
    return this._lastPlayerId == 0 ? 1 : 0;
  }

  onClickEvent(event, parm) {
    if (parm == "nextPlayer") {
      UIManager.instance.showUI(UIType.SelectUI);
      // this.init(this._getOtherPlayerId());
      return;
    }

    for (let i = 0; i < this._optionBtnList.length; i++) {
      const name = this._optionBtnList[i].node.name;
      // 节点名称btn_0, btn_1，去最后数字判断点击哪个按钮
      if (name.substring(name.length - 1) == parm) {
        const n = Number(parm)
        let sp = this._optionBtnList[i].node.getComponent(cc.Sprite).spriteFrame;
        // 按钮变红和灰的逻辑
        if (sp.name == this.listOptionSpf[0].name) {
          this._optionBtnList[i].node.getComponent(cc.Sprite).spriteFrame = this.listOptionSpf[1];   // gray
          const delIndex = this._selectOptions.indexOf(n);
          if (delIndex !== -1) {
            this._selectOptions.splice(delIndex, 1);
          }
        } else {
          this._optionBtnList[i].node.getComponent(cc.Sprite).spriteFrame = this.listOptionSpf[0];   // red
          if (!this._selectOptions.includes(n)) {
            this._selectOptions.push(n);
          }
        }
        break;
      }
    }

    // 计时器
    if (this._selectOptions.length > 0) {
      if (cc.director.getScheduler().isScheduled(this._countDown, this)) {
        return;
      }
      this._countDownNum = 3;
      this.timeLabel.string = `${this._countDownNum}`;
      this.schedule(this._countDown, 1, 3, 0.01);
      this.timeLabel.node.active = true;
    } else {
      this.unschedule(this._countDown);
      this.timeLabel.node.active = false;
    }
  }

  _newLevel() {
    this._loadNextTopic();
  }

  _countDown() {
    if (this._countDownNum < 1) {
      this.unschedule(this._countDown);
      this.timeLabel.node.active = false;
      const isCorrect = Utils.isEqualsArray(this._selectOptions, this._topicData.answers);
      UIManager.instance.showUI(UIType.AnswerUI, isCorrect);
      return;
    }
    this.timeLabel.string = `${this._countDownNum}`;
    this._countDownNum--;
  }
}
