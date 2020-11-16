// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Utils } from "../Utils";

export class Constants {
    // 请求评估统计给后台在游戏结束时
    static AssessStatisticsJson: string;

    static storeParmForAssessStatistics() {
        this.AssessStatisticsJson = JSON.stringify(Utils.getParmFromURL(window.location.href));
    }
}
