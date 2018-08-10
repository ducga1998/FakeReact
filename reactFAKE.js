
(() => { 

const createElement = (type, props, ...children) => {
    if (props === null) props = {};
    return {type, props, children};
};
  // a 
const setAttribute = (dom, key, value) => {
    if (typeof value == 'function' && key.startsWith('on')) {
        const eventType = key.slice(2).toLowerCase();
        dom._FakeReactHandlers = dom._FakeReactHandlers || {};
        dom.removeEventListener(eventType, dom._FakeReactHandlers[eventType]);
        console.dir(dom)
        dom._FakeReactHandlers[eventType] = value;
        dom.addEventListener(eventType, dom._FakeReactHandlers[eventType]);
    } else if (key == 'checked' || key == 'value' || key == 'className') {
        dom[key] = value;
    } else if (key == 'style' && typeof value == 'object') {
        Object.assign(dom.style, value);
    } else if (key == 'ref' && typeof value == 'function') {
        value(dom);
    } else if (key == 'key') {
        dom._FakeReactKey = value;
    } else if (typeof value != 'object' && typeof value != 'function') {
        dom.setAttribute(key, value);
    }
};

const render = (vdom, parent=null) => {
    const mount = parent ? (el => parent.appendChild(el)) : (el => el);
    if (typeof vdom == 'string' || typeof vdom == 'number') {
        return mount(document.createTextNode(vdom));
    } else if (typeof vdom == 'boolean' || vdom === null) {
        return mount(document.createTextNode(''));
    } else if (typeof vdom == 'object' && typeof vdom.type == 'function') {
        // Với Trường này thì sẽ phải đệ quy đến khi nào hết cái vdom.type == 'function ' thì thôi, vì nó đang ở trạng thái class, 
        // chúng ta phải mò vào bên trong hàm render của component , lấy dom nó ra là check cái dom của nó tiếp
        console.log("check vdom.type function", vdom.type)
        // if vdom.type is class
        return Component.render(vdom, parent);
    } else if (typeof vdom == 'object' && typeof vdom.type == 'string') {
        // if vdom.type is string => return dom .. this case only return dom
        const dom = mount(document.createElement(vdom.type));
        console.log("vdom.type string" , vdom)
        //backtrack algo
        for (const child of [].concat(...vdom.children)) render(child, dom);
        for (const prop in vdom.props) setAttribute(dom, prop, vdom.props[prop]);
        console.log("fullll " , dom)
        return dom;
    } else {
        throw new Error(`Invalid VDOM: ${vdom}.`);
    }
};
// path x
const patch = (dom, vdom, parent=dom.parentNode) => {
    console.log("tesst dom ", dom , "tesst vdom ", vdom , "parent" , parent)
    const replace = parent ? el => (parent.replaceChild(el, dom) && el) : (el => el);
    // case vdom.type is class , and vdom object
    if (typeof vdom == 'object' && typeof vdom.type == 'function') {
        return Component.patch(dom, vdom, parent);
    } 
    else if (typeof vdom != 'object' && dom instanceof Text) {
        return dom.textContent != vdom ? replace(render(vdom, parent)) : dom;
    } 
    else if (typeof vdom == 'object' && dom instanceof Text) {
        return replace(render(vdom, parent));
    } 
    else if (typeof vdom == 'object' && dom.nodeName != vdom.type.toUpperCase()) {
        return replace(render(vdom, parent));
    } 
    else if (typeof vdom == 'object' && dom.nodeName == vdom.type.toUpperCase()) {
        const pool = {};
        const active = document.activeElement;
        [].concat(...dom.childNodes).map((child, index) => {
            const key = child._FakeReactKey || `index_${index}`;
            pool[key] = child;
        });
        [].concat(...vdom.children).map((child, index) => {
            const key = child.props && child.props.key || `__index_${index}`;
            dom.appendChild(pool[key] ? patch(pool[key], child) : render(child, dom));
            delete pool[key];
        });
        for (const key in pool) {
            const instance = pool[key]._FakeReactInstance;
            if (instance) instance.componentWillUnmount();
            pool[key].remove();
        }
        //backtrack algo
        for (const attr of dom.attributes) dom.removeAttribute(attr.name);
        for (const prop in vdom.props) setAttribute(dom, prop, vdom.props[prop]);
        active.focus();
        return dom;
    }
};
// hàm render sử dụng Component render 

// render static là hàm sẽ check  và lấy dom tử các hàm render trong các class , 

class Component {
    constructor(props) {
        this.props = props || {};
        this.state = null;
    }


    static render(vdom, parent=null) {
        //spead props , and vdom children => cũng là
          const props = Object.assign({}, vdom.props, {children: vdom.children});
          console.log("vdom . type " , vdom.type)
        if (Component.isPrototypeOf(vdom.type)) {
            const instance = new (vdom.type)(props); // instance is vdom 
            console.log("instance"  ,instance)
            // if(instance._FakeReactClass.getDerivedStateFromProps){
            //     instance._FakeReactClass.getDerivedStateFromProps(this.props, this.state)
            // }
           
           //save object base in instance, why ??
           // save instance in base, when setState , we will use object base get instance 
            instance.base = render(instance.render(), parent);
            // save instance and key
            instance.base._FakeReactClass  = vdom.type
            instance.base._FakeReactInstance = instance;
            instance.base._FakeReactKey = vdom.props.key;
            instance.componentDidMount();
            console.log("instance.base "  , instance.base)
            return instance.base;
        } else {
            // TH nó là function chẳng hạn mà ko phải là một class extends Component
            return render(vdom.type(props), parent);
        }
    }
    // static render(vdom , parent = null) {
    //     const props = Object.assign({} ,  vdom.props, {children : vdom.children})
    //     if(Component.is )
    // }
    // mỗi dom sẽ lưu các thông tin nha instance , key
    static patch(dom, vdom, parent=dom.parentNode) {
        const props = Object.assign({}, vdom.props, {children: vdom.children});
        if (dom._FakeReactInstance && dom._FakeReactInstance.constructor == vdom.type) {
            // Component.getDerivedStateFromProps(props, this.state);
            dom._FakeReactInstance.props = props;
            return patch(dom, dom._FakeReactInstance.render(), parent);
        } else if (Component.isPrototypeOf(vdom.type)) {
            const ndom = Component.render(vdom, parent);
            return parent ? (parent.replaceChild(ndom, dom) && ndom) : (ndom);
        } else if (!Component.isPrototypeOf(vdom.type)) {
            return patch(dom, vdom.type(props), parent);
        }
    }
    // static patch(dom , vdom , parent = dom.parentNode) {
    //     const props  = Object.assign({}, vdom.props , { children : vdom.children})
    //     // if(dom._FakeReactInstance && dom._FakeReactInstance.con)
    // }
    setState(next) {
            // check state is object and is  para object ??
        const compat = (a) => typeof this.state == 'object' && typeof a == 'object';
         // i want getDerivedStateFromProps check update
        if (this.base ) {
            if(this.base._FakeReactClass.getDerivedStateFromProps && this.base._FakeReactClass.getDerivedStateFromProps(this.state, this.props) ){
                const prevState = this.state;
                this.state = compat(next) ? Object.assign({}, this.state, next) : next; //new state
                this.shouldComponentUpdate(this.props ,this.state )
                patch(this.base, this.render()); // process render
                this.getSnapshotBeforeUpdate(this.props ,prevState )
                this.componentDidUpdate(this.props, prevState);
            }
            else if(this.base._FakeReactClass.getDerivedStateFromProps && !this.base._FakeReactClass.getDerivedStateFromProps(this.state, this.props)){

            }
            else if(Component.getDerivedStateFromProps(this.props, this.state)){
                const prevState = this.state;
                this.state = compat(next) ? Object.assign({}, this.state, next) : next; //new state
                this.shouldComponentUpdate(this.props ,this.state )
                patch(this.base, this.render()); // process render
                this.getSnapshotBeforeUpdate(this.props ,prevState )
                this.componentDidUpdate(this.props, prevState);
            }

            
            // if(this.base._FakeReactClass.getDerivedStateFromProps){
            //     this.base._FakeReactClass.getDerivedStateFromProps(this.props, this.state)
            // }
            // else{
            //     Component.getSnapshotBeforeUpdate(nextProps , preState)
            // }
            // f
            
        } else {
            this.state = compat(next) ? Object.assign({}, this.state, next) : next;
        }
    }

    getSnapshotBeforeUpdate(prevProps, prevState) {
        return nextProps != this.props || nextState != this.state;
    }

    static getDerivedStateFromProps(nextProps , preState) {
        return true;
    }

    shouldComponentUpdate(nextState, nextProps){
        return undefined;
    }
    componentDidUpdate(prevProps, prevState) {
        return undefined;
    }


    componentDidMount() {
        return undefined;
    }

    componentWillUnmount() {
        return undefined;
    }
};
console.log(module)
module.exports = {createElement, render, Component};

// if (typeof module == 'undefined') window.Gooact  = {createElement, render, Component};
})(); 
// class A extends Shape {
//     constructor(a ,b) {
//         super(a, b);
//         this.AA  = a
//         this.BB = b
//     }
// }
// function A ( AA ,BB){

// }
// A.prototype.AAA   = function (x, y) {
//     return "ABDVJB"
// }
// var B = function( C,b) {
//     A.call(x,y)
// }
// B.prototype = Object.create(A.prototype)

