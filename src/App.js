import React, {Component} from 'react';
import axios from 'axios';
import LinearProgress from '@material-ui/core/LinearProgress';

class App extends Component {

    constructor(props) {
            super(props);
            this.state = {
                items: [],
                typingItem: ''
            }
        this.handleChange = this.handleChange.bind(this)
        this.handleButton = this.handleButton.bind(this)
        this.handleChangeCheckbox = this.handleChangeCheckbox.bind(this)
    }

    componentDidMount() {
        this.getItems();
    }

    getItems() {
        axios.get('http://127.0.0.1:8000/api/items?order[isChecked]')
            .then(response => response.data)
            .then(data => this.setState({
                items : data['hydra:member']
            }))
    }

    handleButton() {
        axios.post('http://127.0.0.1:8000/api/items', {
            name: this.state.typingItem,
            isChecked: false,
            category: 'api/categories/1'
        })
            .then(response => {
                this.getItems();
                this.setState({
                    typingItem: ''
                })
            })
    }

    handleChange(event) {
        this.setState({
            typingItem: event.target.value
        })
    }

    handleChangeCheckbox(event) {
        axios.put('http://127.0.0.1:8000/api/items/' + event.target.value, {
            name: event.target.getAttribute('data-name'),
            isChecked: event.target.checked,
            category: '/api/categories/1'
        })
            .then( response => {
                this.getItems();
            })
            .catch(error => console.log(error))
    }

    getCheckedRate()
    {
        let items = this.state.items;
        let occurence = 0;

        for (let i=0; i < items.length; i++) {
            if (items[i].isChecked) {
                occurence++;
            }
        }
        return occurence / items.length * 100;
    }

    render() {
        const InputItem = () => {
            return (
                <div>
                    <input autoFocus onChange={this.handleChange} type="text" value={this.state.typingItem} />
                    <button onClick={this.handleButton}>OK</button>
                </div>
            )
        }

        const {items} = this.state;
        return (
            <div>
                <LinearProgress
                    variant='determinate'
                    value={this.getCheckedRate()}
                />
                <InputItem />
              <ul>
                  {
                      items.map((item, i) =>
                          <li key={i}>
                              <input data-name={item.name} checked={item.isChecked} value={item.id} type="checkbox" id={'check-' + i} onChange={this.handleChangeCheckbox} />
                              <label htmlFor={'check-' + i}>
                                  {item.name}
                              </label>

                          </li>
                  )
                  }
              </ul>
            </div>
        )
    }
}
export default App;
