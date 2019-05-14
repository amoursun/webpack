import {observable, action} from 'mobx';

class State {
    @observable title = '我是 Hello World'
}

export default new State();

