// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class UpDownAni extends cc.Component {
  start() {
    cc.tween(this.node)
      .repeatForever(
        cc.tween().by(1, { y: 15 })
          .by(1, { y: -15 })
      ).start();

  }
}
