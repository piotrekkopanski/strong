import React from 'react';
import { config } from '../_constants';
import { authHeader } from '../_helpers';
import Button from 'react-bootstrap/Button'
import TrainingModal  from '../TrainingsPage/TrainingModal.jsx';
import { userActions } from '../_actions';

export default class TrainingsPage extends React.Component {
  constructor() {
    super();
    this.state = {
      name: '',
      date: new Date(),
      submitted: false,
      show: false,
      exercises: [],
      series_types: [],
      series: [{ number_of_repetitions: "", weight: "", break_after: "01:00", duration: "", exercise_id: "1", series_type: '0'}],
      errors: [],
      series_errors: {},
      trainings: []
    };  
  }

  loadData = () => {
    const requestOptions = {
      method: 'GET',
      headers:  authHeader()
    };

    return fetch(`${config.apiUrl}/api/v1/trainings`, requestOptions )
      .then(response => {
        const statusCode = response.ok;
        const data = response.json();
        return Promise.all([statusCode, data]);})
      .then(handleResponse)
      .then(data => {
        this.setState({ trainings: data.data})
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

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({ submitted: true });
    var params = {
        name: this.state.name,
        date: this.state.date,
        series: this.state.series,
      };
    const requestOptions = {
      method: 'POST',
      headers: authHeader(),
      body: JSON.stringify(params)
    };
    return fetch(`${config.apiUrl}/api/v1/add_training`, requestOptions)
    .then(response => {
      const statusCode = response.ok;
      const data = response.json();
      return Promise.all([statusCode, data]);})
      .then(([res, data]) => {
        if (!res) {
          const errors = data.errors? get_errors(data.errors) : 'Invalid credentials'
          const series_errors = data.errors? get_series_errors(data.errors) : 'Invalid credentials'
          this.setState({ errors: errors, series_errors: JSON.parse(series_errors) });
        }
        else {
          this.setState({ errors: [], series_errors: [], show: false });
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
              key + ' ' + result[index] + ' '
            )
          }
        };

          function get_series_errors(errors) {
            const result = Object.values(JSON.parse(errors));
            const keys = Object.keys(JSON.parse(errors));    
            if ( Number.isInteger(parseInt(keys[0]))) {
              return errors
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

  handleRemoveTraining = (id) => {
    const requestOptions = {
      method: 'DELETE',
      headers: authHeader()
    };
    return fetch(`${config.apiUrl}/api/v1/trainings/${id}/delete`, requestOptions )
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

  handleChangeDate = date => {
    this.setState({
      date: date
    });
  };


  handleAddSeries = (e) => {
    e.preventDefault();
    let number_of_repetitions = this.state.series[this.state.series.length-1].number_of_repetitions
    let weight = this.state.series[this.state.series.length-1].weight
    let break_after = this.state.series[this.state.series.length-1].break_after
    let duration = this.state.series[this.state.series.length-1].duration
    let exercise_id = this.state.series[this.state.series.length-1].exercise_id
    let series_type = this.state.series[this.state.series.length-1].series_type
    this.setState({
      series: this.state.series.concat([{ number_of_repetitions: number_of_repetitions? number_of_repetitions : "", weight: weight? weight: "", break_after: break_after? break_after : "01:00", duration: duration? duration : "01:00", exercise_id: exercise_id? exercise_id : "1", id: '0', series_type: series_type? series_type: '0'}])
    });
  };

  handleRemoveSeries = idx => () => {
    this.setState({
      series: this.state.series.filter((s, sidx) => idx !== sidx)
    });
  };

  handleSeriesNumberOfRepetitionsChange = idx => evt => {
    const newSeries = this.state.series.map((series, sidx) => {
      if (idx !== sidx) return series;
      return { ...series, number_of_repetitions: evt.target.value };
    });

    this.setState({ series: newSeries });
  };

  handleSeriesWeightChange = idx => evt => {
    const newSeries = this.state.series.map((series, sidx) => {
      if (idx !== sidx) return series;
      return { ...series, weight: evt.target.value };
    });

    this.setState({ series: newSeries });
  };

  handleSeriesExerciseChange = idx => evt => {
    const newSeries = this.state.series.map((series, sidx) => {
      if (idx !== sidx) return series;
      return { ...series, exercise_id: evt.target.value };
    });

    this.setState({ series: newSeries });
  };

  handleSeriesBreakAfterChange = idx => evt => {
    const newSeries = this.state.series.map((series, sidx) => {
      if (idx !== sidx) return series;
      return { ...series, break_after: evt.target.value };
    });

    this.setState({ series: newSeries });
  };

  handleSeriesDurationChange = idx => evt => {
    const newSeries = this.state.series.map((series, sidx) => {
      if (idx !== sidx) return series;
      return { ...series, duration: evt.target.value };
    });

    this.setState({ series: newSeries });
  };

  handleSeriesTypeChange = idx => evt => {
    const newSeries = this.state.series.map((series, sidx) => {
      if (idx !== sidx) return series;
      return { ...series, series_type: evt.target.value };
    });

    this.setState({ series: newSeries });
  };

  show_errors_for_series = (errors) => {
    const result = Object.values(errors);
    const keys = Object.keys(errors);
      return keys.map((key, index) =>
        key + ' ' + result[index] + ' '
          )
  }

  render() {
    const { name, date, submitted } = this.state;
    return (

      <div className="container">
        <Button variant="light" onClick={() => this.setShow(true)}>
          + Add training
        </Button>
        <TrainingModal {...this.state} handleSeriesNumberOfRepetitionsChange = {this.handleSeriesNumberOfRepetitionsChange} handleSeriesWeightChange = {this.handleSeriesWeightChange}
        handleSeriesExerciseChange = {this.handleSeriesExerciseChange } handleSeriesDurationChange = {this.handleSeriesDurationChange} handleSeriesBreakAfterChange = {this.handleSeriesBreakAfterChange} 
        handleSeriesBreakAfterChange = {this.handleSeriesBreakAfterChange} handleSubmit = { this.handleSubmit } setShow = {this.setShow} handleSeriesTypeChange = {this.handleSeriesTypeChange}
        handleRemoveSeries ={this.handleRemoveSeries}  handleAddSeries = {this. handleAddSeries} handleChange = {this.handleChange}
        handleChangeDate= {this.handleChangeDate} show_errors_for_series = {this.show_errors_for_series} title = 'Dodaj Trening'>
        </TrainingModal>
        <hr/>
          <div className="row">
            {this.state.trainings.map((training, index) => (
              <div className="col-5 training-index">
                <a href={"/trainings/" + training.id}><p>{training.name} {training.date}</p></a>
                <a href={"/trainings/" + training.id + "/edit"}><p>Edytuj</p></a>
                 <div className="remove-icon">
                      <i className="fas fa-2x fa-minus-circle"
                        onClick={() => this.handleRemoveTraining(training.id)}
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
