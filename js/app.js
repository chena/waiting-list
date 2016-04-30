const FIREBASE_URL = 'https://shining-fire-3000.firebaseio.com';

const WaitList = React.createClass({
  render() {
    let dateFormatter = cell => moment(cell).format('MMM D h:mm A');
    let fulfillment = cell => cell ? 'Yes' : 'No';
    let selectRowProp = {
      mode: 'checkbox',
      clickToSelect: true
    };

    return (
      <BootstrapTable data={this.props.items} striped={true} hover={true} insertRow={true} deleteRow={true} search={true} selectRow={selectRowProp}>
        <TableHeaderColumn dataField="timestamp" isKey={true} dataSort={true} dataFormat={dateFormatter} width="200">Time</TableHeaderColumn>
        <TableHeaderColumn dataField="email" dataSort={true}>Customer Email</TableHeaderColumn>
        <TableHeaderColumn dataField="sku" dataSort={true}>Product SKU</TableHeaderColumn>
        <TableHeaderColumn dataField="fulfilled" dataFormat={fulfillment}>Fulfilled</TableHeaderColumn>
      </BootstrapTable>
    );
  }
});

const WaitListApp = React.createClass({
  mixins: [ReactFireMixin],

  getInitialState() {
    return {
      items: [],
      email: '',
      sku: ''
    };
  },

  componentWillMount() {
    var firebaseRef = new Firebase(`${FIREBASE_URL}/items`);
    this.bindAsArray(firebaseRef.limitToLast(100), 'items');
  },

  onChange(e) {
    this.setState({[event.target.name]: e.target.value});
  },

  removeItem(key) {
    let firebaseRef = new Firebase(`${FIREBASE_URL}/items`);
    firebaseRef.child(key).remove();
  },

  handleSubmit(e) {
    e.preventDefault();
    let data = {
      email : this.refs.email.getDOMNode().value,
      sku : this.refs.sku.getDOMNode().value
    }

    // FIXME: better validation
    if (data.email.trim().length > 0 && data.sku.trim().length > 0) {
      this.firebaseRefs.items.push(Object.assign(data, {
        timestamp: Firebase.ServerValue.TIMESTAMP,
        fulfilled: false
      }));
      this.setState({email: ''});
      this.setState({sku: ''});
    }
  },

  render() {
    return (
      <div className="main">
        <form className="form" onSubmit={this.handleSubmit}>
        <fieldset class="form-group">
          <label className="control-label">Email</label>
          <input className="form-control" type="email" name="email" ref="email" value={this.state.email} onChange={this.onChange} />
          <label className="control-label">Product SKU</label>
          <input className="form-control" type="text" name="sku" ref="sku" value={this.state.sku} onChange={this.onChange}  />
        </fieldset>
        <button className="btn btn-success">Request</button>
        </form>

        <WaitList items={ this.state.items } removeItem={ this.removeItem } />
      </div>
    );
  }
});

ReactDOM.render(<WaitListApp />, document.getElementById('app'));
