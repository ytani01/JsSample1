//
// Copyright (c) 2022 Yoichi Tanibayashi
//

/**
 *
 */
class MyBase {
    /**
     * @param {string} id string
     */
    constructor(id, innerHTML=undefined) {
        this.id = id;
        this.el = document.getElementById(this.id);

        this.w = this.el.clientWidth;
        this.h = this.el.clientHeight;
        this.z = this.el.style.zIndex;
        if ( ! this.z ) {
            this.set_z(1);
        }
        console.log(`id=${this.id}, <${this.el.tagName}> ${this.w}x${this.h}, z=${this.z}`);

        if ( innerHTML !== undefined ) {
            this.set_innerHTML(innerHTML);
        } else if ( this.el.innerHTML ) {
            this.innerHTML = this.el.innerHTML.trim();
        }

        this.prev_msec = 0;

    } // MyBase.constructor()
     
    /**
     * @param {string} innerHTML
     */
    set_innerHTML(innerHTML) {
        this.innerHTML = innerHTML.trim();
        this.el.innerHTML = this.innerHTML;
    } // MyBase.set_innerHTML()

    /**
     * @param {number} z
     */
    set_z(z) {
        this.z = z;
        this.el.style.zIndex = this.z;
    } // MyBase.set_z()

    /**
     * @param {number} z (optional)
     */
    on(z=1) {
        this.el.style.opacity = 1;
        this.set_z(z);
    } // MyBase.on()

    /**
     *
     */
    off() {
        this.el.style.opacity = 0;
        this.set_z(0);
    } // MyBase.off()

    /**
     *
     */
    enableUpdate() {
        if ( UpdateObj.indexOf(this) >= 0 ) {
            UpdateObj.push(this);
        }
    } // MyBase.enableUpdate()

    /**
     * @param {number} current msec
     */
    update(cur_msec) {
        // to be overridden

        if ( UpdateObj.indexOf(this) >= 0 ) {
            if ( this.prev_lap === undefined ) {
                this.prev_lap = 0;
            }
            if ( cur_msec - this.prev_lap >= 1000 ) {
                console.log(`${this.id} update> ${cur_msec/1000} ${cur_msec - this.prev_lap}`);
                this.prev_lap = cur_msec;
            }
        }
        this.prev_msec = cur_msec;
    } // MyBase.update()

} // class MyBase

/**
 *
 */
class MyTouchable extends MyBase {
    /**
     * @param {string} id
     * @param {string} innerHTML
     */
    constructor(id, innerHTML=undefined) {
        super(id, innerHTML);

        this.el.onmousedown = this.on_mouse_down.bind(this);
        this.el.ontouchstart = this.on_mouse_down.bind(this);
        this.el.onmouseup = this.on_mouse_up.bind(this);
        this.el.ontouchend = this.on_mouse_up.bind(this);
        this.el.onmousemove = this.on_mouse_move.bind(this);
        this.el.ontouchmove = this.on_mouse_move.bind(this);
        this.el.ondragstart = this.null_handler.bind(this);
    }

    /**
     * touch event to mouse event
     * only for get_xy() function
     *
     * @param {MouseEvent} e
     */
    touch2mouse(e) {
        e.preventDefault();
        if ( e.changedTouches ) {
            e = e.changedTouches[0];
        }
        return e;
    } // MyBase.touch2mouse()
    
    /**
     * @param {MouseEvent} e
     */
    get_xy(e) {
        e = this.touch2mouse(e);
        return [Math.round(e.pageX), Math.round(e.pageY)];
    } // MyBase.get_xy()

    /**
     * @param {MouseEvent} e
     */
    on_mouse_down(e) {
        let [x, y] = this.get_xy(e);
        this.on_mouse_down_xy(x, y);
    } // MyBase.on_mouse_down()

    /**
     * @param {MouseEvent} e
     */
    on_mouse_up(e) {
        let [x, y] = this.get_xy(e);
        this.on_mouse_up_xy(x, y);
    } // MyBase.on_mouse_up()

    /**
     * @param {MouseEvent} e
     */
    on_mouse_move(e) {
        let [x, y] = this.get_xy(e);
        this.on_mouse_move_xy(x, y);
    } // MyBase.on_mouse_move()

    /**
     * @param {MouseEvent} e
     */
    null_handler(e) {
        return false;
    } // MyBase.null_handler()

    /**
     * @param {number} x
     * @param {number} y
     */
    on_mouse_down_xy(x, y) {
        // to be overridden
        console.log(`${this.id} mouse_down(${x}, ${y})`);
    } // MyBase.on_mouse_down_xy()

