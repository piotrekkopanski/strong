import React from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default class TrainingModal extends React.Component {
  constructor(props) {
    super(props);
  }

 
  render() {
    const {
    	handleChange, handleSubmit, show_errors_for_series, setShow,
    	handleSeriesNumberOfRepetitionsChange, handleSeriesExerciseChange,
    	handleSeriesDurationChange, handleSeriesBreakAfterChange,
    	handleSeriesBreakAfterChang, handleRemoveSeries,  handleAddSeries,
    	handleChangeDate, handleSeriesWeightChange, handleSeriesTypeChange, name, date, submitted, title
    } = this.props;
    return (

      <div>
        <Modal
          show={this.props.show}
          onHide={() => this.props.setShow(false)}
          dialogClassName="modal-90w"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-custom-modal-styling-title">
              { this.props.title }
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <div className="container-fluid">
            {this.props.errors.map((error, index) => (
              <div className="error-message"><h4>{error}</h4></div>
            ))}
          
            <form name="form" onSubmit={this.props.handleSubmit}>
              <div className='row'>
                <div className="col-6">
                  <div className='form-group'>
                      <label className="font-courier" htmlFor="name">name</label>
                      <input type="text" className={'form-control' + (submitted && !name ? ' has-error' : '')} name="name" value={name} onChange={this.props.handleChange} />
                      {submitted && !name &&
                          <div className="alert alert-danger">Name is required</div>
                      }
                  </div>
                </div>
                <div className="col-6">
                  <div className='form-group'>
                      <label className="font-courier" htmlFor="date">date</label>
                      <DatePicker
                        selected={this.props.date}
                        onChange={this.props.handleChangeDate}
                        className={'form-control' + (submitted && !date ? ' has-error' : '')}
                      />
                      {submitted && !date &&
                          <div className="alert alert-danger">Date is required</div>
                      }
                  </div>
                </div>
             </div>
             <h3> Series </h3>
                {this.props.series.map((series, idx) => (
                  <div className='row series_box'>
                   { this.props.series_errors[idx] && 
                      <div className="series_error col-12">{ this.props.show_errors_for_series(this.props.series_errors[idx])} </div>
                
                    }
                   <div className="series col-3 form exercise">
                     <div className='form-group'>
                     <label className='form-series exercise font-courier'>Ćwiczenie</label>
                      <select
                      value={series.exercise_id}
                      className={'form-control input-small exercise' + (submitted && !series.weight ? ' has-error' : '')}
                      onChange={this.props.handleSeriesExerciseChange(idx)}
                      >
                      {this.props.exercises.map((exercise, idx) => (
                        <option value={exercise.id}>{exercise.name}</option>
                      ) )}
                      </select>
                    </div>
                    </div>
                    <div className="series col-2 form">
                     <div className='form-group'>
                     <label className='form-series font-courier'>Ciężar</label>
                      <input
                        type="text"
                        placeholder={"Ciężar [kg/lbs]"}
                        value={series.weight}
                        className={'input-small' + (submitted && !series.weight ? ' has-error' : '')}
                        onChange={this.props.handleSeriesWeightChange(idx)}
                      />
                    </div>
                    </div>
                    <div className={"series col-2 form" + (series.series_type == '3' ? ' hide' : '')}>
                    <div className='form-group'>
                    <label className='form-series font-courier'>L.powtórzeń</label>
                      <input
                        type="text"
                        placeholder={"Powtórzenia"}
                        value={series.number_of_repetitions}
                        className={'input-small' + (submitted && !series.number_of_repetitions ? ' has-error' : '')}
                        onChange={this.props.handleSeriesNumberOfRepetitionsChange(idx)}
                      />
                    </div>
                    </div>
                    <div className={"series col-2 form" + (series.series_type != '3' ? ' hide' : '')}>
                    <div className='form-group'>
                    <label className='form-series font-courier'>Czas trwania</label>
                      <input
                        type="time"
                        placeholder={"Czas trwania"}
                        value={series.duration}
                        className={'input-small time' + (submitted && !series.duration ? ' has-error' : '')}
                        onChange={this.props.handleSeriesDurationChange(idx)}
                      />
                      </div>
                    </div>
                    <div className="series col-2 form">
                    <div className='form-group'>
                    <label className='form-series font-courier'>Przerwa po</label>
                      <input
                        type="time"
                        placeholder={"Przerwa"}
                        value={series.break_after}
                        className={'input-small time' + (submitted && !series.break_after ? ' has-error' : '')}
                        onChange={this.props.handleSeriesBreakAfterChange(idx)}
                      />
                    </div>
                    </div>
               <div className="series col-2 form types">
                     <div className='form-group'>
                     <label className='form-series font-courier'>typ</label>
                      <select
                      value={series.series_type}
                      className={'form-control input-small type' + (submitted && !series.weight ? ' has-error' : '')}
                      onChange={this.props.handleSeriesTypeChange(idx)}
                      >
                      {this.props.series_types.map((type, idx) => (
                        <option value={type[1]}>{type[0]}</option>
                      ) )}
                      </select>
                    </div>
                    </div>
                      <div className="remove-icon">
                      <i className="fas fa-2x fa-minus-circle"
                        onClick={this.props.handleRemoveSeries(idx)}
                      >
                      </i>
                      </div>
                  </div>
                ))}
              
            <div className="row justify-content-between">
              <button
                onClick={this.props.handleAddSeries}
                className="btn btn-outline-primary"
              >
                Add Series
              </button>
         
              
                <button className="btn btn-primary">Save</button>
              </div>
              <p/>
            </form>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
};
