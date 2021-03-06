import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom'
import { Grid, Form, Button, Segment, Message, Image, Divider } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { loggingIn } from '../redux/actions.js'
import logo from './login-logo.png'
const Cookies = require('cookies-js')


class Login extends Component {

  componentDidMount() {
    document.body.style.background = '#F7C3B6'
  }

  render() {
    return (
      Cookies.get('token') && this.props.currentUser ? <Redirect to='/conversations' /> :
      <div className='padded-top-large'>
        <Grid columns={4} centered style={{paddingTop: '5%'}}>
        <Grid.Row verticalAlign='top'>
          <Grid.Column>
            <Image size='huge' floated='right' src={logo}/>
          </Grid.Column>
          </Grid.Row>
          <Grid.Row verticalAlign='bottom'>
          <Grid.Column >
              <Form
                size='big'
                onSubmit={(e) => {this.props.onSubmit(e.target.username.value, e.target.password.value)}}>
                <Segment stacked>
                  <Form.Input
                    name='username'
                    fluid icon='user'
                    iconPosition='left'
                    placeholder='Username'
                   />
                  <Form.Input
                   name='password'
                   fluid
                   icon='lock'
                   iconPosition='left'
                   placeholder='Password'
                   type='password'
                   style={{background: '#fcefec'}}
                   />
                  <Button
                    style={{backgroundColor: '#37525F', color: '#CEDEDC'}}
                    fluid
                    size='large'
                    type='submit'
                  >Login</Button>
                </Segment>
              </Form>
              <Divider horizontal>Or</Divider>
              <Button
                style={{backgroundColor: '#37525F', color: '#CEDEDC', marginTop: '2%'}}
                fluid
                size='large'
                onClick={this.props.loginAsGuest}
              >Login as guest</Button>
              <Message style={{textAlign: 'center'}}>
                  New to us? <Link style={{color: '#37525F'}} to='/signup'>Sign up</Link>
              </Message>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    currentUser: state.userData
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onSubmit: (username, password) => {dispatch(loggingIn(username, password))},
    loginAsGuest: () => {dispatch(loggingIn('guest', '123'))}
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Login)