    /**
     * @param {number} x
     * @param {number} y
     */
    on_mouse_up_xy(x, y) {
        // to be overridden
        console.log(`${this.id} mouse_up[${x}, ${y}]`);
    } // MyBase.on_mouse_down_xy()

    /**
     * @param {number} x
     * @param {number} y
     */
    on_mouse_move_xy(x, y) {
        // to be overridden
        console.log(`${this.id} mouse_move[${x}, ${y}]`);
    } // MyBase.on_mouse_down_xy()
        
} // class MyTouchable

/**
 *
 */
class MyMoveable extends MyTouchable {
    /**
     * @param {string} id
     * @param {string} innerHTML
     * @param {number} x
     * @param {number} y
     */
    constructor(id, innerHTML=undefined, x=undefined, y=undefined) {
        super(id, innerHTML);

        this.el.style.position = "absolute";

        const domRect = this.el.getBoundingClientRect();
        this.x = Math.floor(domRect.x);
        this.y = Math.floor(domRect.y);
        console.log(`${this.id} (${this.x},${this.y})`);

    } // MyMoveable.constructor()

    /**
     * @param {number} x
     * @param {number} y
     */
    move(x, y) {
        if ( x === undefined || y === undefined ) {
            return;
        }

        this.x = x;
        this.y = y;

        this.el.style.left = `${this.x}px`;
        this.el.style.top = `${this.y}px`;
    } // MyMoveable.move()

    /**
     *
     */
    move_center(x, y) {
        if ( x === undefined || y === undefined ) {
            return;
        }

        const x1 = x - this.w / 2;
        const y1 = y - this.h / 2;
        this.move(x1, y1);
    } // MyMoveable.move_center()
} // class MyMoveable

/**
 *
 */
class MyDraggable extends MyMoveable {
    /**
     *
     */
    constructor(id, innerHTML=undefined, x=0, y=0) {
        super(id, innerHTML, x, y);
        this.move_flag = false;
    }

    on_mouse_down_xy(x, y) {
        console.log(`${this.id} [${x},${y}]`);
        this.move_flag = true;
        this.orig_z = this.z;
        this.set_z(1000);
        this.move_center(x, y);
    }

    on_mouse_up_xy(x, y) {
        console.log(`${this.id} [${x},${y}]`);
        this.move_flag = false;
        this.set_z(this.orig_z);
    }

    on_mouse_move_xy(x, y) {
        if ( this.move_flag ) {
            this.move_center(x,y);
        }
    }
} // class MyDraggable

/**
 *
 */
class MyButton extends MyBase {
    /**
     * @param {string} id
     */
    constructor(id) {
        super(id);
        this.available = true;
    } // MyButton.constructor()

    /**
     *
     */
    enable(bt_color=undefined) {
        this.el.style.opacity = 1;
        this.el.style.backgroundColor = bg_color;
        this.available = true;
    }

    /**
     *
     */
    disable(bg_color=undefined) {
        this.el.style.opacity = 0.3;
        this.el.style.backgroundColor = bg_color;
        this.available = false;
    }
} // class MyButton

//////////
const UPDATE_INTERVAL = 27; // msec
let UpdateObj = [];
let PrevLap = 0;

let TargetNum = 0;
let RemainderNum = 0;
let NumList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let TargetObj, RemainderObj, IconObj, NgCountObj;
let NGlimit = 3;
let NGcount = 0;
const button_id = ["btn01", "btn02", "btn03", "btn04", "btn05",
                   "btn06", "btn07", "btn08", "btn09", "btn10"];
let button_obj = [];

/**
 *
 */
const updateAll = () => {
    const cur_msec = (new Date()).getTime();
    
    if ( cur_msec - PrevLap >= 1000 ) {
        console.log(`updateAll> ${cur_msec/1000} ${cur_msec - PrevLap}`);
        PrevLap = cur_msec;
    }
    
    UpdateObj.forEach(obj => {
        obj.update(cur_msec);
    });
}; // update_All()

/**
 *
 */
const set_ng_count = (ng_count) => {
    console.log(`set_ng_count(${ng_count})`);
    NGcount = ng_count;
    const str = `${NGcount} / ${NGlimit}`;
    NgCountObj.set_innerHTML(str);

    if ( NGcount > NGlimit ) {
        window.alert("\nGame Over!!\n");
        location.reload();
    }
}; // set_ng_count()

/**
 *
 */
