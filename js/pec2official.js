"use strict";
const tween = [null, null,
    pos => Math.sin(pos * Math.PI / 2), //2
    pos => 1 - Math.cos(pos * Math.PI / 2), //3
    pos => 1 - (pos - 1) ** 2, //4
    pos => pos ** 2, //5
    pos => (1 - Math.cos(pos * Math.PI)) / 2, //6
    pos => ((pos *= 2) < 1 ? pos ** 2 : -((pos - 2) ** 2 - 2)) / 2, //7
    pos => 1 + (pos - 1) ** 3, //8
    pos => pos ** 3, //9
    pos => 1 - (pos - 1) ** 4, //10
    pos => pos ** 4, //11
    pos => ((pos *= 2) < 1 ? pos ** 3 : ((pos - 2) ** 3 + 2)) / 2, //12
    pos => ((pos *= 2) < 1 ? pos ** 4 : -((pos - 2) ** 4 - 2)) / 2, //13
    pos => 1 + (pos - 1) ** 5, //14
    pos => pos ** 5, //15
    pos => 1 - 2 ** (-10 * pos), //16
    pos => 2 ** (10 * (pos - 1)), //17
    pos => Math.sqrt(1 - (pos - 1) ** 2), //18
    pos => 1 - Math.sqrt(1 - pos ** 2), //19
    pos => (2.70158 * pos - 1) * (pos - 1) ** 2 + 1, //20
    pos => (2.70158 * pos - 1.70158) * pos ** 2, //21
    pos => ((pos *= 2) < 1 ? (1 - Math.sqrt(1 - pos ** 2)) : (Math.sqrt(1 - (pos - 2) ** 2) + 1)) / 2, //22
    pos => pos < 0.5 ? (14.379638 * pos - 5.189819) * pos ** 2 : (14.379638 * pos - 9.189819) * (pos - 1) ** 2 + 1, //23
    pos => 1 - 2 ** (-10 * pos) * Math.cos(pos * Math.PI / .15), //24
    pos => 2 ** (10 * (pos - 1)) * Math.cos((pos - 1) * Math.PI / .15), //25
    pos => ((pos *= 11) < 4 ? pos ** 2 : pos < 8 ? (pos - 6) ** 2 + 12 : pos < 10 ? (pos - 9) ** 2 + 15 : (pos - 10.5) ** 2 + 15.75) / 16, //26
    pos => 1 - tween[26](1 - pos), //27
    pos => (pos *= 2) < 1 ? tween[26](pos) / 2 : tween[27](pos - 1) / 2 + .5, //28
    pos => pos < 0.5 ? 2 ** (20 * pos - 11) * Math.sin((160 * pos + 1) * Math.PI / 18) : 1 - 2 ** (9 - 20 * pos) * Math.sin((160 * pos + 1) * Math.PI / 18) //29
];// lchzh3473 copyright部分
let json;
let name;

function readFile() {
    clearLog();
    document.getElementById("reset").disabled = false;
    document.getElementById("download").disabled = false;
    let pecfile = document.getElementById("pec");
    const reader = new FileReader();
    if (pecfile.files.length === 0) alert("请选择文件！");
    let file = pecfile.files[0];
    reader.readAsArrayBuffer(file);
    if (reader.error) {
        setError('错误：无法读取文件');
        return;
    }
    reader.onprogress = progress => {
        const size = file.size;
        setLog("读取进度：" + Math.floor(progress.loaded / size * 100) + "%");
    };
    reader.onloadend = function readEnd() {
        setLog("读取完毕！");
        let string = Uint8ArrayToString(new Uint8Array(reader.result));
        string = string.replace(/\n/g, " ");
        string.replace(/\r/g, "");
        json = chart123(chartp23(string, file.name));
        document.getElementById("download").disabled = false;
    };
}

function reset() {
    window.location.reload();
}

function downloadJson() {
    let outputName = document.getElementById("output").value;
    if (outputName === "") {
        name = file.name + ".json";
    } else {
        name = outputName;
    }
    funDownload(json, name);
}

function clearLog() {
    let output = document.getElementById("log");
    output.value = "";
}

function addLog(msg) {
    let output = document.getElementById("log");
    output.value += msg;
    output.value += "\n";
}

function setLog(msg) {
    let msgBox = document.getElementById("msg");
    msgBox.style.color = "white";
    msgBox.innerHTML = msg;
}

