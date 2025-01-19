// 深度克隆
function cloneDeep(value) {
  const map = new Map();

  function _clone(value) {
    if (typeof value !== 'object') {
      return value
    }

    if (map.get(value)) {
      return map.get(value)
    }

    const result = Array.isArray(value)

    for (const [key, val] of Object.entries(value))
      result[key] = _clone(val)

    map.set(value, value)
  }

  return _clone(value)
}

// 实现 transform 函数：

function transform(obj) {
  return; //....
}

transform({
  'A': 1,
  'B.C': 2,
  'B.D.E': 3,
  'CC.DD.EE': 4,
});

// 得到：
const result = {
  A: 1,
  B: {
    C: 2,
    D: {
      E: 3,
    },
  },
  CC: {
    DD: {
      EE: 4,
    },
  },
};

// 实现：TODO
function set(obj, keyPath, value) {
  let i = 0;
  while (i < keyPath.length - 1) {
    const key = keyPath[i];
    const current = obj[key];
    if (current === undefined) {
      obj[key] = {};
    }
    obj = obj[key];
    i++;
  }

  obj[keyPath[i]] = value;
}

function myTransform(obj) {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    set(result, key.split('.'), value);
  }
  return result;
}

// 实现 Monkey 函数，运行后得到下面的输出。

Monkey('Alan').eat('Banana').sleep(4).eat('Apple').sleep(5).eat('Pear');
// my name is Alan
// I eat Banana
// 等待 4s
// I eat Apple
// 等待 5s
// I eat Pear

// 实现：TODO
function Monkey(name) {
  console.log(`my name is ${name}`);
  const queue: Function[] = [];
  let waiting = 0;
  let running = false;

  const result = {
    eat(fruit) {
      const sleepTime = waiting;
      if (waiting !== 0) {
        waiting = 0;
      }

      const task = () => {
        running = true;
        if (sleepTime !== 0) {
          console.log(`等待 ${sleepTime}s`);
        }

        setTimeout(() => {
          console.log(`I eat ${fruit}`);
          running = false;

          if (queue.length > 0) {
            const frontTask = queue.shift();
            frontTask?.();
          }
        }, sleepTime * 1000);
      };

      if (running === false) {
        task();
      } else {
        queue.push(task);
      }
      return result;
    },

    sleep(seconds) {
      waiting += seconds;
      return result;
    },
  };
  return result;
}

// 使用栈实现队列
// 和 leetcode 原题不一样的是多了个时间复杂度要求为常数级的 printMin 方法：
class Queue {
  put() {}
  take() {}
  size() {}
}

class Stack {
  constructor() {
    this.queue = new Queue();
    this.min = Infinity;
  }

  push(value) {
    this.queue.put(value);
    if (value < this.min) {
      this.min = value;
    }
  }

  pop() {
    let top;
    let min = Infinity;
    for (let i = 0, len = this.queue.size(), last = len - 1; i < len; i++) {
      const front = this.queue.take();
      if (i < last) {
        if (front < min) {
          min = front;
        }
        this.queue.put(front);
      } else {
        top = front;
      }
    }
    this.min = min;
    return top;
  }

  // 要求常数级
  printMin() {
    if (this.queue.size() === 0) {
      throw new Error('Stack is empty!');
    }
    return this.min;
  }
}

// parseHtml
const input = '<div><div>6</div><h1> Title </h1><p>Some description. </p></div>';
function parseHtml(html: string): any {
  // 实现...
}
console.log(JSON.stringify(parseHtml(input), null, 4));
// {
//     "tagName": "div",
//     "children": [
//         {
//             "tagName": "div",
//             "children": [
//                 "6"
//             ]
//         },
//         {
//             "tagName": "h1",
//             "children": [
//                 "Title"
//             ]
//         },
//         {
//             "tagName": "p",
//             "children": [
//                 "Some description."
//             ]
//         }
//     ]
// }