const set_target = () => {
    TargetNum = RemainderNum = parseInt(TargetObj.el.value);
    set_ng_count(0);
    
    console.log(`set_target() > TargetNum=${TargetNum}, RemainderNum=${RemainderNum}`);

    RemainderObj.set_innerHTML(String(RemainderNum));
    
    init_nums();
    init_buttons();
}; // set_target()

/**
 *
 */
const init_nums = () => {
    NumList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
}; // init_nums()

/**
 *
 */
const click_btn = (id) => {
    const prefix = `click_btn(${id})>`;
    const el = document.getElementById(id);
    const num = parseInt(el.innerHTML);
    console.log(`${prefix} num = ${num}, RemainderNum = ${RemainderNum}`);

    const btn_idx = num - 1;
    if ( ! button_obj[btn_idx].available ) {
        console.log(`${prefix} ${id} .. ignored`);
        return;
    }
    
    if ( num > RemainderNum ) {
        button_obj[btn_idx].disable("#444");

        NGcount += 1;

        const msg = `\n多すぎるよ! (${NGcount} / ${NGlimit})\n`;
        window.alert(msg);

        set_ng_count(NGcount);
        return;
    }

    RemainderNum -= num;
    NumList = use_num(num, NumList);
    console.log(`${prefix} RemainderNum = ${RemainderNum}, NumList = [${NumList}]`);

    if ( ! can_make(RemainderNum, NumList) ) {
        button_obj[btn_idx].disable("#444");

        RemainderNum += num; 
        // NumList.push(num);
        set_ng_count(NGcount + 1);
        console.log(`${prefix} RemainderNum=${RemainderNum},NumList=[${NumList}],NGcount=${NGcount}`);

        const msg = `\nピッタリにできなくなるよ! (${NGcount} / ${NGlimit})\n`;
        window.alert(msg);
        return;
    }

    RemainderObj.set_innerHTML(String(RemainderNum));
    button_obj[btn_idx].disable();

    if ( RemainderNum == 0 ) {
        window.alert("\nClear !!\n");
        location.reload();
    }

}; // click_btn()

/**
 * 配列 nums から、n を抜き出す
 *
 * @param {number} 抜き出す数値
 * @param {number []} 元の配列
 *
 * @return {number []} 抜き出した後の配列
 */
const use_num = (n, nums) => {
    console.log(`use_num(${n},[${nums}])`);
    const i = nums.indexOf(n);
    if ( i < 0 ) {
        return nums;
    }
    let nums1 = nums.concat(); // copy array
    nums1.splice(i,1); // 配列の要素を抜く
    return nums1;
}; // use_num()

/**
 * 配列 nums に含まれる数値を組み合わせて合算し、
 * target にすることができるかどうか判定する
 *
 * 再帰呼出しを使って、全ての組み合わせを判定する
 *
 * @param {number} target 目標の値
 * @param {number[]} nums 利用できる数値の配列
 *
 * @return {boolean} result 判定
 */
const can_make = (target, nums) => {
    const prefix = `can_make(${target},[${nums}])>`;

    // 終了判定
    if ( target == 0 ) {
        console.log(`${prefix} OK(1)`);
        return true;
    }
    if ( target < 0 ) {
        console.log(`${prefix} NG(1)`);
        return false;
    }

    // 一手先を確認
    for (let i=0; i < nums.length; i++) {
        let n1 = nums[i];
        let nums1 = use_num(n1, nums); // 配列 nums から、要素 n1 を抜く
        let remainder = target - n1; // n1 を抜いたときの残りを計算

        let ret = can_make(remainder, nums1); // 再帰呼び出し
        if ( ret ) {
            console.log(`${prefix} OK(2)`);
            return true;
        }
    } // for()

    console.log(`${prefix} NG(2)`);
    return false;
}; // can_make()

/**
 *
 */
const init_buttons = () => {
    button_obj = [];
    
    button_id.forEach(id => {
        const obj = new MyButton(id);
        button_obj.push(obj);
        obj.el.style.backgroundColor = "";
        obj.el.style.opacity = 1;
    });
};

/**
 *
 */
window.onload = () => {
    console.log(`window.onload()> start`);

    TargetObj = new MyBase("target");
    TargetNum = RemainderNum = parseInt(Math.random() * 50 + 5);
    TargetObj.el.value = TargetNum;

    RemainderObj = new MyBase("remainder");
    RemainderObj.set_innerHTML(String(RemainderNum));

    NgCountObj = new MyBase("ng_count");
    set_ng_count(0);

    IconObj = new MyDraggable("icon1");

    init_buttons();

    //setInterval(updateAll, UPDATE_INTERVAL);
}; // window.onload