function setError(msg) {
    let msgBox = document.getElementById("msg");
    msgBox.style.color = "red";
    msgBox.innerHTML = msg;
}

function funDownload(content, filename) {
    var reg = new RegExp('[\\\\/:*?\"<>|]');
    if (reg.test(name)) {
        setError("错误：文件名不符合规则");
        return;
    }
    const eleLink = document.createElement('a');
    eleLink.download = filename;
    eleLink.style.display = 'none';
    let blob = new Blob([content]);
    eleLink.href = URL.createObjectURL(blob);
    document.body.appendChild(eleLink);
    eleLink.click();
    document.body.removeChild(eleLink);
}

function Uint8ArrayToString(fileData) {
    var dataString = "";
    for (var i = 0; i < fileData.length; i++) {
        dataString += String.fromCharCode(fileData[i]);
    }
    return dataString
}

// 以下为lchzh3473 copyright部分
function chart123(chart) {
    const newChart = JSON.parse(JSON.stringify(chart)); //深拷贝
    switch (newChart.formatVersion) { //加花括号以避免beautify缩进bug
        case 1: {
            newChart.formatVersion = 3;
            for (const i of newChart.judgeLineList) {
                for (const j of i.judgeLineDisappearEvents) {
                    j.start2 = 0;
                    j.end2 = 0;
                }
                for (const j of i.judgeLineMoveEvents) {
                    j.start2 = j.start % 1e3 / 520;
                    j.end2 = j.end % 1e3 / 520;
                    j.start = parseInt(j.start / 1e3) / 880;
                    j.end = parseInt(j.end / 1e3) / 880;
                }
                for (const j of i.judgeLineRotateEvents) {
                    j.start2 = 0;
                    j.end2 = 0;
                }
            }
        }
        case 3: {
            for (const i of newChart.judgeLineList) {
                let y = 0;
                for (const j of i.speedEvents) {
                    if (j.startTime < 0) j.startTime = 0;
                    j.floorPosition = y;
                    y = Math.fround(y + (j.endTime - j.startTime) * j.value / i.bpm * 1.875); //float32
                }
            }
        }
        case 3473:
            break;
        default:
            throw `Unsupported formatVersion: ${newChart.formatVersion}`;
    }
    addLog("转换完成");
    return JSON.stringify(newChart);
}