// 实现：
function findCloseTagIndex(html: string, openTag: string, closeTag: string) {
  const tagRegexp = new RegExp(`${openTag}|${closeTag}`, 'g');
  let match = tagRegexp.exec(html);
  let openTagCount = 0;
  let closeTagCount = 0;
  while (match) {
      if (match[0].includes('/')) {
          closeTagCount++;
      } else {
          openTagCount++;
      }

      if (closeTagCount === openTagCount) {
          return match.index;
      }
      match = tagRegexp.exec(html);
  }
  return -1;
}

const input = '<div><div>6</div><h1> Title </h1><p>Some description. </p></div>';

function parseHtml(html: string): any {
  const elements = [];
  const openTagRegexp = /^<(\w+)>/;

  while (html.length) {
      const match = html.match(openTagRegexp);
      if (match) {
          const openTag = match[0];
          const tagName = match[1];
          const closeTag = `</${tagName}>`;
          // 需要考虑子节点标签和父标签相同的情况，所以不能 closeTagIndex = html.indexOf(closeTag)
          const closeTagIndex = findCloseTagIndex(html, openTag, closeTag);
          const childrenHtml = html.slice(openTag.length, closeTagIndex);
          // console.log({
          //     openTag,
          //     closeTag,
          //     childrenHtml,
          // });
          html = html.slice(closeTagIndex + closeTag.length);
          const children = parseHtml(childrenHtml);
          const element = {
              tagName,
              children: Array.isArray(children) ? children : [children],
          };
          elements.push(element);
      } else {
          const trimmed = html.trim();
          if (trimmed.length !== 0) {
              elements.push(trimmed);
              break;
          }
      }
  }

  if (elements.length === 1) {
      return elements[0];
  }

  if (elements.length > 1) {
      return elements;
  }

  return null;
}

// 实现2:
function parseHtml(html) {
  const stack = [];
  const result = [];

  let i = 0;
  while (i < html.length) {
    if (html[i] === '<') {
      const tagStart = i;
      while (html[i] !== '>') {
        i++;
      }
      const tagEnd = i;
      const tag = html.substring(tagStart + 1, tagEnd);

      if (tag[0] === '/') {
        stack.pop();
      } else {
        const newNode = {
          tagName: tag,
          children: []
        };

        if (stack.length > 0) {
          const parent = stack[stack.length - 1];
          parent.children.push(newNode);
        } else {
          result.push(newNode);
        }

        stack.push(newNode);
      }
    } else {
      const textStart = i;
      while (html[i] !== '<') {
        i++;
      }
      const textEnd = i;
      const text = html.substring(textStart, textEnd).trim();

      if (text.length > 0 && stack.length > 0) {
        const parent = stack[stack.length - 1];
        parent.children.push(text);
      }
    }

    i++;
  }

  return result;
}

// 测试
const input = '<div><div>6</div><h1> Title </h1><p>Some description. </p></div>';
console.log(JSON.stringify(parseHtml(input), null, 4));

// 查找循环依赖
// 依赖树：

const tree: Record<string, string[]> = {
    A: ['B', 'C'],
    B: ['D', 'E'],
    C: ['A'],
    D: ['A'],
};

// 输出依赖树中的循环依赖：

[
  ['A', 'B', 'D'],
  ['A', 'C'],
];

// 答案：

function findCirclesInDependencies() {
    const circles: string[][] = [];
    const depsInCircle = new Set<string>();
    const dfs = (parentPath: Set<string>, pkg: string) => {
        if (parentPath.has(pkg)) {
            const newCircle = [...parentPath];
            circles.push(newCircle);
            for (const dep of newCircle) {
                depsInCircle.add(dep);
            }
        } else {
            for (const dep of tree[pkg] ?? []) {
                dfs(new Set([...parentPath, pkg]), dep);
            }
        }
    };

    for (const pkg of Object.keys(tree)) {
      // 避免重复
      if (!depsInCircle.has(pkg)) {
          dfs(new Set(), pkg);
        }
    }

    return circles;
}

