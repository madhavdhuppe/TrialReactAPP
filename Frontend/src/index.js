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
  
  newContact(e) {
    e.preventDefault();
    this.props.newContact(this.state);
  }
 
  render() {
    return <div className="detail">
      <div className="header">
        <div className="body">New Contact</div>
      </div>
      <form >
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
        <div className="action" onClick={(e) => this.newContact(e)}>
          <input type="submit" className="btn" value="Add New Contact" />
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
    
  async getContacts() {
    try {
      this.setState({loading: true});
      let response = await fetch(this.props.config.apiUrl);
      let responseJson = [];
      try {
        responseJson = await response.json();
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
  
  async updateContactList() {
    console.log("updateContactList") ;
    this.setState({loading: true});
    try {
      await fetch(this.props.config.apiUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.state.contacts)
      });

      this.getContacts();
    } catch (error) {
      console.log(error);
    }
  }

  newContact(contact)
  {
    try {
      var ab = {
        _id: this.state.contacts.length,
        Name: contact.Name, 
        Phone: contact.Phone
      }
      console.log(ab);

      this.state.contacts[this.state.contacts.length] = ab;
      this.setState({ 
        contacts: this.state.contacts
      });
    } catch (error) {
      console.log(error);
    }
  }
  
  render() {
    return <div>
      <header>
        <div className="body">Contacts</div>
      </header>
      <form onSubmit={(e) => this.updateContactList(e)}>
        <div className="container">
          <main>
            <div className="list">
              { this.state.contacts.length ? '' : 'No contacts' }
              <ul>
                <li key="table head">
                  <a>
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
              newContact={(contact) => this.newContact(contact)} />
          </main>
          <div className="action" >
            <input type="submit" className="btn" value="SUBMIT" />
        </div>
        </div>
      </form>
      <div className={this.state.loading ? 'loading show' : 'loading'}>
        <div className="loading-gif"></div>&nbsp;loading...
      </div>
    </div>
  }
}

const config = {
  apiUrl: "http://localhost:8080/"
};

ReactDOM.render(
    <App config={config}/>,
    document.getElementById('root')
  );