function chartp23(pec, filename) {
    class Chart {
        constructor() {
            this.formatVersion = 3;
            this.offset = 0;
            this.numOfNotes = 0;
            this.judgeLineList = [];
        }

        pushLine(judgeLine) {
            this.judgeLineList.push(judgeLine);
            this.numOfNotes += judgeLine.numOfNotes;
            return judgeLine;
        }
    }

    class JudgeLine {
        constructor(bpm) {
            this.numOfNotes = 0;
            this.numOfNotesAbove = 0;
            this.numOfNotesBelow = 0;
            this.bpm = 120;
            this.bpm = bpm;
            ("speedEvents,notesAbove,notesBelow,judgeLineDisappearEvents,judgeLineMoveEvents,judgeLineRotateEvents,judgeLineDisappearEventsPec,judgeLineMoveEventsPec,judgeLineRotateEventsPec").split(",").map(i => this[i] = []);
        }

        pushNote(note, pos) {
            switch (pos) {
                case undefined:
                case 1:
                    this.notesAbove.push(note);
                    break;
                case 2:
                    this.notesBelow.push(note);
                    break;
                default:
                    this.notesBelow.push(note);
                    addLog("Warning: Illeagal Note Side: " + pos);
            }

            this.numOfNotes++;
            this.numOfNotesAbove++;

        }

        pushEvent(type, startTime, endTime, n1, n2, n3, n4) {
            const evt = {
                startTime: startTime,
                endTime: endTime,
            }
            if (typeof startTime == 'number' && typeof endTime == 'number' && startTime > endTime) {
                addLog("Warning: startTime " + startTime + " is larger than endTime " + endTime);
                //return;
            }
            switch (type) {
                case 0:
                    evt.value = n1;
                    this.speedEvents.push(evt);
                    break;
                case 1:
                    evt.start = n1;
                    evt.end = n2;
                    evt.start2 = 0;
                    evt.end2 = 0;
                    this.judgeLineDisappearEvents.push(evt);
                    break;
                case 2:
                    evt.start = n1;
                    evt.end = n2;
                    evt.start2 = n3;
                    evt.end2 = n4;
                    this.judgeLineMoveEvents.push(evt);
                    break;
                case 3:
                    evt.start = n1;
                    evt.end = n2;
                    evt.start2 = 0;
                    evt.end2 = 0;
                    this.judgeLineRotateEvents.push(evt);
                    break;
                case -1:
                    evt.value = n1;
                    evt.motionType = 1;
                    this.judgeLineDisappearEventsPec.push(evt);
                    break;
                case -2:
                    evt.value = n1;
                    evt.value2 = n2;
                    evt.motionType = n3;
                    this.judgeLineMoveEventsPec.push(evt);
                    break;
                case -3:
                    evt.value = n1;
                    evt.motionType = n2;
                    this.judgeLineRotateEventsPec.push(evt);
                    break;
                default:
                    throw `Unexpected Event Type: ${type}`;
            }
        }
    }

    class Note {
        constructor(type, time, x, holdTime, speed) {
            this.type = type;
            this.time = time;
            this.positionX = x;
            this.holdTime = type == 3 ? holdTime : 0;
            this.speed = isNaN(speed) ? 1 : speed; //默认值不为0不能改成Number(speed)||1
            //this.floorPosition = time % 1e9 / 104 * 1.2;
        }
    }

    //test start
    const rawChart = pec.match(/[^\n\r ]+/g).map(i => isNaN(i) ? String(i) : Number(i));
    const qwqChart = new Chart();
    const raw = {};
    ("bp,n1,n2,n3,n4,cv,cp,cd,ca,cm,cr,cf").split(",").map(i => raw[i] = []);
    const rawarr = [];
    let fuckarr = [1, 1]; //n指令的#和&
    let rawstr = "";
    if (!isNaN(rawChart[0])) qwqChart.offset = (rawChart.shift() / 1e3 - 0.175); //v18x固定延迟
    for (let i = 0; i < rawChart.length; i++) {
        let p = rawChart[i];
        if (!isNaN(p)) rawarr.push(p);
        else if (p == "#" && rawstr[0] == "n") fuckarr[0] = rawChart[++i];
        else if (p == "&" && rawstr[0] == "n") fuckarr[1] = rawChart[++i];
        else if (raw[p]) pushCommand(p);
        else throw `Unknown Command: ${p}`;
    }
    pushCommand(""); //补充最后一个元素(bug)
    //处理bpm变速
    if (!raw.bp[0]) raw.bp.push([0, 120]);
    const baseBpm = raw.bp[0][1];
    if (raw.bp[0][0]) raw.bp.unshift([0, baseBpm]);
    const bpmEvents = []; //存放bpm变速事件
    let fuckBpm = 0;
    raw.bp.sort((a, b) => a[0] - b[0]).forEach((i, idx, arr) => {
        if (arr[idx + 1] && arr[idx + 1][0] <= 0) return; //过滤负数
        const start = i[0] < 0 ? 0 : i[0];
        const end = arr[idx + 1] ? arr[idx + 1][0] : 1e9;
        const bpm = i[1];
        bpmEvents.push({
            startTime: start,
            endTime: end,
            bpm: bpm,
            value: fuckBpm
        });
        fuckBpm += (end - start) / bpm;
    });

    function pushCommand(next) {
        if (raw[rawstr]) {
            if (rawstr[0] == "n") {
                rawarr.push(...fuckarr);
                fuckarr = [1, 1];
            }
            raw[rawstr].push(JSON.parse(JSON.stringify(rawarr)));
        }
        rawarr.length = 0;
        rawstr = next;
    }

    //将pec时间转换为pgr时间
    function calcTime(timePec) {
        let timePhi = 0;
        for (const i of bpmEvents) {
            if (timePec < i.startTime) break;
            if (timePec > i.endTime) continue;
            timePhi = Math.round(((timePec - i.startTime) / i.bpm + i.value) * baseBpm * 32);
        }
        return timePhi;
    }

    //处理note和判定线事件
    let linesPec = [];
    for (const i of raw.n1) {
        if (i[4]) {
            addLog(`检测到FakeNote(将不会被添加进json)\n位于:"n1 ${i.slice(0, 5).join(" ")}"\n`);
            continue;
        }
        if (!linesPec[i[0]]) linesPec[i[0]] = new JudgeLine(baseBpm);
        linesPec[i[0]].pushNote(new Note(1, calcTime(i[1]), i[2] / 115.2, 0, i[5]), i[3]);
        if (i[3] != 1 && i[3] != 2) addLog(`检测到非法方向:${i[3]}(将被视为2)\n位于:"n1 ${i.slice(0, 5).join(" ")}"\n`);
        //if (i[4]) addLog(`检测到FakeNote(可能无法正常显示)\n位于:"n1 ${i.slice(0, 5).join(" ")}"\n`);
        if (i[6] != 1) addLog(`检测到异常Note(可能无法正常显示)\n位于:"n1 ${i.slice(0, 5).join(" ")} # ${i[5]} & ${i[6]}"\n`);
    } //102.4
    for (const i of raw.n2) {
        if (i[5]) {
            addLog(`检测到FakeNote(将不会被添加进json)\n位于:"n2 ${i.slice(0, 6).join(" ")}"\n`);
            continue;
        }
        if (!linesPec[i[0]]) linesPec[i[0]] = new JudgeLine(baseBpm);
        linesPec[i[0]].pushNote(new Note(3, calcTime(i[1]), i[3] / 115.2, calcTime(i[2]) - calcTime(i[1]), i[6]), i[4]);
        if (i[4] != 1 && i[4] != 2) addLog(`检测到非法方向:${i[4]}(将被视为2)\n位于:"n2 ${i.slice(0, 5).join(" ")} # ${i[6]} & ${i[7]}"\n`);
        //if (i[5]) addLog(`检测到FakeNote(可能无法正常显示)\n位于:"n2 ${i.slice(0, 6).join(" ")}"\n`);
        if (i[7] != 1) addLog(`检测到异常Note(可能无法正常显示)\n位于:"n2 ${i.slice(0, 5).join(" ")} # ${i[6]} & ${i[7]}"\n`);
    }
    for (const i of raw.n3) {
        if (i[4]) {
            addLog(`检测到FakeNote(将不会被添加进json)\n位于:"n3 ${i.slice(0, 5).join(" ")}"\n`);
            continue;
        }
        if (!linesPec[i[0]]) linesPec[i[0]] = new JudgeLine(baseBpm);
        linesPec[i[0]].pushNote(new Note(4, calcTime(i[1]), i[2] / 115.2, 0, i[5]), i[3]);
        if (i[3] != 1 && i[3] != 2) addLog(`检测到非法方向:${i[3]}(将被视为2)\n位于:"n3 ${i.slice(0, 5).join(" ")} # ${i[5]} & ${i[6]}"\n`);
        //if (i[4]) addLog(`检测到FakeNote(可能无法正常显示)\n位于:"n3 ${i.slice(0, 5).join(" ")}"\n`);
        if (i[6] != 1) addLog(`检测到异常Note(可能无法正常显示)\n位于:"n3 ${i.slice(0, 5).join(" ")} # ${i[5]} & ${i[6]}"\n`);
    }
    for (const i of raw.n4) {
        if (i[4]) {
            addLog(`检测到FakeNote(将不会被添加进json)\n位于:"n4 ${i.slice(0, 5).join(" ")}"\n`);
            continue;
        }
        if (!linesPec[i[0]]) linesPec[i[0]] = new JudgeLine(baseBpm);
        linesPec[i[0]].pushNote(new Note(2, calcTime(i[1]), i[2] / 115.2, 0, i[5]), i[3]);
        if (i[3] != 1 && i[3] != 2) addLog(`检测到非法方向:${i[3]}(将被视为2)\n位于:"n4 ${i.slice(0, 5).join(" ")} # ${i[5]} & ${i[6]}"\n`);
        //if (i[4]) addLog(`检测到FakeNote(可能无法正常显示)\n位于:"n4 ${i.slice(0, 5).join(" ")}"\n`);
        if (i[6] != 1) addLog(`检测到异常Note(可能无法正常显示)\n位于:"n4 ${i.slice(0, 5).join(" ")} # ${i[5]} & ${i[6]}"\n`);
    }
    //变速
    for (const i of raw.cv) {
        if (!linesPec[i[0]]) linesPec[i[0]] = new JudgeLine(baseBpm);
        linesPec[i[0]].pushEvent(0, calcTime(i[1]), null, i[2] / 7.0); //6.0??
    }
    //不透明度
    for (const i of raw.ca) {
        if (!linesPec[i[0]]) linesPec[i[0]] = new JudgeLine(baseBpm);
        linesPec[i[0]].pushEvent(-1, calcTime(i[1]), calcTime(i[1]), i[2] > 0 ? i[2] / 255 : 0); //暂不支持alpha值扩展
        if (i[2] < 0) addLog(`检测到负数Alpha:${i[2]}(将被视为0)\n位于:"ca ${i.join(" ")}"\n`);
    }
    for (const i of raw.cf) {
        if (!linesPec[i[0]]) linesPec[i[0]] = new JudgeLine(baseBpm);
        if (i[1] > i[2]) {
            addLog(`检测到开始时间大于结束时间(将禁用此事件)\n位于:"cf ${i.join(" ")}"\n`);
            continue;
        }
        linesPec[i[0]].pushEvent(-1, calcTime(i[1]), calcTime(i[2]), i[3] > 0 ? i[3] / 255 : 0);
        if (i[3] < 0) addLog(`检测到负数Alpha:${i[3]}(将被视为0)\n位于:"cf ${i.join(" ")}"\n`);
    }
    //移动
    for (const i of raw.cp) {
        if (!linesPec[i[0]]) linesPec[i[0]] = new JudgeLine(baseBpm);
        linesPec[i[0]].pushEvent(-2, calcTime(i[1]), calcTime(i[1]), i[2] / 2048, i[3] / 1400, 1);
    }
    for (const i of raw.cm) {
        if (!linesPec[i[0]]) linesPec[i[0]] = new JudgeLine(baseBpm);
        if (i[1] > i[2]) {
            addLog(`检测到开始时间大于结束时间(将禁用此事件)\n位于:"cm ${i.join(" ")}"\n`);
            continue;
        }
        linesPec[i[0]].pushEvent(-2, calcTime(i[1]), calcTime(i[2]), i[3] / 2048, i[4] / 1400, i[5]);
        if (i[5] && !tween[i[5]] && i[5] != 1) addLog(`未知的缓动类型:${i[5]}(将被视为1)\n位于:"cm ${i.join(" ")}"\n`);
    }
    //旋转
    for (const i of raw.cd) {
        if (!linesPec[i[0]]) linesPec[i[0]] = new JudgeLine(baseBpm);
        linesPec[i[0]].pushEvent(-3, calcTime(i[1]), calcTime(i[1]), -i[2], 1); //??
    }
    for (const i of raw.cr) {
        if (!linesPec[i[0]]) linesPec[i[0]] = new JudgeLine(baseBpm);
        if (i[1] > i[2]) {
            addLog(`检测到开始时间大于结束时间(将禁用此事件)\n位于:"cr ${i.join(" ")}"\n`);
            continue;
        }
        linesPec[i[0]].pushEvent(-3, calcTime(i[1]), calcTime(i[2]), -i[3], i[4]);
        if (i[4] && !tween[i[4]] && i[4] != 1) addLog(`未知的缓动类型:${i[4]}(将被视为1)\n位于:"cr ${i.join(" ")}"\n`);
    }
    for (const i of linesPec) {
        if (i) {
            i.notesAbove.sort((a, b) => a.time - b.time); //以后移到123函数
            i.notesBelow.sort((a, b) => a.time - b.time); //以后移到123函数
            let s = i.speedEvents;
            let ldp = i.judgeLineDisappearEventsPec;
            let lmp = i.judgeLineMoveEventsPec;
            let lrp = i.judgeLineRotateEventsPec;
            const srt = (a, b) => (a.startTime - b.startTime) + (a.endTime - b.endTime); //不单独判断以避免误差
            s.sort(srt); //以后移到123函数
            ldp.sort(srt); //以后移到123函数
            lmp.sort(srt); //以后移到123函数
            lrp.sort(srt); //以后移到123函数
            //cv和floorPosition一并处理
            let y = 0;
            for (let j = 0; j < s.length; j++) {
                s[j].endTime = j < s.length - 1 ? s[j + 1].startTime : 1e9;
                if (s[j].startTime < 0) s[j].startTime = 0;
                s[j].floorPosition = y;
                y += (s[j].endTime - s[j].startTime) * s[j].value / i.bpm * 1.875;
            }
            for (const j of i.notesAbove) {
                let qwqwq = 0;
                let qwqwq2 = 0;
                let qwqwq3 = 0;
                for (const k of i.speedEvents) {
                    if (j.time % 1e9 > k.endTime) continue;
                    if (j.time % 1e9 < k.startTime) break;
                    qwqwq = k.floorPosition;
                    qwqwq2 = k.value;
                    qwqwq3 = j.time % 1e9 - k.startTime;
                }
                j.floorPosition = qwqwq + qwqwq2 * qwqwq3 / i.bpm * 1.875;
                if (j.type == 3) j.speed *= qwqwq2;
            }
            for (const j of i.notesBelow) {
                let qwqwq = 0;
                let qwqwq2 = 0;
                let qwqwq3 = 0;
                for (const k of i.speedEvents) {
                    if (j.time % 1e9 > k.endTime) continue;
                    if (j.time % 1e9 < k.startTime) break;
                    qwqwq = k.floorPosition;
                    qwqwq2 = k.value;
                    qwqwq3 = j.time % 1e9 - k.startTime;
                }
                j.floorPosition = qwqwq + qwqwq2 * qwqwq3 / i.bpm * 1.875;
                if (j.type == 3) j.speed *= qwqwq2;
            }
            //整合motionType
            let ldpTime = 0;
            let ldpValue = 0;
            for (const j of ldp) {
                i.pushEvent(1, ldpTime, j.startTime, ldpValue, ldpValue);
                if (tween[j.motionType]) {
                    for (let k = parseInt(j.startTime); k < parseInt(j.endTime); k++) {
                        let ptt1 = (k - j.startTime) / (j.endTime - j.startTime);
                        let ptt2 = (k + 1 - j.startTime) / (j.endTime - j.startTime);
                        let pt1 = j.value - ldpValue;
                        i.pushEvent(1, k, k + 1, ldpValue + tween[j.motionType](ptt1) * pt1, ldpValue + tween[j.motionType](ptt2) * pt1);
                    }
                } else if (j.motionType) i.pushEvent(1, j.startTime, j.endTime, ldpValue, j.value);
                ldpTime = j.endTime;
                ldpValue = j.value;
            }
            i.pushEvent(1, ldpTime, 1e9, ldpValue, ldpValue);
            //
            let lmpTime = 0;
            let lmpValue = 0;
            let lmpValue2 = 0;
            for (const j of lmp) {
                i.pushEvent(2, lmpTime, j.startTime, lmpValue, lmpValue, lmpValue2, lmpValue2);
                if (tween[j.motionType]) {
                    for (let k = parseInt(j.startTime); k < parseInt(j.endTime); k++) {
                        let ptt1 = (k - j.startTime) / (j.endTime - j.startTime);
                        let ptt2 = (k + 1 - j.startTime) / (j.endTime - j.startTime);
                        let pt1 = j.value - lmpValue;
                        let pt2 = j.value2 - lmpValue2;
                        i.pushEvent(2, k, k + 1, lmpValue + tween[j.motionType](ptt1) * pt1, lmpValue + tween[j.motionType](ptt2) * pt1, lmpValue2 + tween[j.motionType](ptt1) * pt2, lmpValue2 + tween[j.motionType](ptt2) * pt2);
                    }
                } else if (j.motionType) i.pushEvent(2, j.startTime, j.endTime, lmpValue, j.value, lmpValue2, j.value2);
                lmpTime = j.endTime;
                lmpValue = j.value;
                lmpValue2 = j.value2;
            }
            i.pushEvent(2, lmpTime, 1e9, lmpValue, lmpValue, lmpValue2, lmpValue2);
            //
            let lrpTime = 0;
            let lrpValue = 0;
            for (const j of lrp) {
                i.pushEvent(3, lrpTime, j.startTime, lrpValue, lrpValue);
                if (tween[j.motionType]) {
                    for (let k = parseInt(j.startTime); k < parseInt(j.endTime); k++) {
                        let ptt1 = (k - j.startTime) / (j.endTime - j.startTime);
                        let ptt2 = (k + 1 - j.startTime) / (j.endTime - j.startTime);
                        let pt1 = j.value - lrpValue;
                        i.pushEvent(3, k, k + 1, lrpValue + tween[j.motionType](ptt1) * pt1, lrpValue + tween[j.motionType](ptt2) * pt1);
                    }
                } else if (j.motionType) i.pushEvent(3, j.startTime, j.endTime, lrpValue, j.value);
                lrpTime = j.endTime;
                lrpValue = j.value;
            }
            i.pushEvent(3, lrpTime, 1e9, lrpValue, lrpValue);
            qwqChart.pushLine(i);
        }
    }
    console.log(JSON.stringify(qwqChart));
    return JSON.parse(JSON.stringify(qwqChart));
}
