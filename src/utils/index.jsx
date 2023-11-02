//样式名称合并
export const clsnames = (...args) => {
    return args.filter(p => typeof p === 'string' && p.trim()).join(' ')
}
//根据平层数据组装为树形数据
export const cloneTree = (score, parentId = "0") => {
    let tree = []
    score.map(item => {
        if (item.parentCode === parentId) {
            item.children = cloneTree(score, item.itemCode)
            tree.push(item)
        }
    })
    return tree;
}
export const appendScript = (url) => {
    let head = document.getElementsByTagName("head")[0];
    let script = document.createElement("script");
    script.src = url;
    script.type = "text/javascript";
    head.appendChild(script);
}
export const appendLink = (url) => {
    let head = document.getElementsByTagName("head")[0];
    let link = document.createElement("link");
    link.href = url;
    link.rel = "stylesheet";
    head.appendChild(link);
};
export const getUrlParam = (name) => {
    let getPath =  window.location.search;
    const reg = new RegExp("(^|&|\\?)" + name + "=([^&]*)(&|$)");
    const r = getPath.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    } else {
        const getPaths =  window.location.hash;
        const l = getPaths.substr(1).match(reg);
        if (l != null) {
            return unescape(l[2]);
        }
    }
    return "";
};


/**
 * 拖拽事件获取数据
 * @param{*}ev
 */
export const getDragData = ev => {
    let jsonStr;
    const isIE = !!window.ActiveXobject || "ActiveXObject" in window;
    if (isIE) {
        jsonStr = ev.dataTransfer.getData("text");
    } else {
        jsonStr = ev.dataTransfer.getData("data");
    }


    if (!jsonStr) return {};


    try {
        const data = JSON.parse(jsonStr) || {};


        // console.log('[getDragData]', data);


        return data;
    } catch (error) {
        console.log(error);
        return {};
    }
};
/**
 * 拖拽事件赋值
 * @param{*}e 事件
 * @param{*}key 键值
 * @param{*}value 属性值
 */
export const draftEvent = (e, key, value) => {
    const isIE = !!window.ActiveXobject || "ActiveXObject"in window; //判断是否IE浏览器
    //判断是否是IE
    if (isIE) {
        const data = e.dataTransfer.getData("text");
        const arr = data ? JSON.parse(data) : {};
        arr[key] = value;
        e.dataTransfer.setData("text", JSON.stringify(arr));
    } else {
        const data = e.dataTransfer ? e.dataTransfer.getData("data") : {};
        const arr = data ? JSON.parse(data) : {};
        arr[key] = value;
        e.dataTransfer.setData("data", JSON.stringify(arr));
    }
};
/**
 * 拖拽事件取值
 * @param{*}e 事件
 * @param{*}key 键值
 * @param{*}value 属性值
 */
export const dropEvent = (e) => {
    const isIE = !!window.ActiveXobject || "ActiveXObject" in window; //判断是否IE浏览器
    let data = {};
    console.log('e.data',e)

    console.log('e.dataTransfer.getData("data")',e.dataTransfer.getData("data"))
    //判断是否是IE
    if (isIE) {
        data = JSON.parse(e.dataTransfer.getData("text"));
    } else {
        data = JSON.parse(e.dataTransfer.getData("data"));
    }
    return data
};
//深度判断对象是否相等
// 返回值：true 相同 ；false 有差异
export const diffObj = (obj1, obj2) => {
    // return _.isEqual(obj1, obj2);
}
// 生成UUID
export const getUuid = () => {
    let s = [];
    let hexDigits = "0123456789abcdef";
    for (let i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";


    let uuid = s.join("");
    return uuid;
};
// 初始化PC区域数据
export const createArea = ({ type,key }) => {
    const newArea = { type,key };
    console.log('type', type)
    console.log('newArea', newArea)
    if (!newArea) return;
    return {
        ...newArea,
    }
}
export function debounce(func, delay) {
    let timerId;
  
    return function (...args) {
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }
  /**
 * 解释拖拽行为
 * @param {*} position
 */
  export const explainDragAction = (position) => {
    let isCover = false,
        isAdd = false,
        isFirst = false,
        isVertical = false;
    switch (position) {
        case "center":
            isCover = true;
            break;
        case "top":
            isVertical = true;
            isAdd = true;
            isFirst = true;
            break;
        case "left":
            isAdd = true;
            isFirst = true;
            break;
        case "right":
            isAdd = true;
            break;
        case "bottom":
            isVertical = true;
            isAdd = true;
            break;
        default:
            console.warn("请检查拖拽[position]参数");
    }
    return { isCover, isAdd, isFirst, isVertical };
}
export const treeNodeChange = (data, key, callback) => {
    //查找id符合的函数
    data.forEach((item, index, arr) => {
        if (item.id === key) {
            return callback(item, index, arr);
        }
        if (item.childList) {
            return treeNodeChange(item.childList, key, callback);
        }
    });
};
/**
 * 创建窗格容器
 * @param {*} containerId
 * @param {*} childList
 */
export const createEmptyPane = (
    containerId,
    width = 100,
    height = 100,
    pid,
    type,
    key,
    childList = [
        createArea({type,key})
    ]
) => ({
    id: containerId,
    width,
    height,
    pid,
    childList,
});
