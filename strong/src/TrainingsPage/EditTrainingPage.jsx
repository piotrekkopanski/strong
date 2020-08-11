import React from 'react';
import { config } from '../_constants';
import { history } from '../_helpers';
import { authHeader } from '../_helpers';
import TrainingModal  from '../TrainingsPage/TrainingModal.jsx';

export default class EditTrainingsPage extends React.Component {
  constructor() {
	super();
	this.state = {
	  name: '',
	  date: new Date(),
	  submitted: false,
	  show: true,
	  exercises: [],
	  series_types: [],
	  series: [{ number_of_repetitions: "", weight: "", break_after: "", duration: "", exercise_id: "", series_type: '3' }],
	  errors: [],
	  series_errors: {},
	  training: {}
	};  
  }

  loadData = () => {
  	var id = this.props.match.params.id
  	const requestOptions = {
      method: 'GET',
      headers:  authHeader()
    };
    return fetch(`${config.apiUrl}/api/v1/trainings/${id}`, requestOptions)
      .then(response => response.json())
      .then(data => {
        this.setState({
          name: data.name,
          date: new Date(data.date),
          series: data.series
        })
      })
      .catch(err => console.error(this.props.url, err.toString()))
  }

  loadExercises = () => {
  	const requestOptions = {
      method: 'GET',
      headers:  authHeader()
    };
    return fetch(`${config.apiUrl}/api/v1/exercises`,  requestOptions)
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
  	this.loadSeriesTypes()
		this.loadData()
		this.loadExercises()
  }

  setShow = (show) => {
	  this.setState({show: show});
	  if (show == false) {
	  	history.push('/trainings');
	  }
  }

  handleSubmit = (event) => {
	  event.preventDefault();
	  this.setState({ submitted: true });
	  var params = {
		  name: this.state.name,
		  date: this.state.date,
		  series: this.state.series,
		};
		var id = this.props.match.params.id
	  var requestOptions_1 = {
			method: 'PUT',
			body: JSON.stringify(params),
			headers: authHeader()	
	  };
	  return fetch(`${config.apiUrl}/api/v1/trainings/${id}/edit`, requestOptions_1)
	    .then(response => {
				const statusCode = response.ok;
				const data = response.json();
	      return Promise.all([statusCode, data]);})
	    .then(([res, data]) => {
			if (!res) {
			  const errors = data.errors? get_errors(data.errors) : 'Invalid credentials'
			  const series_errors = data.errors? get_series_errors(data.errors) : 'Invalid credentials'
			  console.log('errors !!!!')
			  console.log(series_errors)
			  console.log( JSON.parse(series_errors))
			  this.setState({ errors: errors, series_errors: JSON.parse(series_errors) });
			}
			else {
			  this.setState({ errors: [], series_errors: [] });
			  history.push('/trainings');
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

	  <div>
      <TrainingModal {...this.state} handleSeriesNumberOfRepetitionsChange = {this.handleSeriesNumberOfRepetitionsChange} handleSeriesWeightChange = {this.handleSeriesWeightChange}
        handleSeriesExerciseChange = {this.handleSeriesExerciseChange } handleSeriesDurationChange = {this.handleSeriesDurationChange} handleSeriesBreakAfterChange = {this.handleSeriesBreakAfterChange} 
        handleSeriesBreakAfterChang = {this.handleSeriesBreakAfterChang} handleSubmit = { this.handleSubmit } setShow = {this.setShow}  handleSeriesTypeChange = {this.handleSeriesTypeChange}
        handleRemoveSeries ={this.handleRemoveSeries}  handleAddSeries = {this. handleAddSeries} handleChange = {this.handleChange}
        handleChangeDate= {this.handleChangeDate} show_errors_for_series = {this.show_errors_for_series} title = 'Edytuj Trening' >
        </TrainingModal>
	  </div>
	);
  }
};
