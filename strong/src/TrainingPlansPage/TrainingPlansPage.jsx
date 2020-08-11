import React from 'react';
import { config } from '../_constants';
import { authHeader } from '../_helpers';
import Button from 'react-bootstrap/Button'
import TrainingPlanModal  from '../TrainingPlansPage/TrainingPlanModal.jsx';
import { userActions } from '../_actions';
import '../TrainingPlansPage/training_plan.css';

export default class TrainingPlansPage extends React.Component {
  constructor() {
    super();
    this.state = {
      name: '',
      goal: '',
      tag: '',
      submitted: false,
      show: false,
      exercises: [],
      series_types: [],
      sessions: [{name: '', training_positions: [{number_of_repetitions: [1,2], break_after: [], duration: [], exercise_id: "1", position_type: '0'}]}],
      errors: [],
      session_errors: {},
      position_errors: {},
      training_plans: []
    };  
  }

  loadData = () => {
    const requestOptions = {
      method: 'GET',
      headers:  authHeader()
    };

    return fetch(`${config.apiUrl}/api/v1/training_plans`, requestOptions )
      .then(response => {
        const statusCode = response.ok;
        const data = response.json();
        return Promise.all([statusCode, data]);})
      .then(handleResponse)
      .then(data => {
        this.setState({ training_plans: data.data})
      })
      .catch(err => console.error(this.props.url, err.toString()))

      function handleResponse([res, data] )  {
        if (!res) {
          const { dispatch } = this.props;
          return dispatch(userActions.logout);
        }
       return {data: data}
      }   
  }

  loadExercises = () => {
    const requestOptions = {
      method: 'GET',
      headers: authHeader()
    };
    return fetch(`${config.apiUrl}/api/v1/exercises`, requestOptions )
      .then(response => response.json())
      .then(data => {
        this.setState({
          exercises: data.exercises
        })
      })
      .catch(err => console.error(this.props.url, err.toString()))
  }

  loadSeriesTypes = () => {
    const requestOptions = {
      method: 'GET',
      headers: authHeader()
    };
    return fetch(`${config.apiUrl}/api/v1/series_types`, requestOptions )
      .then(response => response.json())
      .then(data => {
        this.setState({
          series_types: data.series_types
        })
      })
      .catch(err => console.error(this.props.url, err.toString()))
  }

  componentDidMount() {
    this.loadData()
    this.loadExercises()
    this.loadSeriesTypes()
  }

  setShow = (show) => {
    this.setState({show: show});
  }

  handleChangeInput(tag) {
  	alert(tag)
    this.setState({tag})
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({ submitted: true });
    var params = {
        name: this.state.name,
        goal: this.state.goal,
        sessions: this.state.sessions,
      };
    const requestOptions = {
      method: 'POST',
      headers: authHeader(),
      body: JSON.stringify(params)
    };
    return fetch(`${config.apiUrl}/api/v1/add_training_plan`, requestOptions)
    .then(response => {
      const statusCode = response.ok;
      const data = response.json();
      return Promise.all([statusCode, data]);})
      .then(([res, data]) => {
        if (!res) {
          const errors = data.errors? get_errors(data.errors) : 'Invalid credentials'
          const session_errors = data.errors? get_sessions_errors(data.errors) : 'Invalid credentials'
          const position_errors = data.errors? get_position_errors(data.errors) : 'Invalid credentials'
          console.log('position_errors')
          console.log(position_errors)
          this.setState({ errors: errors, session_errors: JSON.parse(session_errors), position_errors: position_errors });
        }
        else {
          this.setState({ errors: [], session_errors: [], show: false });
        }
        
        return data;
        function get_errors(errors) {
          const result = Object.values(JSON.parse(errors));
          const keys = Object.keys(JSON.parse(errors));
          if ( Number.isInteger(parseInt(keys[0]))) {
            return []
          } else 
          {
            return keys.map((key, index) =>
              key + ' ' + result[index].training_positions + ' '
            )
          }
        };

          function get_sessions_errors(errors) {
            const result = Object.values(JSON.parse(errors));
            const keys = Object.keys(JSON.parse(errors));    
            if ( Number.isInteger(parseInt(keys[0]))) {
              return errors
            } else 
            {
              return []
            }
          };

          function get_position_errors(errors) {
            const result = Object.values(JSON.parse(errors));
            const keys = Object.keys(JSON.parse(errors));  
            console.log('result + keys')
            console.log(result["0"].training_positions)
            let position_errors = {}
            if ( Number.isInteger(parseInt(keys[0]))) {
             keys.map((key, index) =>
               position_errors[key] = result[index].training_positions
            )
             return position_errors
          } else 
            {
              return []
            }
          };
      })
    .catch((error) => {
      console.error(error);
    });
  }

