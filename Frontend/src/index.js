import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


/**
 * Detail Component
 */
class ContactDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = props.selectedContact
  }
  
  componentWillReceiveProps(nextProps) {
    this.setState(nextProps.selectedContact);
  }
  
  handleInputChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  
  updateContactList(e) {
    e.preventDefault();
    this.props.updateContactList(this.state);
  }
  
  render() {
    return <div className="detail">
      <div className="header">
        <div className="body">New Contact</div>
      </div>
      <form onSubmit={(e) => this.updateContactList(e)}>
        <div className="form-group">
          <label htmlFor="Name">Name</label>
          <input 
            type="text"
            id="Name" 
            name="Name"
            value={this.state.Name} 
            onChange={(e) => this.handleInputChange(e)} 
          />
        </div>
        <div className="form-group">
          <label htmlFor="Phone">Phone</label>
          <input 
            type="text"
            id="Phone"
            name="Phone"
            value={this.state.Phone} 
            onChange={(e) => this.handleInputChange(e)} 
          />
        </div>
        <div className="action">
          <input type="submit" className="btn" value={this.props.selectedContact._id ? 'Update' : 'Save'} />
        </div>
      </form>
    </div>
  }
}


/**
 * Main App
 */
class App extends React.Component {
  constructor(props) {
    super(props);
    this.emptyContact = {
      _id: '',
      Name: '',
      Phone: ''
    };
    this.state = {
      contacts: [],
      selectedContact: this.emptyContact,
      loading: true
    }
  }
  
  componentDidMount() {
    this.getContacts();
  }
  
  
  fixedEncodeURIComponent(str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
      return '%' + c.charCodeAt(0).toString(16);
    });
  }
  
  toFormData(contact) {
    let array = [];
    for (let prop in contact) {
      array.push(`${prop}=${this.fixedEncodeURIComponent(contact[prop])}`);
    }
    return array.join('&');
  }
  
  async getContacts() {
    
    try {
      this.setState({loading: true});
      let response = await fetch(this.props.config.apiUrl);
      let responseJson = [];
      console.log(response)
      try {
        responseJson = await response.json();
        console.log(responseJson);
        this.setState({ 
          contacts: responseJson,
          selectedContact: this.emptyContact,
          loading: false
        });
      } catch (error) {
        console.log(error);
        responseJson = [];
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  async updateContactList(updatedContact) {
    this.setState({loading: true});
    try {
      await fetch(this.props.config.apiUrl, {
        method: 'POST',
        headers: {
          "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: this.toFormData(updatedContact)
      });
      this.getContacts();
    } catch (error) {
      console.log(error);
    }
  }
  
  render() {
    return <div>
      <header>
        <div className="body">Contacts</div>
      </header>
      <div className="container">
        <main>
          <div className="list">
            { this.state.contacts.length ? '' : 'No contacts' }
            <ul>
              <li key="table head">
                <a >
                  <span>{"NAME"}</span> 
                  <span>{"PHONE"}</span> 
                  <i className="fa fa-arrow-right"></i>
                </a>
              </li>
              { this.state.contacts.map(contact => 
                   <li key={contact._id}>
                      <a>
                        <span>{contact.Name}</span> 
                        <span>{contact.Phone}</span> 
                        <i className="fa fa-arrow-right"></i>
                      </a>
                   </li>
               )}
            </ul>
          </div>
          <ContactDetail
            selectedContact={this.state.selectedContact}
            updateContactList={(contact) => this.updateContactList(contact)} />
        </main>
      </div>
      <div className={this.state.loading ? 'loading show' : 'loading'}>
        <div className="loading-gif"></div>&nbsp;loading...
      </div>
    </div>
  }
}

const config = {
  apiUrl: "http://localhost:8000/"
};

ReactDOM.render(
    <App config={config}/>,
    document.getElementById('root')
  );