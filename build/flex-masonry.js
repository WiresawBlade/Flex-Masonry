"use strict";
/**
 * Flex Masonry
 * @author @WiresawBlade
 * @version 1.0
 * @license MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlexMasonry = void 0;
var FlexMasonry = /** @class */ (function () {
    function FlexMasonry(options) {
        var _this = this;
        this.columnContainers = [];
        this.columnSelector = ".masonry-column";
        this.columnsHeight = [];
        options = parseOptions(options);
        this.container = (function () {
            if (typeof options.container === "string") {
                _this.containerSelector = options.container;
                var _container = document.querySelector(options.container);
                if (_container) {
                    return _container;
                }
                else {
                    throw new Error("Can't find container element.");
                }
            }
            else {
                return options.container;
            }
        })();
        this.items = (function () {
            if (typeof options.items === "string") {
                _this.itemsSelector = options.items;
                var _items = document.querySelectorAll(options.items);
                if (_items) {
                    return Array.from(_items);
                }
                else {
                    throw new Error("Can't find items element.");
                }
            }
            else {
                return options.items;
            }
        })().map(function (el) {
            el.style.visibility = "hidden";
            return { element: el, cachedHeight: el.clientHeight };
        });
        this.columnWidth = options.columnWidth;
        if (options.gap) {
            if (Array.isArray(options.gap)) {
                this.gap = options.gap;
            }
            else {
                this.gap = [options.gap, options.gap];
            }
        }
        else {
            this.gap = [0, 0];
        }
        this.columns = 0;
        this.options = options;
        this.initStyle();
        if (options.autoExec)
            this.exec();
    }
    FlexMasonry.prototype.initStyle = function () {
        this.container.style.display = "flex";
        this.container.style.alignItems = "flex-start";
        this.container.style.justifyContent = "center";
        this.container.style.gap = "".concat(this.gap[0], "px");
    };
    /** 执行布局 */
    FlexMasonry.prototype.exec = function () {
        this.calcColumns();
        var originalPosition = window.scrollY || window.pageYOffset;
        this.calc();
        this.layout();
        if (this.options.fixScrollOffset)
            window.scrollTo(0, originalPosition);
    };
    /** 仅计算布局 */
    FlexMasonry.prototype.calc = function () {
        var _this = this;
        this.columnsHeight = Array(this.calcColumns()).fill(0);
        var fragment = document.createDocumentFragment();
        this.columnContainers.length = 0;
        for (var i = 0; i < this.columns; i++) {
            this.columnContainers.push(fragment.appendChild(createNewElement("div", {
                class: this.columnSelector.substring(1)
            })));
        }
        this.columnContainers.forEach(function (ccontainer) {
            ccontainer.style.display = "flex";
            ccontainer.style.flexDirection = "column";
            ccontainer.style.gap = "".concat(_this.gap[1], "px");
        });
        this.items.forEach(function (el) {
            _this._appendElement(el);
        });
        this.fragment = fragment;
    };
    /**
     * 仅应用布局
     *
     * 调用该函数前需要已经至少计算过一次布局
     */
    FlexMasonry.prototype.layout = function () {
        if (this.fragment) {
            this.container.appendChild(this.fragment);
            this.removeUnusedColumns();
        }
        else {
            throw Error("Never conducted layout calculations before. You should use exec() or calc() first.");
        }
    };
    FlexMasonry.prototype.removeUnusedColumns = function () {
        var _col = this.container.querySelectorAll(this.columnSelector);
        _col.forEach(function (col) {
            if (col.children.length === 0)
                col.remove();
        });
    };
    /**
     * 清空布局中的所有 `items`
     *
     * 该操作并不会将元素从文档中移除
     */
    FlexMasonry.prototype.clear = function () {
        this.items.length = 0;
    };
    /** 仅计算当前需要的列数 */
    FlexMasonry.prototype.calcColumns = function () {
        this.columns = Math.ceil((this.container.clientWidth - this.columnWidth) / (this.columnWidth + this.gap[0]));
        return this.columns;
    };
    /**
     * 向布局中加入元素
     * @param el 要添加的元素
     */
    FlexMasonry.prototype.appendElement = function (el) {
        var masonryElement = {
            element: el,
            cachedHeight: el.clientHeight
        };
        this._appendElement(masonryElement);
        this.items.push(masonryElement);
    };
    FlexMasonry.prototype._appendElement = function (el) {
        var minIndex = this.columnsHeight.indexOf(Math.min.apply(Math, this.columnsHeight));
        this.columnsHeight[minIndex] += el.cachedHeight;
        this.columnContainers[minIndex].appendChild(el.element);
        el.element.style.visibility = "visible";
    };
    /**
     * 在原有子项的基础上追加子项
     * @param newItems 要添加的新元素，接受 CSS选择器
     */
    FlexMasonry.prototype.append = function (newItems) {
        var _this = this;
        var appended = (function () {
            if (newItems) {
                if (typeof newItems === "string") {
                    var _items = document.querySelectorAll(newItems);
                    return Array.from(_items);
                }
                else {
                    return newItems;
                }
            }
            else {
                if (_this.itemsSelector) {
                    var _items = Array.from(document.querySelectorAll(_this.itemsSelector));
                    var appendCount = _items.length - _this.items.length;
                    if (appendCount > 0) {
                        var _appended = _items.slice(-appendCount);
                        return _appended;
                    }
                }
            }
        })();
        if (appended) {
            appended.forEach(function (el) {
                _this.appendElement(el);
            });
        }
    };
    FlexMasonry.prototype.refreshContainer = function () {
        if (this.containerSelector) {
            var newContainer = document.querySelector(this.containerSelector);
            if (newContainer) {
                this.container = newContainer;
            }
        }
    };
    return FlexMasonry;
}());
exports.FlexMasonry = FlexMasonry;
function parseOptions(options) {
    options.gap = options.gap || 0;
    options.autoExec = options.autoExec === undefined ? true : options.autoExec;
    options.fixScrollOffset = options.fixScrollOffset === undefined
        ? true
        : options.fixScrollOffset;
    return options;
}
function createNewElement(tag, attrs) {
    var el = document.createElement(tag);
    for (var key in attrs) {
        el.setAttribute(key, attrs[key]);
    }
    return el;
}
