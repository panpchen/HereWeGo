// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Constants } from "./Config/Constants";
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
  private _isTimeOut: boolean = false;

  onLoad() {
    cc.director.on("gameNextLevel", this._newLevel, this);
  }

  init(playerId?: number) {
    super.init();
    this._topicId = 0;
    this._lastPlayerId = playerId;
    this._topicData = null;
    this._loadTopic();
  }

  _loadTopic() {
    this._selectOptions = [];
    this.timeLabel.node.active = false;
    this._isTimeOut = false;
    this._topicData = Constants.getConfigById(this._lastPlayerId)[this._topicId];
    this.titleLabel.string = this._topicData.title;
    this.listOption.forEach((option, i) => {
      this.listOption[i].active = i == this._topicId;
    });
    this._optionBtnList = this.listOption[this._topicId].getComponentsInChildren(cc.Button);
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
      .to(1, { y: 445 }, { easing: "elasticInOut" })
      .start();
    this.overPanel.active = false;
  }

  _loadNextTopic() {
    // if (true) {
    //   this.scheduleOnce(() => {
    //     UIManager.instance.showUI(UIType.ResultUI);
    //   }, 0.3);
    //   return;
    // }
    if (this._topicId >= Constants.getConfigLength(this._lastPlayerId) - 1) {
      this._topicId = 0;
      this.overPanel.active = true;
      this.bubble.scaleX = this._lastPlayerId == 0 ? 1 : -1;
      const otherPlayerData = Constants.getPlayerById(this._lastPlayerId == 0 ? 1 : 0);
      this.bubbleLabel.string = Utils.stringFormat(Constants.allGameString.str0, otherPlayerData.name);
      this.btnLabel.string = Utils.stringFormat(Constants.allGameString.str1, otherPlayerData.name);
      return;
    }
    this._topicId++;
    this._loadTopic();
  }

  onClickEvent(event, parm) {
    if (this._isTimeOut) {
      return;
    }

    if (parm == "nextPlayer") {
      cc.error("next player");
      return;
    }

    for (let i = 0; i < this._optionBtnList.length; i++) {
      const name = this._optionBtnList[i].node.name;
      // 节点名称btn_0, btn_1，去最后数字判断点击哪个按钮
      if (name.substring(name.length - 1) == parm) {
        const n = Number(parm)
        let sp = this._optionBtnList[i].node.getComponent(cc.Sprite).spriteFrame;
        // 按钮变红，灰逻辑
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
      this.timeLabel.node.active = true;
      this._countDownNum = 3;
      this.timeLabel.string = `${this._countDownNum}`;
      this.schedule(this._countDown, 1, 3, 0.01);
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
      this._isTimeOut = true;
      const isCorrect = Utils.isEqualsArray(this._selectOptions, this._topicData.answers);
      UIManager.instance.showUI(UIType.AnswerUI, isCorrect);
      return;
    }
    this.timeLabel.string = `${this._countDownNum}`;
    this._countDownNum--;
  }
}
