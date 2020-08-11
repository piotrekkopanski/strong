import React from 'react';
import { config } from '../_constants';
// import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import DatePicker from "react-datepicker";
import { authHeader } from '../_helpers';
 
import "react-datepicker/dist/react-datepicker.css";

export default class TrainingPage extends React.Component {
  constructor() {
    super();
    this.state = {
      name: '',
      show: true,
      series: [{ number_of_repetitions: "", weight: "", break_after: "", duration: "", exercise_id: "" }],
      training: {}
    };  
  }

   setShow(show) {
    this.setState({show: show});
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
          training: data
        })
      })
      .catch(err => console.error(this.props.url, err.toString()))
  }

  componentDidMount() {
    this.loadData()
  }

  render() {
    return (

      <div>
        <Modal
          show={this.state.show}
          onHide={() => this.setShow(false)}
          dialogClassName="modal-90w"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-custom-modal-styling-title">
              {this.state.training.name + ' ' + this.state.training.date}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <div className="container-fluid">
          	{this.state.training.series? this.state.training.series.map((series, index) => (
          		<div className={'row series_box ' + series.series_type_string}>
          		  <div className="show-series col-3 exercise">
                <label className="show-series exercise font-courier"><strong>Ćwiczenie</strong></label>
                {series.exercise}
              </div>
              <div className="show-series col-2">
                <label className="show-series font-courier"><strong>Obciążenie</strong></label>
                {series.weight}
              </div>
              <div className={"show-series col-2"  + (series.series_type == '3' ? ' hide' : '')}>
                <label className="show-series font-courier"><strong>L. powtórzeń</strong></label>
                {series.number_of_repetitions}
              </div>
               <div className="show-series col-2">
                <label className="show-series font-courier"><strong>Przerwa</strong></label>
                {series.break_after}
              </div>
              <div className={"show-series col-2" + (series.series_type != '3' ? ' hide' : '')}>
                <label className="show-series font-courier"><strong>Czas trwania</strong></label>
                {series.duration}
              </div>
               <div className="show-series col-2">
                <label className="show-series font-courier"><strong>Typ</strong></label>
                {series.series_type_string}
              </div>{ series.series_type == '3' ? <i class="fas fa-2x fa-heartbeat"></i> : ''}
             </div>
          		)) : ''}
          </div>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
};
