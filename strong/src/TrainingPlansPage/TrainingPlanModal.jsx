import React from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default class TrainingPlanModal extends React.Component {
  constructor(props) {
    super(props);
  }

 
  render() {
    const {
    	handleChange, handleSubmit, show_errors_for_sessions, setShow,
    	handleSeriesNumberOfRepetitionsChange, handleSeriesExerciseChange,
    	handleSeriesDurationChange, handleSeriesBreakAfterChange, handlePositionRemoveNumberOfRepetitions,
    	handleSeriesBreakAfterChang, handleRemoveSeries,  handleAddSeries, show_errors_for_position,
    	handleChangeGoal, handleSeriesWeightChange, handleSeriesTypeChange, name, goal, submitted, title
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
          
            <form name="form" form="plan" >
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
                      <label className="font-courier" htmlFor="goal">Cel</label>
                        <input type="text" className={'form-control' + (submitted && !goal ? ' has-error' : '')} name="goal" value={goal} onChange={this.props.handleChange} />
                      {submitted && !goal &&
                          <div className="alert alert-danger">Goal is required</div>
                      }
                  </div>
                </div>
             
            <div className="col-12"> <h3> Sesje treningowe </h3> </div>
<hr/>
                {this.props.sessions.map((session, idx) => (
                  <div className='col-12 session'>
                   { this.props.session_errors[idx] && 
                      <div className="series_error col-12">{ this.props.show_errors_for_sessions(this.props.session_errors[idx], idx)} </div>
                
                    }

                    <div className="col-12">
                     <div className='form-group col-2'>
                     <label className='form-series font-courier'>Name</label>
                      <input
                        type="text"
                        placeholder={"Name"}
                        value={session.name}
                        className={'input-big' + (submitted && !session.name ? ' has-error' : '')}
                        onChange={this.props.handleSessionNameChange(idx)}
                      />
                    </div>
                    </div>
                    <div className="row positions">
                    	   {session.training_positions.map((position, p_idx) => (
                    	   	<div className="col-12">
                    	   	    { this.props.position_errors[idx] && 
                               <div className="series_error col-12">{ this.props.show_errors_for_position(this.props.position_errors[idx], p_idx)} </div>
                
                            }
                          <div className="position col-2 form exercise">
                            <div className='form-group'>
                              <label className='form-series exercise font-courier'>Ćwiczenie</label>
				                      <select
				                      value={position.exercise_id}
				                      className={'form-control input-small exercise' + (submitted && !position.exercise_id ? ' has-error' : '')}
				                      onChange={this.props.handlePositonExerciseChange(idx, p_idx)}
				                      >
				                      {this.props.exercises.map((exercise, idx) => (
				                        <option value={exercise.id}>{exercise.name}</option>
				                      ) )}
				                      </select>
                            </div>
                            </div>
          							   <div className={"position col-4 form" + (position.position_type == '3' ? ' hide' : '')} >
          							     <div className='form-group'>
          							      <label className='form-series font-courier'>L.powtórzeń</label>
						                  
																<div className="tags-input">
											            <ul className="tag horizontally">
											                {position.number_of_repetitions.map((single_number_of_repetitions, index) => (
											                    <li className="tag horizontally" key={index}>
											                        <span className="tag">{single_number_of_repetitions}</span>
											                      
											                        <i
																		            className="fas fa-2x fa-minus-circle"
																		            onClick={ this.props.handlePositionRemoveNumberOfRepetitions(idx, p_idx, index)} 
																		        >
																		            
																		        </i>
											                    </li>
											                ))}
											            </ul>
											            <input className="tag"
											                type="text"
											                onKeyUp={this.props.handlePositionAddNumberOfRepetitions(idx, p_idx)}
											                placeholder="Press enter to add"
											            />
																 </div>
																</div>
          							   </div>

          							   <div className="position col-4 form break_after">
          							     <div className='form-group'>
          							      <label className='form-series font-courier'>Przerwy</label>
						                  
																<div className="tags-input">
											            <ul className="tag horizontally">
											                {position.break_after.map((single_break_after, index) => (
											                    <li className="tag horizontally" key={index}>
											                        <span className="tag">{single_break_after}</span>
											                      
											                        <i
																		            className="fas fa-2x fa-minus-circle"
																		            onClick={ this.props.handlePositionRemoveBreakAfter(idx, p_idx, index)} 
																		        >
																		            
																		        </i>
											                    </li>
											                ))}
											            </ul>
											            <input className="tag"
											                type="time"
											                onKeyUp={this.props.handlePositionAddBreakAfter(idx, p_idx)}
											                placeholder="Press enter to add break after"
											            />
																 </div>
																</div>
          							   </div>


          							   <div className={"position col-4 form duration" + (position.position_type != '3' ? ' hide' : '')} >
          							     <div className='form-group'>
          							      <label className='form-series font-courier'>Czas trwania</label>
						                  
																<div className="tags-input">
											            <ul className="tag horizontally">
											                {position.duration.map((single_duration, index) => (
											                    <li className="tag horizontally" key={index}>
											                        <span className="tag">{single_duration}</span>
											                      
											                        <i
																		            className="fas fa-2x fa-minus-circle"
																		            onClick={ this.props.handlePositionRemoveDuration(idx, p_idx, index)} 
																		        >
																		            
																		        </i>
											                    </li>
											                ))}
											            </ul>
											            <input className="tag"
											                type="time"
											                onKeyUp={this.props.handlePositionAddDuration(idx, p_idx)}
											                placeholder="Press enter to add duration"
											            />
																 </div>
																</div>
          							   </div>


          							   <div className="position col-2 form type" >
                             <div className='form-group'>
                               <label className='form-series font-courier'>typ</label>
					                      <select
				                      value={position.position_type}
				                      className={'form-control input-small' + (submitted && !position.position_type ? ' has-error' : '')}
				                      onChange={this.props.handlePositonTypeChange(idx, p_idx)}
				                      >
				                       {this.props.series_types.map((type, idx) => (
                                 <option value={type[1]}>{type[0]}</option>
                                ))}
				                      </select>
                             </div>
          							   </div>
          							   <i className="fas fa-3x fa-trash-alt" onClick={this.props.handleRemovePosition(idx, p_idx)}></i>
                           </div>

                       ))}
                    	   </div>
                    	   <div className="row add_position">
                    	  <i className="fas fa-3x fa-plus-circle" onClick={this.props.handleAddPosition(idx)}>Dodaj Pozycje</i>
           
                    	  </div>
                    	  <div className="remove_position">
                    	  <i className="fas fa-3x fa-minus-circle" onClick={this.props.handleRemoveSession(idx)}>Usun Sesje</i>
                    	  </div>
                    </div>


                  
                ))}
											              
</div>
              
            </form>
             <div className="row justify-content-between">
			              <button
			                type="button"
			                onClick={this.props.handleAddSession}
			                className="btn btn-outline-primary"
			              >
			                Dodaj Sesje Treningową
			              </button>
			              <button form="plan" onClick={this.props.handleSubmit} className="btn btn-primary">Save</button>
                  </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
};
