// 记录移动过程中信息
let oldData: unknown = null;
let newData: unknown = null;

export const onDragStart = (item: unknown) => {
  oldData = item;
};

// 记录移动过程中信息
export const onDragEnter = (item: unknown, e: Event) => {
  newData = item;
  e.preventDefault();
};

// 拖拽最终操作
export const onDragEnd = (list: any[]) => {
  if (oldData !== newData) {
    const oldIndex = list.indexOf(oldData);
    const newIndex = list.indexOf(newData);
    const newItems = [...list];
    // 删除老的节点
    newItems.splice(oldIndex, 1);
    // 在列表中目标位置增加新的节点
    newItems.splice(newIndex, 0, oldData);

    list.splice(0, list.length, ...newItems);
  }
};

// 拖动事件（主要是为了拖动时鼠标光标不变为禁止）
export const onDragOver = (event: Event) => {
  event.preventDefault();
};