  handleRemoveTrainingPlan = (id) => {
    const requestOptions = {
      method: 'DELETE',
      headers: authHeader()
    };
    return fetch(`${config.apiUrl}/api/v1/training_plans/${id}/delete`, requestOptions )
      .then(res => {
        if ( !res.ok ) {
          this.setState({
            errors: ['To nie Twoj trening']
          })
        }
        else {
         window.location.reload();
        }
      })
      .catch(err => console.error(this.props.url, err.toString()))
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleAddPosition = idx => evt => {
    evt.preventDefault();
    let sessions = [...this.state.sessions];
	  let session = {...sessions[idx]};
	  session.training_positions = session.training_positions.concat([{number_of_repetitions: [1,2], break_after: [], duration: [], exercise_id: "1", position_type: '0'}])
	  sessions[idx] = session;
	  this.setState({sessions});
  };

  handleRemovePosition = (idx, p_idx) => evt => {
    evt.preventDefault();
    let sessions = [...this.state.sessions];
	  let session = {...sessions[idx]};
	  session.training_positions = session.training_positions.filter((t, tidx) => tidx !== p_idx);
	  sessions[idx] = session;
	  this.setState({sessions});;
  };

  handleAddSession = (e) => {
    e.preventDefault();
     this.setState({
      sessions: this.state.sessions.concat([{name: '', training_positions: [{number_of_repetitions: [1,2], break_after: [], duration: [], exercise_id: "1", position_type: '0'}]}])
    });
  };

	handleRemoveSession = (session_index) => e => {
		e.preventDefault();
	  this.setState({sessions: this.state.sessions.filter((s, sidx) => sidx !== session_index)});;
	}


  handleSessionNameChange = idx => evt => {
  const newSessions = this.state.sessions.map((session, sidx) => {
      if (idx !== sidx) return session;
      return { ...session, name: evt.target.value };
    });

    this.setState({ sessions: newSessions });
  }

	handlePositonExerciseChange = (session_index, position_index) => evt =>{
	  let sessions = [...this.state.sessions];
	  let session = {...sessions[session_index]};
	  let position = session.training_positions[position_index]
	  position.exercise_id = evt.target.value;
	  sessions[session_index] = session;
	  this.setState({sessions});
	}

	handlePositonTypeChange = (session_index, position_index) => evt =>{
	  let sessions = [...this.state.sessions];
	  let session = {...sessions[session_index]};
	  let position = session.training_positions[position_index]
	  position.position_type = evt.target.value;
	  sessions[session_index] = session;
	  this.setState({sessions});
	}

 handlePositionAddNumberOfRepetitions = (session_index, position_index) => event =>{
 	event.preventDefault();
 	 if (event.key === "Enter" && event.target.value !== "") {
		  let sessions = [...this.state.sessions];
		  let session = {...sessions[session_index]};
		  let position = session.training_positions[position_index]
		  position.number_of_repetitions = position.number_of_repetitions.concat([event.target.value]);
		  console.log(position.number_of_repetitions)
		  sessions[session_index] = session;
		  this.setState({sessions});
		  event.target.value = "";
	  }
	}

 handlePositionRemoveNumberOfRepetitions = (session_index, position_index, n_o_r_index) => event =>{
	  let sessions = [...this.state.sessions];
	  let session = {...sessions[session_index]};
	  let position = session.training_positions[position_index]
	  position.number_of_repetitions = position.number_of_repetitions.filter((s, sidx) => n_o_r_index !== sidx);
	  console.log(position.number_of_repetitions)
	  sessions[session_index] = session;
	  this.setState({sessions});
	}

 handlePositionAddBreakAfter = (session_index, position_index) => event =>{
 	event.preventDefault();
 	 if (event.key === "Enter" && event.target.value !== "") {
		  let sessions = [...this.state.sessions];
		  let session = {...sessions[session_index]};
		  let position = session.training_positions[position_index]
		  position.break_after = position.break_after.concat([event.target.value]);
		  console.log(position.break_after)
		  sessions[session_index] = session;
		  this.setState({sessions});
		  event.target.value = "";
	  }
	}

	 handlePositionRemoveBreakAfter = (session_index, position_index, n_o_r_index) => event =>{
	  let sessions = [...this.state.sessions];
	  let session = {...sessions[session_index]};
	  let position = session.training_positions[position_index]
	  position.break_after = position.break_after.filter((s, sidx) => n_o_r_index !== sidx);
	  console.log(position.break_after)
	  sessions[session_index] = session;
	  this.setState({sessions});
	}


 handlePositionAddDuration = (session_index, position_index) => event =>{
 	 if (event.key === "Enter" && event.target.value !== "") {
		  let sessions = [...this.state.sessions];
		  let session = {...sessions[session_index]};
		  let position = session.training_positions[position_index]
		  position.duration = position.duration.concat([event.target.value]);
		  sessions[session_index] = session;
		  this.setState({sessions});
		  event.target.value = "";
	  }
	}

	handlePositionRemoveDuration = (session_index, position_index, n_o_r_index) => event =>{
	  let sessions = [...this.state.sessions];
	  let session = {...sessions[session_index]};
	  let position = session.training_positions[position_index]
	  position.duration = position.duration.filter((s, sidx) => n_o_r_index !== sidx);
	  sessions[session_index] = session;
	  this.setState({sessions});
	}


  show_errors_for_sessions = (errors) => {
    const result = Object.values(errors);
    const keys = Object.keys(errors);
      return keys.map((key, index) =>
        key + ' ' + result[index] + ' '
          )
  }

  show_errors_for_position = (errors, position_index) => {
  	const result = Object.values(errors);
  	if (result[position_index] ==  'undefined' || result[position_index] ==  null ) {
  		return ''
  	}
    const keys = Object.keys(result[position_index]);
    const position_result = Object.values(result[position_index]);

      return keys.map((key, index) =>
        key + ' ' + get_errors_from_array(position_result[index]) + ' '
          )
      function get_errors_from_array(errors) {
      	if (Array.isArray(errors)) {
      		console.log('nie array')
      		return errors
      	}
      	const result = Object.values(errors);
        const keys = Object.keys(errors);
      	return keys.map((key,index) =>
      		result[index] + ' '
      		)
      } 
  }

  render() {
    const { name, date, submitted } = this.state;
    return (

      <div className="container">
        <Button variant="light" onClick={() => this.setShow(true)}>
          + Dodaj Plan Treningowy
        </Button>
        <TrainingPlanModal {...this.state} handleSessionNameChange= {this.handleSessionNameChange} handlePositonExerciseChange = {this.handlePositonExerciseChange} handlePositionAddNumberOfRepetitions = {this.handlePositionAddNumberOfRepetitions}
          handlePositionRemoveNumberOfRepetitions = {this.handlePositionRemoveNumberOfRepetitions} handlePositionAddBreakAfter = {this.handlePositionAddBreakAfter} handlePositionRemoveBreakAfter = {this.handlePositionRemoveBreakAfter} 
          handlePositonTypeChange = {this.handlePositonTypeChange} handleSubmit = { this.handleSubmit } setShow = {this.setShow} show_errors_for_position = { this.show_errors_for_position }
          handlePositionAddDuration = {this.handlePositionAddDuration} handlePositionRemoveDuration = {this.handlePositionRemoveDuration} handleChange = {this.handleChange} handleAddPosition = {this.handleAddPosition} handleRemovePosition = {this.handleRemovePosition}
          handleAddSession = {this.handleAddSession} handleRemoveSession = {this.handleRemoveSession} handleChangeGoal= {this.handleChangeGoal} show_errors_for_sessions = {this.show_errors_for_sessions} title = 'Dodaj Plan Treningowy'>
        </TrainingPlanModal>
        <hr/>
          <div className="row">
            {this.state.training_plans.map((training_plan, index) => (
              <div className="col-5 training-index">
                <a href={"/training_plans/" + training_plan.id}><p>{training_plan.name}</p></a>
                <a href={"/training_plans/" + training_plan.id + "/edit"}><p>Edytuj</p></a>
                 <div className="remove-icon">
                      <i className="fas fa-2x fa-minus-circle"
                        onClick={() => this.handleRemoveTrainingPlan(training_plan.id)}
                      >
                      </i>
                  </div>
              </div>
            ))}
          </div>
      </div>
    );
  }
};
