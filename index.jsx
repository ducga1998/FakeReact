import fakeReact, { render, Component } from './reactFAKE';

 // jsx build theo cái mà mình import
class Title extends Component {
    componentDidMount() {
        console.log('title');
        console.log(document.getElementById('title'));
    }
    
    render() {
        // console.log("AAA" , console.log())
        return (
            <h1 id="title">{this.props.children}</h1>
        );
    }
}
 const  B  = () => {
     return (
         <h1>Nguyen Dinh Nguyen</h1>
     )
 }
class Test extends Component{
    componentDidMount(){
        console.log("compontent did mount")
    }
     render(){
         return (
             <p> cashuasvc</p>
         )
     }
}
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {counter: 0};
        this.onIncrease = this.onIncrease.bind(this);
        this.onDecrease = this.onDecrease.bind(this);
    }

    componentDidMount() {
        console.log(this)
    }
    

    onIncrease() {
        this.setState({counter: this.state.counter + 1});
    }

    onDecrease() {
        this.setState({counter: this.state.counter - 1});
    }

    render() {
        console.log("thishciasc , ", this)
        const {counter} = this.state;
        return (
            <div>
                <Title>HAAHAAAAA</Title>
                <h1>nguyen minh duc</h1>
                <Test />
                <B />
                <p>
                    <button onClick={this.onDecrease}>-</button>
                    {' '}Counter: {counter}{' '}
                    <button onClick={this.onIncrease}>+</button>
                </p>
            </div>
        );
    }
}
// write code  full class , 
// 
// console.log(window.c)
const A = <h1>cascas</h1>
console.log(<App />)
render(<App/>, document.getElementById('root'));