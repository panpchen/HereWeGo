// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { PicTopicConfig } from "./Config/PicTopicConfig";
import Game from "./Game";
import LevelBase from "./LevelBase";
import { UIManager, UIType } from "./UIManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LevelSelect extends LevelBase {
  @property(cc.Prefab)
  bg_prefabs: cc.Prefab[] = [];
  @property(cc.Node)
  bgParent: cc.Node = null;
  @property(cc.Node)
  optionList: cc.Node[] = [];
  @property(cc.Label)
  titleLabel: cc.Label = null;
  @property(cc.Node)
  tip: cc.Node = null;
  @property(cc.Label)
  timeLabel: cc.Label = null;
  @property(cc.Node)
  titleNode: cc.Node = null;

  private _gameTime: number = 0;
  private _totalTime: number = 0;
  private _curPicId = 0;
  private get curPicId() {
    return this._curPicId;
  }
  private set curPicId(v) {
    this._curPicId = v;
    if (this._curPicId > this._totalRightNum - 1) {
      this._curPicId = this._totalRightNum - 1;
    }
    if (this._curPicId < 0) {
      this._curPicId = 0;
    }
  }
  private _topicData = null;
  private _totalRightNum = PicTopicConfig.getConfigLength();;
  private _curAnswerNum = 0;
  private _bgList: Map<number, cc.Node> = new Map();
  private _isTweenOver: boolean = false;

  init() {
    super.init();
    this._topicData = null;
    this.tip.opacity = 0;
    this.curPicId = 0;
    this._gameTime = 0;
    this._totalTime = 0;
    this._bgList.forEach(bg => {
      bg.active = false;
    });
    this._loadPic();
  }

  _loadPic() {
    this._topicData = PicTopicConfig.getConfigById(this.curPicId);
    this.titleLabel.string = this._topicData.title;
    this.optionList.forEach((option, index) => {
      option.getChildByName("label").getComponent(cc.Label).string = this._topicData.options[index];
    });

    let bg: cc.Node = null;
    if (!this._bgList.has(this._curPicId)) {
      bg = cc.instantiate(this.bg_prefabs[this._curPicId]);
      bg.name = `bg${this._curPicId}`;
      this._bgList.set(this._curPicId, bg);
      bg.parent = this.bgParent;
    } else {
      bg = this._bgList.get(this._curPicId);
      bg.active = true;
    }
    this._gameTime = 0;
    this.timeLabel.string = `计时：00:00`;
    bg.opacity = 0;
    cc.tween(bg)
      .to(0.5, { opacity: 255 })
      .start();

    this._isTweenOver = false;
    this.titleNode.y = 756;
    this.optionList[0].x = -600;
    this.optionList[1].x = 600;

    cc.tween(this.titleNode)
      .to(1, { y: 445 }, { easing: "elasticInOut" })
      .call(() => {
        this._isTweenOver = true;
        this.schedule(this._countDown, 1, cc.macro.REPEAT_FOREVER, 0.1);
      })
      .start();
    cc.tween(this.optionList[0])
      .to(1.5, { x: -207 }, { easing: "elasticInOut" })
      .start();
    cc.tween(this.optionList[1])
      .to(1.5, { x: 207 }, { easing: "elasticInOut" })
      .start();
  }

  _countDown() {
    this.timeLabel.string = `计时：${Game.instance.countDownFormat(++this._gameTime)}`;
    ++this._totalTime;
  }

  _showTip() {
    this.tip.opacity = 255;
    cc.Tween.stopAllByTarget(this.tip);
    cc.tween(this.tip)
      .delay(1)
      .to(0.2, { opacity: 0 })
      .start()
  }

  _loadNextPic() {
    if (this._totalRightNum != 0 && this._curAnswerNum == this._totalRightNum) {
      this._curAnswerNum = 0;
      this.scheduleOnce(() => {
        UIManager.instance.showUI(UIType.ResultUI, { gameTime: this._totalTime });
      }, 0.3);
      return;
    }

    this.curPicId++;
    this._loadPic();
  }

  onClickEvent(event, parm) {
    if (!this._isTweenOver) {
      return;
    }

    let isRight = this._topicData.answer == Number(parm);
    if (!isRight) {
      this._showTip();
    }

    const btn = event.target.getComponent(cc.Button);
    btn.interactable = false;
    if (isRight) {
      this.unschedule(this._countDown);
      this.scheduleOnce(() => {
        this._loadNextPic();
        btn.interactable = true;
      }, 0.5);
      this._curAnswerNum++;
    } else {
      this.scheduleOnce(() => {
        btn.interactable = true;
      }, 0.3);
    }
  }
}
