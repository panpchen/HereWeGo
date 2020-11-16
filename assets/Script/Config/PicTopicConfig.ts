// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const TopicConfigs = [
    {
        id: 0,
        title: "在室内时，发生了火灾，这时你该怎么办？ ",
        options: ["赶紧离开到安全地方", "在原地等待救援"],
        answer: 0,
    },
    {
        id: 1,
        title: "此时该往哪个方向疏散？",
        options: ["往左走", "往右走"],
        answer: 0,
    },
    {
        id: 2,
        title: "选择通往一楼的方式？",
        options: ["乘电梯", "走楼梯"],
        answer: 1,
    },
    {
        id: 3,
        title: "很多人聚集到了楼梯口，怎样做可以顺利下楼？",
        options: ["蜂拥而上硬挤", "有序快速的行动"],
        answer: 1,
    },
    {
        id: 4,
        title: "下楼梯时突然发生人群推挤摔倒，这时怎么保护自己？",
        options: ["抱头曲身", "推开别人"],
        answer: 0,
    },
    {
        id: 5,
        title: "终于跑到了一楼，这时选择哪个门到安全地方？ ",
        options: ["门一", "门二"],
        answer: 0,
    },
    {
        id: 6,
        title: "选择哪个地方作为安全地点？",
        options: ["另一个建筑物", "操场"],
        answer: 1,
    }
]

export class PicTopicConfig {
    static getConfigById(id) {
        return TopicConfigs[id];
    }

    static getConfigLength() {
        return TopicConfigs.length;
    }
}

