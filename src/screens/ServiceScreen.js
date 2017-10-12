import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import t from 'tcomb-form-native';
import { ScrollView } from 'react-native';
import { Button } from 'react-native-elements';


import Style from '../Style';
import { Group, Service } from '../Models';
import { addService } from '../redux/actions';


const Form = t.form.Form;
class ServiceScreen extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props.navigation.state.params);
    this.state = { value: {
      service: this.props.navigation.state.params.service.service,
      username: this.props.navigation.state.params.service.username,
      group: this.props.navigation.state.params.service.group,
    },
    };

    this.onPress = this.onPress.bind(this);
    this.onChange = this.onChange.bind(this);

    // here we are: define your domain model
    this.InputService = t.struct({
      service: t.String,
      username: t.String,
      group: t.String,
    });

    // this.onImport = this.onImport.bind(this);
  }

  componentWillMount() {
    console.log(this.state);
    this.setState({
      canAddService: false,
    });
  }

  onPress() {}

  onChange() {}

  render() {
    return (
      <Form
        ref={(c) => { this.form = c; }}
        type={this.InputService}
        value={this.state.value}
        onChange={this.onChange}
        options={{
          fields: {
            service: {
              placeholder: 'example.com',
            },
            username: {
              label: 'Username or email',
              placeholder: 'mempa',
            },
            group: {
              placeholder: 'default',
              // nullOption: false,
            },
          },
        }}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    services: (state.secrets && state.secrets.services) || [],
    groups: (state.secrets && state.secrets.groups) || [],
  };
}

ServiceScreen.propTypes = {
  dispatch: PropTypes.func.isRequired,
  groups: PropTypes.arrayOf(PropTypes.instanceOf(Group)).isRequired,
  /* eslint react/forbid-prop-types:off */
  navigation: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(ServiceScreen);
